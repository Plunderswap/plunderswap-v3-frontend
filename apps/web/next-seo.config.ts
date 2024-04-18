import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | PlunderSwap',
  defaultTitle: 'PlunderSwap',
  description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@PlunderSwap',
    site: '@PlunderSwap',
  },
  openGraph: {
    title: "🥞 PlunderSwap - Everyone's Favorite DEX",
    description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
    images: [{ url: 'https://plunderswap.com/v2/hero.jpg' }],
  },
}
