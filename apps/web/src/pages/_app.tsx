import { ResetCSS, ScrollToTopButtonV2, ToastListener } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import GlobalCheckClaimStatus from 'components/GlobalCheckClaimStatus'
import { PageMeta } from 'components/Layout/Page'
import { NetworkModal } from 'components/NetworkModal'
import TransactionsDetailModal from 'components/TransactionDetailModal'
import { useAccountEventListener } from 'hooks/useAccountEventListener'
import useEagerConnect from 'hooks/useEagerConnect'
import useEagerConnectMP from 'hooks/useEagerConnect.bmp'
import useLockedEndNotification from 'hooks/useLockedEndNotification'
import useThemeCookie from 'hooks/useThemeCookie'
import useUserAgent from 'hooks/useUserAgent'
import { NextPage } from 'next'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment } from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import styled from 'styled-components'

import { PWAInstallPrompt } from 'components/PWAInstallPrompt'
import { UpdatePrompt } from 'components/UpdatePrompt'
import { useInitGlobalWorker } from 'hooks/useWorker'
import { persistor, useStore } from 'state'
import { usePollBlockNumber } from 'state/block/hooks'
import { Blocklist, Updaters } from '..'
import { SEO } from '../../next-seo.config'
import Providers from '../Providers'
import Menu from '../components/Menu'
import GlobalStyle from '../style/Global'

const EasterEgg = dynamic(() => import('components/EasterEgg'), { ssr: false })

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

// Update the styled wrapper to target the nav specifically
const StyledMenuWrapper = styled.div`
  nav {
    padding-top: env(safe-area-inset-top);
    min-height: calc(48px + env(safe-area-inset-top)); /* Adjust 48px to match your nav height */
  }

  /* Target the main content to prevent it from going under the nav */
  main {
    margin-top: calc(-1 * env(safe-area-inset-top));
  }
`

function GlobalHooks() {
  useInitGlobalWorker()
  // useLoadExperimentalFeatures()
  usePollBlockNumber()
  useEagerConnect()
  useUserAgent()
  useAccountEventListener()
  // useSentryUser()
  useThemeCookie()
  useLockedEndNotification()
  return null
}

function MPGlobalHooks() {
  usePollBlockNumber()
  useEagerConnectMP()
  useUserAgent()
  useAccountEventListener()
  // useSentryUser()
  useLockedEndNotification()
  return null
}

function MyApp(props: AppProps<{ initialReduxState: any; dehydratedState: any }>) {
  const { pageProps, Component } = props
  const store = useStore(pageProps.initialReduxState)

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="description" content="A next evolution DeFi exchange on Zilliqa" />
        <meta name="theme-color" content="#1FC7D4" />
        <meta name="twitter:image" content="https://dev.plunderswap.com/images/hero.png" />
        <meta name="twitter:description" content="A next evolution DeFi exchange on Zilliqa" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Plunderswap - A next evolution DeFi exchange on Zilliqa" />
        <title>Plunderswap</title>
        {(Component as NextPageWithLayout).mp && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src="https://public.bnbstatic.com/static/js/mp-webview-sdk/webview-v1.0.0.min.js" id="mp-webview" />
        )}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PlunderSwap" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/ios/apple-touch-icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/ios/apple-touch-icon-167x167.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/ios/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/ios/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/ios/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icons/ios/apple-touch-icon-60x60.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="build-id" content={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || Date.now().toString()} />
      </Head>
      <DefaultSeo {...SEO} />
      <Providers store={store} dehydratedState={pageProps.dehydratedState}>
        <PageMeta />
        {(Component as NextPageWithLayout).Meta && (
          // @ts-ignore
          <Component.Meta {...pageProps} />
        )}
        {(Component as NextPageWithLayout).mp ? <MPGlobalHooks /> : <GlobalHooks />}
        <ResetCSS />
        <GlobalStyle />
        <GlobalCheckClaimStatus excludeLocations={[]} />
        <PersistGate loading={null} persistor={persistor}>
          <Updaters />
          <App {...props} />
        </PersistGate>
        <PWAInstallPrompt />
        <UpdatePrompt />
      </Providers>
    </>
  )
}

type NextPageWithLayout = NextPage & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>
  /** render component without all layouts */
  pure?: true
  /** is mini program */
  mp?: boolean
  /**
   * allow chain per page, empty array bypass chain block modal
   * @default [ChainId.BSC]
   * */
  chains?: number[]
  isShowScrollToTopButton?: true
  screen?: true
  isShowV4IconButton?: false
  /**
   * Meta component for page, hacky solution for static build page to avoid `PersistGate` which blocks the page from rendering
   */
  Meta?: React.FC<React.PropsWithChildren<unknown>>
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const ProductionErrorBoundary = Fragment

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  if (Component.pure) {
    return <Component {...pageProps} />
  }

  const Layout = Component.Layout || Fragment
  const ShowMenu = Component.mp ? Fragment : Menu
  const isShowScrollToTopButton = Component.isShowScrollToTopButton || true
  const shouldScreenWallet = Component.screen || false
  const isShowV4IconButton = Component.isShowV4IconButton || false

  return (
    <ProductionErrorBoundary>
      <StyledMenuWrapper>
        <ShowMenu>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ShowMenu>
      </StyledMenuWrapper>
      <EasterEgg iterations={2} />
      <ToastListener />
      <NetworkModal pageSupportedChains={Component.chains} />
      <TransactionsDetailModal />
      {isShowScrollToTopButton && <ScrollToTopButtonV2 />}
      {shouldScreenWallet && <Blocklist />}
    </ProductionErrorBoundary>
  )
}

export default MyApp
