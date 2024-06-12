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

const whitepaperLink = 'https://docs.plunderswap.com'

export const V3InfoBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  const readWhitepaperAction = (
    <StyledButtonLinkAction color="white" href={whitepaperLink} padding={['8px 12px']}>
      {isMobile ? t('Whitepaper') : t('Read documentation')}
    </StyledButtonLinkAction>
  )

  return (
    <BannerContainer background="radial-gradient(112.67% 197.53% at 30.75% 3.72%, #9AEDFF 0%, #CCC2FE 76.19%, #C6A3FF 100%), linear-gradient(180deg, rgba(231, 253, 255, 0.2) 0%, rgba(242, 241, 255, 0.2) 100%)">
      <BannerMain
        badges={<PancakeSwapBadge />}
        title={
          <BannerTitle variant="purple">
            {isMobile || isTablet
              ? t('PlunderSwap V3 is here.')
              : t('PlunderSwap V3 is here. Concentrated liquidity, ahoy!')}
          </BannerTitle>
        }
        actions={<BannerActionContainer>{readWhitepaperAction}</BannerActionContainer>}
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
