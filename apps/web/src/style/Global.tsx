import { PancakeTheme } from '@pancakeswap/uikit'
import { createGlobalStyle } from 'styled-components'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Kanit', sans-serif;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);

    img {
      height: auto;
      max-width: 100%;
    }
  }

  #__next {
    position: relative;
    z-index: 1;
  }

  #portal-root {
    position: relative;
    z-index: 2;
  }

  .fixed-top {
    padding-top: env(safe-area-inset-top);
  }
`

export default GlobalStyle
