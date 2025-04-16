import { useTranslation } from '@pancakeswap/localization'
import { Button, Heading, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { BannerContainer, BannerMain, PancakeSwapBadge } from '@pancakeswap/widgets-internal'
import { useRouter } from 'next/router'
import styled from 'styled-components'

interface StyledProps {
  isMobile?: boolean
}

const StyledBannerContainer = styled(BannerContainer)<StyledProps>`
  padding: ${({ isMobile }) => (isMobile ? '16px' : '12px 16px')};
  min-height: auto;
  height: fit-content;
`

const ContentWrapper = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ isMobile }) => (isMobile ? '8px' : '4px')};
  width: 100%;
  padding: 0;
`

const StyledButton = styled(Button)<StyledProps>`
  height: 36px;
  padding: 0 16px;
  width: ${({ isMobile }) => (isMobile ? '90%' : 'auto')};
  background: ${({ theme }) => theme.colors.primaryBright};
  color: white;
  font-weight: 600;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin: ${({ isMobile }) => (isMobile ? '0 auto' : '0')};
  position: ${({ isMobile }) => (isMobile ? 'relative' : 'absolute')};
  right: ${({ isMobile }) => (isMobile ? 'auto' : '16px')};
  
  &:hover {
    opacity: 0.9;
  }

  @media screen and (min-width: 852px) {
    padding: 0 24px;
  }
`

const LogoContainer = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ isMobile }) => (isMobile ? '64px' : '80px')};
  height: ${({ isMobile }) => (isMobile ? '64px' : '80px')};
  margin: ${({ isMobile }) => (isMobile ? '0 auto 8px' : '0')};
  background: transparent;
  padding: 4px;
`

const DeBridgeLogoWrapper = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

const UsdcLogoWrapper = styled.div<StyledProps>`
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin: 0 4px;
  
  img {
    width: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
    height: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
  }
`

const TitleWrapper = styled.div<StyledProps>`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: ${({ isMobile }) => (isMobile ? 'center' : 'center')};
  gap: 12px;
  width: 100%;
  position: relative;
`

const HeadingWrapper = styled.div<StyledProps>`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'column')};
  align-items: ${({ isMobile }) => (isMobile ? 'center' : 'flex-start')};
  gap: ${({ isMobile }) => (isMobile ? '12px' : '8px')};
  flex: 1;
  width: 100%;
  padding-right: ${({ isMobile }) => (isMobile ? '0' : '240px')};
`

const TextContentWrapper = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isMobile }) => (isMobile ? 'center' : 'flex-start')};
  width: 100%;
`

const StyledText = styled(Text)<StyledProps>`
  margin-top: ${({ isMobile }) => (isMobile ? '4px' : '2px')};
  font-size: ${({ isMobile }) => (isMobile ? '12px' : '14px')};
  letter-spacing: 0.2px;
  text-align: ${({ isMobile }) => (isMobile ? 'center' : 'left')};
`

const StyledHeading = styled(Heading)<StyledProps>`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
  line-height: 1.2;
  font-weight: 700;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: ${({ isMobile }) => (isMobile ? 'center' : 'flex-start')};
  text-align: ${({ isMobile }) => (isMobile ? 'center' : 'left')};
  width: 100%;
`

export const DeBridgeBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const router = useRouter()

  const handleClick = () => {
    router.push('/bridge')
  }

  return (
    <StyledBannerContainer 
      background="linear-gradient(111.68deg, #e2f0ff 0%, #d8ebed 100%)" 
      isMobile={isMobile}
    >
      <BannerMain
        badges={<PancakeSwapBadge />}
        title={
          <ContentWrapper isMobile={isMobile}>
            <TitleWrapper isMobile={isMobile}>
              <LogoContainer isMobile={isMobile}>
                <DeBridgeLogoWrapper isMobile={isMobile}>
                  <img src="/images/home/debridge.png" alt="deBridge" />
                </DeBridgeLogoWrapper>
              </LogoContainer>
              <HeadingWrapper isMobile={isMobile}>
                <TextContentWrapper isMobile={isMobile}>
                  <StyledHeading isMobile={isMobile}>
                    {t('deBridge swap and ')}
                    <UsdcLogoWrapper isMobile={isMobile}>
                      <img src="/images/home/usdc.png" alt="USDC" />
                    </UsdcLogoWrapper>
                    {t(' USDC Trading now available!')}
                  </StyledHeading>
                  <StyledText color="textSubtle" isMobile={isMobile}>
                    {t('Bridge assets via deBridge and trade USDC on PlunderSwap and Zilliqa with low fees!')}
                  </StyledText>
                </TextContentWrapper>
                <StyledButton
                  onClick={handleClick}
                  scale={isMobile ? 'sm' : 'md'}
                  variant="primary"
                  isMobile={isMobile}
                >
                  {t('Try deBridge')}
                </StyledButton>
              </HeadingWrapper>
            </TitleWrapper>
          </ContentWrapper>
        }
      />
    </StyledBannerContainer>
  )
}