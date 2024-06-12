import { TranslateFunction } from '@pancakeswap/localization'
import { SalesSectionProps } from '.'

export const swapSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('PlunderSwap, Trade booty.'),
  bodyText: t(
    "Ahoy, Mateys! Join Plunder Swap, the buccaneer's crypto DEX, for swift, secure swaps and sought-after tokens!",
  ),
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: t('Trade Now'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.plunderswap.com/',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'USDT', alt: t('USDT token') },
      { src: 'XSGD', alt: t('XSGD token') },
      { src: 'ZIL', alt: t('ZIL token') },
    ],
  },
})

export const earnSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Liquidity Lagoon: Concentrated Liquidity Maximum Yield.'),
  bodyText: t(
    'Embark on a treasure-filled journey at Liquidity Lagoon. Discover bountiful loot with robust V2 and V3 liquidity pools and rule decentralized finance!',
  ),
  reverse: true,
  primaryButton: {
    to: '/liquidity',
    text: t('Explore'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.plunderswap.com/products/plunderswap-exchange/plunderswap-pools/',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/',
    attributes: [{ src: 'V3_Treasure_Chest_trans', alt: t('Treasure chest') }],
  },
})

export const cakeSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Seize Loot, Plunder Loot'),
  bodyText: t(
    'Unleash idle assets at Profit Plunder, stake and multiply wealth, chart a prosperous course with our Earn feature in decentralized finance!',
  ),
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&chainId=56',
    text: t('Buy CAKE'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.plunderswap.com/tokenomics/cake',
    text: t('Learn'),
    external: true,
  },

  images: {
    path: '/images/home/',
    attributes: [{ src: 'zilliqa_coins', alt: t('CAKE token') }],
  },
})
