import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  Flex,
  LogoutIcon,
  RefreshIcon,
  Text,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
  UserMenuVariant,
  useModal,
} from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useAirdropModalStatus from 'components/GlobalCheckClaimStatus/hooks/useAirdropModalStatus'
import Trans from 'components/Trans'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
import { useDomainNameForAddress } from 'hooks/useDomain'
import NextLink from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useProfile } from 'state/profile/hooks'
import { usePendingTransactions } from 'state/transactions/hooks'
import styled from 'styled-components'
import { PointsData } from 'views/PlunderPoints'
import { useAccount } from 'wagmi'
import WalletModal, { WalletView } from './WalletModal'
import WalletUserMenuItem from './WalletUserMenuItem'

const PointsBreakdown = styled(Box)`
  padding: 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  font-size: 12px;
  display: none;
  position: absolute;
  right: 100%;
  top: 0;
  margin-right: 8px;
  width: 200px;
  z-index: 1000;
`

const PointsMenuItem = styled(UserMenuItem)`
  position: relative;

  @media screen and (min-width: 852px) {
    &:hover ${PointsBreakdown} {
      display: block;
    }
  }
`

const MobilePointsMenuItem = styled(UserMenuItem)`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BreakdownItem = styled(Flex)`
  justify-content: space-between;
  padding: 4px 0;
`

const MobileBreakdown = styled(Box)`
  padding: 8px 16px;
  margin-top: 4px;
  background: ${({ theme }) => theme.colors.backgroundAlt2};
  border-radius: 8px;
`

const PointsMenuContent = styled(Flex)`
  width: 100%;
  align-items: center;
`

const ToggleButton = styled(Button)`
  padding: 0 8px;
  margin-left: 8px;
  height: 24px;
  min-width: 24px;
  border-radius: 8px;
`

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => theme.colors.cardBorder};
  margin: 0 8px;
`

const UserMenuItems = () => {
  const { t } = useTranslation()
  const { chainId, isWrongNetwork } = useActiveChainId()
  const { logout } = useAuth()
  const { address: account } = useAccount()
  const { hasPendingTransactions } = usePendingTransactions()
  const { isInitialized, isLoading, profile } = useProfile()
  const { shouldShowModal } = useAirdropModalStatus()
  const [points, setPoints] = useState<PointsData | null>(null)
  const [showMobileBreakdown, setShowMobileBreakdown] = useState(false)
  const isMobile = window.innerWidth < 852

  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)
  const [onPresentWrongNetworkModal] = useModal(<WalletModal initialView={WalletView.WRONG_NETWORK} />)
  const hasProfile = isInitialized && !!profile

  const onClickWalletMenu = useCallback((): void => {
    if (isWrongNetwork) {
      onPresentWrongNetworkModal()
    } else {
      onPresentWalletModal()
    }
  }, [isWrongNetwork, onPresentWalletModal, onPresentWrongNetworkModal])

  const handlePointsClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault()
      setShowMobileBreakdown(true)
    }
  }

  useEffect(() => {
    const fetchPoints = async () => {
      if (!account) return
      try {
        const response = await fetch('https://static.plunderswap.com/PlunderPoints.json')
        const data = await response.json()
        const userPoints = data.find((p: PointsData) => p.wallet_address.toLowerCase() === account.toLowerCase())
        setPoints(userPoints || null)
      } catch (error) {
        console.error('Error fetching points:', error)
      }
    }

    fetchPoints()
  }, [account])

  return (
    <>
      <WalletUserMenuItem isWrongNetwork={isWrongNetwork} onPresentWalletModal={onClickWalletMenu} />
      {points && (
        <>
          {isMobile ? (
            <>
              <MobilePointsMenuItem>
                <NextLink href="/plunder-points" passHref style={{ flex: 1 }}>
                  <Flex alignItems="center" justifyContent="space-between" width="100%">
                    <Text>{t('PlunderPoints')}</Text>
                    <Text bold>{points.total_points.toLocaleString()}</Text>
                  </Flex>
                </NextLink>
                <ToggleButton
                  scale="sm"
                  variant="text"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowMobileBreakdown(!showMobileBreakdown)
                  }}
                >
                  {showMobileBreakdown ? '↑' : '↓'}
                </ToggleButton>
              </MobilePointsMenuItem>
              {showMobileBreakdown && (
                <MobileBreakdown>
                  {points.zilnames_points > 0 && (
                    <BreakdownItem>
                      <Text>{t('Zilnames')}</Text>
                      <Text>{points.zilnames_points.toLocaleString()}</Text>
                    </BreakdownItem>
                  )}
                  {points.early_bird_swap_points > 0 && (
                    <BreakdownItem>
                      <Text>{t('Early Bird Swap')}</Text>
                      <Text>{points.early_bird_swap_points.toLocaleString()}</Text>
                    </BreakdownItem>
                  )}
                  {points.early_bird_lp_points > 0 && (
                    <BreakdownItem>
                      <Text>{t('Early Bird LP')}</Text>
                      <Text>{points.early_bird_lp_points.toLocaleString()}</Text>
                    </BreakdownItem>
                  )}
                  {points.swap_points > 0 && (
                    <BreakdownItem>
                      <Text>{t('Swap')}</Text>
                      <Text>{points.swap_points.toLocaleString()}</Text>
                    </BreakdownItem>
                  )}
                  {points.lp_points > 0 && (
                    <BreakdownItem>
                      <Text>{t('LP')}</Text>
                      <Text>{points.lp_points.toLocaleString()}</Text>
                    </BreakdownItem>
                  )}
                </MobileBreakdown>
              )}
            </>
          ) : (
            <NextLink href="/plunder-points" passHref>
              <PointsMenuItem as="a">
                <Flex alignItems="center" justifyContent="space-between" width="100%">
                  <Text>{t('PlunderPoints')}</Text>
                  <Text bold>{points.total_points.toLocaleString()}</Text>
                </Flex>
                <PointsBreakdown>
                  {points.zilnames_points > 0 && (
                    <BreakdownItem>
                      <Text>{t('Zilnames')}</Text>
                      <Text>{points.zilnames_points.toLocaleString()}</Text>
                    </BreakdownItem>
                  )}
                  {points.early_bird_swap_points > 0 && (
                    <BreakdownItem>
                      <Text>{t('Early Bird Swap')}</Text>
                      <Text>{points.early_bird_swap_points.toLocaleString()}</Text>
                    </BreakdownItem>
                  )}
                  {points.early_bird_lp_points > 0 && (
                    <BreakdownItem>
                      <Text>{t('Early Bird LP')}</Text>
                      <Text>{points.early_bird_lp_points.toLocaleString()}</Text>
                    </BreakdownItem>
                  )}
                  {points.swap_points > 0 && (
                    <BreakdownItem>
                      <Text>{t('Swap')}</Text>
                      <Text>{points.swap_points.toLocaleString()}</Text>
                    </BreakdownItem>
                  )}
                  {points.lp_points > 0 && (
                    <BreakdownItem>
                      <Text>{t('LP')}</Text>
                      <Text>{points.lp_points.toLocaleString()}</Text>
                    </BreakdownItem>
                  )}
                </PointsBreakdown>
              </PointsMenuItem>
            </NextLink>
          )}
        </>
      )}
      <UserMenuItem as="button" disabled={isWrongNetwork} onClick={onPresentTransactionModal}>
        {t('Recent Transactions')}
        {hasPendingTransactions && <RefreshIcon spin />}
      </UserMenuItem>
      {/* <UserMenuDivider />
      <NextLink href={`/profile/${account?.toLowerCase()}`} passHref>
        <UserMenuItem disabled={isWrongNetwork || chainId !== ChainId.BSC}>{t('Your NFTs')}</UserMenuItem>
      </NextLink>
      {shouldShowModal && <ClaimYourNFT />}
      <ProfileUserMenuItem
        isLoading={isLoading}
        hasProfile={hasProfile}
        disabled={isWrongNetwork || chainId !== ChainId.BSC}
      /> */}
      <UserMenuDivider />
      <UserMenuItem as="button" onClick={logout}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          {t('Disconnect')}
          <LogoutIcon />
        </Flex>
      </UserMenuItem>
    </>
  )
}

const UserMenu = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { domainName, avatar } = useDomainNameForAddress(account)
  const { isWrongNetwork } = useActiveChainId()
  const { hasPendingTransactions, pendingNumber } = usePendingTransactions()
  const { profile } = useProfile()
  const avatarSrc = profile?.nft?.image?.thumbnail ?? avatar
  const [userMenuText, setUserMenuText] = useState<string>('')
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default')

  useEffect(() => {
    if (hasPendingTransactions) {
      setUserMenuText(t('%num% Pending', { num: pendingNumber }))
      setUserMenuVariable('pending')
    } else {
      setUserMenuText('')
      setUserMenuVariable('default')
    }
  }, [hasPendingTransactions, pendingNumber, t])

  if (account) {
    return (
      <UIKitUserMenu
        account={domainName || account}
        ellipsis={!domainName}
        avatarSrc={avatarSrc}
        text={userMenuText}
        variant={userMenuVariable}
      >
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  if (isWrongNetwork) {
    return (
      <UIKitUserMenu text={t('Network')} variant="danger">
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  return (
    <ConnectWalletButton scale="sm">
      <Box display={['none', null, null, 'block']}>
        <Trans>Connect Wallet</Trans>
      </Box>
      <Box display={['block', null, null, 'none']}>
        <Trans>Connect</Trans>
      </Box>
    </ConnectWalletButton>
  )
}

export default UserMenu
