import { useTranslation } from '@pancakeswap/localization'
import { Button, Heading, Text, TrophyIcon, useMatchBreakpoints } from '@pancakeswap/uikit'
import { BannerContainer, BannerMain, PancakeSwapBadge } from '@pancakeswap/widgets-internal'
import { useRouter } from 'next/router'
import styled from 'styled-components'

const StyledBannerContainer = styled(BannerContainer)`
  padding: ${({ isMobile }) => (isMobile ? '16px' : '12px 16px')};
  min-height: auto;
  height: fit-content;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ isMobile }) => (isMobile ? '8px' : '4px')};
  width: 100%;
  padding: 0;
`

const StyledButton = styled(Button)`
  height: 36px;
  padding: 0 24px;
  width: ${({ isMobile }) => (isMobile ? '100%' : 'auto')};

  @media screen and (min-width: 852px) {
    margin-left: 16px;
  }
`

const StyledTrophyIcon = styled(TrophyIcon)`
  width: 28px;
  height: 28px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ isMobile }) => (isMobile ? '4px' : '0')};
`

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: flex-start;
  gap: 8px;
`

const HeadingWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: ${({ isMobile }) => (isMobile ? 'flex-start' : 'center')};
  gap: ${({ isMobile }) => (isMobile ? '12px' : '16px')};
  flex: 1;
  width: 100%;
`

const StyledText = styled(Text)`
  margin-top: ${({ isMobile }) => (isMobile ? '4px' : '2px')};
  font-size: ${({ isMobile }) => (isMobile ? '12px' : '14px')};
`

const StyledHeading = styled(Heading)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
  line-height: 1.2;
`

export const V3InfoBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const router = useRouter()

  const handleClick = () => {
    router.push('/plunder-points')
  }

  return (
    <StyledBannerContainer background="linear-gradient(111.68deg, #e5dce5 0%, #d8e6ed 100%)" isMobile={isMobile}>
      <BannerMain
        badges={<PancakeSwapBadge />}
        title={
          <ContentWrapper isMobile={isMobile}>
            <TitleWrapper isMobile={isMobile}>
              <StyledTrophyIcon isMobile={isMobile} />
              <HeadingWrapper isMobile={isMobile}>
                <StyledHeading isMobile={isMobile}>{t('PlunderPoints Leaderboard is now live!')}</StyledHeading>
                <StyledButton
                  onClick={handleClick}
                  scale={isMobile ? 'sm' : 'md'}
                  variant="secondary"
                  isMobile={isMobile}
                >
                  {t('View Leaderboard')}
                </StyledButton>
              </HeadingWrapper>
            </TitleWrapper>
            <StyledText color="textSubtle" isMobile={isMobile}>
              {t('Earn points from trading, providing liquidity, and registering Zilnames!')}
            </StyledText>
          </ContentWrapper>
        }
      />
    </StyledBannerContainer>
  )
}
