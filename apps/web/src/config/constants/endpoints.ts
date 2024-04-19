import { BLOCKS_SUBGRAPHS, ChainId, V2_SUBGRAPHS, V3_SUBGRAPHS } from '@pancakeswap/chains'

export const GRAPH_API_PROFILE = 'https://api.thegraph.com/subgraphs/name/plunderswap/profile'

export const GRAPH_API_LOTTERY = 'https://api.thegraph.com/subgraphs/name/plunderswap/lottery'
export const SNAPSHOT_BASE_URL = process.env.NEXT_PUBLIC_SNAPSHOT_BASE_URL
export const API_PROFILE = 'https://profile.plunderswap.com'
export const API_NFT = 'https://nft.plunderswap.com/api/v1'
export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`
export const SNAPSHOT_HUB_API = `${SNAPSHOT_BASE_URL}/api/message`
export const GRAPH_API_POTTERY = 'https://api.thegraph.com/subgraphs/name/plunderswap/pottery'
export const ONRAMP_API_BASE_URL = 'https://pcs-onramp-api.com'
export const TRANSAK_API_BASE_URL = 'https://api-stg.transak.com/api/v1'
export const MOONPAY_BASE_URL = 'https://api.moonpay.com'
export const NOTIFICATION_HUB_BASE_URL = 'https://notification-hub.plunderswap.com'
/**
 * V1 will be deprecated but is still used to claim old rounds
 */
export const GRAPH_API_PREDICTION_V1 = 'https://api.thegraph.com/subgraphs/name/plunderswap/prediction'

export const INFO_CLIENT = 'https://proxy-worker-api.plunderswap.com/bsc-exchange'
export const V3_BSC_INFO_CLIENT = `https://open-platform.nodereal.io/${
  process.env.NEXT_PUBLIC_NODE_REAL_API_INFO || process.env.NEXT_PUBLIC_NODE_REAL_API_ETH
}/plunderswap-v3/graphql`

export const INFO_CLIENT_ETH = 'https://api.thegraph.com/subgraphs/name/plunderswap/exhange-eth'
export const BLOCKS_CLIENT = BLOCKS_SUBGRAPHS[ChainId.BSC]
export const BLOCKS_CLIENT_ETH = BLOCKS_SUBGRAPHS[ChainId.ETHEREUM]
export const BLOCKS_CLIENT_POLYGON_ZKEVM = BLOCKS_SUBGRAPHS[ChainId.POLYGON_ZKEVM]
export const BLOCKS_CLIENT_ZKSYNC = BLOCKS_SUBGRAPHS[ChainId.ZKSYNC]
export const BLOCKS_CLIENT_LINEA = BLOCKS_SUBGRAPHS[ChainId.LINEA]
export const BLOCKS_CLIENT_BASE = BLOCKS_SUBGRAPHS[ChainId.BASE]
export const BLOCKS_CLIENT_OPBNB = BLOCKS_SUBGRAPHS[ChainId.OPBNB]

export const GRAPH_API_NFTMARKET = 'https://api.thegraph.com/subgraphs/name/plunderswap/nft-market'
export const GRAPH_HEALTH = 'https://api.thegraph.com/index-node/graphql'

export const TC_MOBOX_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/plunderswap/trading-competition-v3'
export const TC_MOD_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/plunderswap/trading-competition-v4'

export const BIT_QUERY = 'https://graphql.bitquery.io'

export const ACCESS_RISK_API = 'https://red.alert.plunderswap.com/red-api'

export const CELER_API = 'https://api.celerscan.com/scan'

export const INFO_CLIENT_WITH_CHAIN = V2_SUBGRAPHS

export const BLOCKS_CLIENT_WITH_CHAIN = BLOCKS_SUBGRAPHS

export const ASSET_CDN = 'https://plunderswap.com'

export const V3_SUBGRAPH_URLS = V3_SUBGRAPHS

export const TRADING_REWARD_API = 'https://trading-reward.plunderswap.com/api/v1'

export const QUOTING_API = `${process.env.NEXT_PUBLIC_QUOTING_API}/v0/quote`

export const FARMS_API = 'https://farms-api.plunderswap.com'

export const MERCURYO_WIDGET_ID = process.env.NEXT_PUBLIC_MERCURYO_WIDGET_ID || '64d1f9f9-85ee-4558-8168-1dc0e7057ce6'

export const MOONPAY_API_KEY = process.env.NEXT_PUBLIC_MOONPAY_LIVE_KEY || 'pk_test_1Ibe44lMglFVL8COOYO7SEKnIBrzrp54'

export const TRANSAK_API_KEY = process.env.NEXT_PUBLIC_TRANSAK_LIVE_KEY || 'bf960e79-6d98-4fd0-823d-8409d290c346'
// no need for extra public env
export const MERCURYO_WIDGET_URL =
  process.env.NODE_ENV === 'development'
    ? 'https://sandbox-widget.mrcr.io/embed.2.0.js'
    : 'https://widget.mercuryo.io/embed.2.0.js'

export const WALLET_API = 'https://wallet-api.plunderswap.com'
