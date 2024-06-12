import { useTranslation } from '@pancakeswap/localization'
import { Box, Container, Flex, PageSection, useMatchBreakpoints } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'
import { V3InfoBanner } from './components/Banners/V3InfoBanner'
import Footer from './components/Footer'
import Hero from './components/Hero'
import SalesSection from './components/SalesSection'
import { earnSectionData, swapSectionData } from './components/SalesSection/data'
import { InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopLeft, WedgeTopRight } from './components/WedgeSvgs'

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`
const UserBannerWrapper = styled(Container)`
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  padding-left: 0px;
  padding-right: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const Home: React.FC<React.PropsWithChildren> = () => {
  const { theme } = useTheme()
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px', padding: '0px 16px' }
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <Box style={{ width: isMobile ? '100vw' : 'calc(100vw - 8px)', overflow: 'hidden', boxSizing: 'border-box' }}>
      <style jsx global>
        {`
          #home-1 .page-bg {
            background: linear-gradient(139.73deg, #e6fdff 0%, #f3efff 100%);
          }
          [data-theme='dark'] #home-1 .page-bg {
            background: radial-gradient(103.12% 50% at 50% 50%, #21193a 0%, #191326 100%);
          }
          #home-2 .page-bg {
            background: linear-gradient(180deg, #ffffff 22%, #d7caec 100%);
          }
          [data-theme='dark'] #home-2 .page-bg {
            background: linear-gradient(180deg, #09070c 22%, #201335 100%);
          }
          #home-3 .page-bg {
            background: linear-gradient(180deg, #6fb6f1 0%, #eaf2f6 100%);
          }
          [data-theme='dark'] #home-3 .page-bg {
            background: linear-gradient(180deg, #0b4576 0%, #091115 100%);
          }
          #home-4 .inner-wedge svg {
            fill: #d8cbed;
          }
          [data-theme='dark'] #home-4 .inner-wedge svg {
            fill: #201335;
          }

          #bottom-wedge4-2 svg {
            fill: #72b8f2;
          }
          [data-theme='dark'] #bottom-wedge4-2 svg {
            fill: #0b4576;
          }
        `}
      </style>
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%', overflow: 'visible', padding: '0px' } }}
        containerProps={{
          id: 'home-1',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <Flex style={{ gap: 5 }} justifyContent="center" mt="40px">
          <V3InfoBanner />
        </Flex>
      </StyledHeroSection>
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%', overflow: 'visible', padding: '8px' } }}
        containerProps={{
          id: 'home-1',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <Hero />
      </StyledHeroSection>
      {/* <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        containerProps={{
          id: 'home-2',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <MetricsSection />
      </PageSection> */}
      <PageSection
        innerProps={{ style: { ...HomeSectionContainerStyles, maxWidth: 'auto' } }}
        background={theme.colors.background}
        containerProps={{
          id: 'home-4',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper top>
            <WedgeTopLeft />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
        <SalesSection {...swapSectionData(t)} />
        {/* <EcoSystemSection /> */}
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.gradientCardHeader}
        containerProps={{
          id: 'home4-2',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper width="150%" top>
            <WedgeTopRight />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
        <SalesSection {...earnSectionData(t)} />
        {/* <CakeSection /> */}
        {/* <Flex style={{ gap: 5 }} justifyContent="center" mt="40px">
          <Text fontSize={24} bold>
            {t('CAKE')}
          </Text>
          <Text fontSize={24} bold color="secondary">
            {t('Figures')}
          </Text>
        </Flex>
        <CakeDataRow />
        <OuterWedgeWrapper>
          <InnerWedgeWrapper id="bottom-wedge4-2">
            <WedgeBottomRight />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper> */}
      </PageSection>
      {/* <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        containerProps={{
          id: 'home-3',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <RightTopBox />
        <CommunitySection />
      </PageSection>
      <PageSection
        innerProps={{
          style: {
            ...HomeSectionContainerStyles,
            maxWidth: '1400px',
          },
        }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <NewsSection /> 
      </PageSection> */}
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background="linear-gradient(180deg, #7645D9 0%, #5121B1 100%)"
        index={2}
        hasCurvedDivider={false}
      >
        <Footer />
      </PageSection>
    </Box>
  )
}

export default Home
