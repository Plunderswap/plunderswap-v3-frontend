import { useTranslation } from '@pancakeswap/localization'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BannerActionContainer,
  BannerContainer,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  ButtonLinkAction,
  FloatingGraphic,
  PancakeSwapBadge,
} from '@pancakeswap/widgets-internal'
import styled from 'styled-components'

const floatingAsset = `/images/home/V3_Treasure_Chest_trans.png`

const StyledButtonLinkAction = styled(ButtonLinkAction)`
  height: 33px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.secondary};
  margin-top: 10px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 48px;
    border-radius: 16px;
  }
`

const facuetLink = 'https://faucet.zq2-prototestnet.zilliqa.com/'

export const JasperBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  const faucetAction = (
    <StyledButtonLinkAction color="white" href={facuetLink} padding={['8px 12px']}>
      {t('Get testnet ZIL')}
    </StyledButtonLinkAction>
  )

  return (
    <BannerContainer background="radial-gradient(112.67% 197.53% at 30.75% 3.72%, #9AEDFF 0%, #CCC2FE 76.19%, #C6A3FF 100%), linear-gradient(180deg, rgba(231, 253, 255, 0.2) 0%, rgba(242, 241, 255, 0.2) 100%)">
      <BannerMain
        badges={<PancakeSwapBadge />}
        title={
          <BannerTitle variant="purple">
            {isMobile || isTablet
              ? t('PlunderSwap on Zilliqa 2.0 is here.')
              : t('Zilliqa 2.0 Jasper proto-testnet is here. Lightning fast transactions, ahoy!')}
          </BannerTitle>
        }
        actions={<BannerActionContainer>{faucetAction}</BannerActionContainer>}
      />
      <BannerGraphics>
        <FloatingGraphic
          src={floatingAsset}
          width={isMobile || isTablet ? 230 : 280}
          height={isMobile || isTablet ? 230 : 280}
        />
      </BannerGraphics>
    </BannerContainer>
  )
}
