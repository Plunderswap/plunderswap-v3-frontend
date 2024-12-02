import { useTheme } from '@pancakeswap/hooks'
import { Box, CopyAddress, Flex, Heading, Link, Text } from '@pancakeswap/uikit'
import { Transak, TransakConfig } from '@transak/transak-sdk'
import { toBech32Address } from '@zilliqa-js/crypto'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

const Container = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding: 24px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`

const AddressBox = styled(Box)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 8px;
  width: 100%;
  max-width: 960px;
  margin-bottom: 8px;
`

const AddressLabel = styled(Text)`
  font-size: 10px;
  margin-bottom: 2px;
`

const StyledCopyAddress = styled(CopyAddress)`
  font-size: 12px;

  > div {
    padding: 4px 8px;
    height: 28px;
  }
`

const TransakWidget = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 700px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
`

const InfoSection = styled(Flex)`
  width: 100%;
  max-width: 1200px;
  gap: 24px;
  margin-top: 24px;
  flex-direction: row;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`

const InfoCard = styled(Box)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 16px;
  padding: 24px;
  flex: 1;
  text-align: center;
`

const SupportLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.primary};
`

const OnRampPage = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(true)
  const zilAddress = address ? toBech32Address(address) : ''
  const { isDark } = useTheme()

  useEffect(() => {
    let transak: any

    if (address) {
      try {
        const transakConfig: TransakConfig = {
          apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY ?? '',
          environment:
            process.env.NEXT_PUBLIC_TRANSAK_ENVIRONMENT === 'PRODUCTION'
              ? Transak.ENVIRONMENTS.PRODUCTION
              : Transak.ENVIRONMENTS.STAGING,
          defaultCryptoCurrency: 'ZIL',
          walletAddress: zilAddress,
          themeColor: '00D2FF',
          widgetHeight: '100%',
          widgetWidth: '100%',
          defaultNetwork: 'zilliqa',
          defaultFiatCurrency: 'USD',
          // cryptoCurrencyList: 'ZIL,WZIL',
          // isDisableCrypto: true,
          hideMenu: false,
          exchangeScreenTitle: 'Buy Crypto',
          isFeeCalculationHidden: false,
          hideExchangeScreen: false,
          disableWalletAddressForm: true,
          isAutoFillUserData: true,
          containerId: 'transakMount',
          colorMode: isDark ? 'DARK' : 'LIGHT',
        }

        transak = new Transak(transakConfig)
        transak.init()

        // Order successful event
        Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
          // eslint-disable-next-line no-console
          console.log('Order Successful:', orderData)
          transak.cleanup()
        })
      } catch (error) {
        console.error('Failed to initialize Transak:', error)
        setIsLoading(false)
      }
    }
  }, [address, isDark, zilAddress])

  if (!address) {
    return (
      <Container>
        <Heading scale="xl" mb="24px">
          Buy ZIL
        </Heading>
        <Text>Please connect your wallet to continue</Text>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container>
        <Text>Loading...</Text>
      </Container>
    )
  }

  return (
    <Container>
      <AddressBox>
        <div>
          <AddressLabel color="secondary" textTransform="uppercase" fontWeight="bold">
            Your Wallet Address
          </AddressLabel>
          <StyledCopyAddress account={address} tooltipMessage="Copied" />
        </div>
        <div>
          <AddressLabel color="secondary" textTransform="uppercase" fontWeight="bold">
            Your ZIL1 Address
          </AddressLabel>
          <StyledCopyAddress account={zilAddress} tooltipMessage="Copied" />
        </div>
      </AddressBox>
      <TransakWidget id="transakMount" />

      <InfoSection>
        <InfoCard>
          <Text bold mb="8px" fontSize="20px">
            Fast & Secure
          </Text>
          <Text color="textSubtle">Buy ZIL directly with your credit card, debit card, or bank transfer</Text>
        </InfoCard>

        <InfoCard>
          <Text bold mb="8px" fontSize="20px">
            Non-Custodial
          </Text>
          <Text color="textSubtle">Your funds go directly to your wallet - we never hold your crypto</Text>
        </InfoCard>

        <InfoCard>
          <Text bold mb="8px" fontSize="20px">
            Global Support
          </Text>
          <Text color="textSubtle">Available in 100+ countries with multiple payment methods</Text>
        </InfoCard>
      </InfoSection>

      <SupportLink href="https://support.transak.com" external>
        Need help? Contact Transak Support
      </SupportLink>
    </Container>
  )
}

OnRampPage.chains = []
export default OnRampPage
