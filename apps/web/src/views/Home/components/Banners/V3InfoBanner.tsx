import { useTranslation } from '@pancakeswap/localization'
import { Button, useMatchBreakpoints } from '@pancakeswap/uikit'
import { BannerContainer, BannerMain, BannerTitle, PancakeSwapBadge } from '@pancakeswap/widgets-internal'
import { useRouter } from 'next/router'
import styled from 'styled-components'

const floatingAsset = `/images/home/cross-chain-exchange.png`

const StyledImage = styled.img`
  cursor: pointer;
  width: 388px;
  height: 100px;
  margin-left: 120px;
  margin-right: 40px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 0;
  padding: 8px 0;
`

const StyledBannerContainer = styled(BannerContainer)`
  padding: 12px;
  min-height: auto;
  height: fit-content;
`

const TextWrapper = styled.div`
  margin-left: 8px;
  max-width: 240px;
`

const StyledButton = styled(Button)`
  margin-left: 20px;
  height: 40px;
  margin-right: 20px;
`

export const V3InfoBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const router = useRouter()

  const handleClick = () => {
    router.push('/stealthex')
  }

  return (
    <StyledBannerContainer background="linear-gradient(111.68deg, #e5dce5 0%, #d8e6ed 100%)">
      <BannerMain
        badges={<PancakeSwapBadge />}
        title={
          <ContentWrapper>
            <TextWrapper>
              <BannerTitle variant="purple">{t('PlunderSwap now supports Cross Chain Swaps!')}</BannerTitle>
            </TextWrapper>
            {isMobile || isTablet ? (
              <StyledButton onClick={handleClick} scale="sm">
                {t('Exchange Now!')}
              </StyledButton>
            ) : (
              <StyledImage src={floatingAsset} alt="Cross-chain exchange" onClick={handleClick} />
            )}
          </ContentWrapper>
        }
      />
    </StyledBannerContainer>
  )
}
