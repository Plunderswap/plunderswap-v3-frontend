import { ChainId } from '@pancakeswap/chains'

export const PANCAKE_EXTENDED = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json'

const COINGECKO = 'https://tokens.pancakeswap.finance/coingecko.json'
const PANCAKE_ETH_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-eth-default.json'
const PANCAKE_ZKSYNC_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-zksync-default.json'
const PANCAKE_POLYGON_ZKEVM_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-polygon-zkevm-default.json'
const PANCAKE_ARB_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-arbitrum-default.json'
const PANCAKE_LINEA_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-linea-default.json'
const PANCAKE_BASE_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-base-default.json'
const PANCAKE_OPBNB_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-opbnb-default.json'
const ZILLIQA_TESTNET = 'https://dev-v3.plunderswap.com/lists/default-testnet.json'
const ZQ2_TESTNET = 'https://zq2-test.plunderswap.com/lists/default-zq2-testnet.json'
const ZILLIQA = 'https://plunderswap.github.io/token-lists/default-mainnet.json'

export const PANCAKE_ETH_MM = 'https://tokens.pancakeswap.finance/pancakeswap-eth-mm.json'
export const PANCAKE_BSC_MM = 'https://tokens.pancakeswap.finance/pancakeswap-bnb-mm.json'

const COINGECKO_ETH = 'https://tokens.coingecko.com/uniswap/all.json'
// export const CMC = 'https://tokens.pancakeswap.finance/cmc.json' // not updated for a while

const ETH_URLS = [PANCAKE_ETH_DEFAULT, PANCAKE_ETH_MM, COINGECKO_ETH]
const BSC_URLS = [PANCAKE_EXTENDED, COINGECKO, PANCAKE_BSC_MM]
const POLYGON_ZKEVM_URLS = [PANCAKE_POLYGON_ZKEVM_DEFAULT, 'https://tokens.coingecko.com/polygon-zkevm/all.json']
const ARBITRUM_URLS = [PANCAKE_ARB_DEFAULT, 'https://tokens.coingecko.com/arbitrum-one/all.json']
const LINEA_URLS = [PANCAKE_LINEA_DEFAULT, 'https://tokens.coingecko.com/linea/all.json']
const ZKSYNC_URLS = [PANCAKE_ZKSYNC_DEFAULT, 'https://tokens.coingecko.com/zksync/all.json']
const OP_SUPER_CHAIN_URL =
  'https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json'
const BASE_URLS = [PANCAKE_BASE_DEFAULT, OP_SUPER_CHAIN_URL, 'https://tokens.coingecko.com/base/all.json']
const OPBNB_URLS = [PANCAKE_OPBNB_DEFAULT]
const ZILLIQA_TESTNET_URLS = [ZILLIQA_TESTNET]
const ZQ2_URLS = [ZQ2_TESTNET]
const ZILLIQA_URLS = [ZILLIQA]

// List of official tokens list
export const OFFICIAL_LISTS = [ZILLIQA, ZILLIQA_TESTNET]

export const UNSUPPORTED_LIST_URLS: string[] = []
export const WARNING_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...ZILLIQA_URLS,
  ...ZILLIQA_TESTNET_URLS,
  ...ZQ2_URLS,
  // ...BSC_URLS,
  // ...ETH_URLS,
  // ...ZKSYNC_URLS,
  // ...LINEA_URLS,
  // ...POLYGON_ZKEVM_URLS,
  // ...BASE_URLS,
  // ...ARBITRUM_URLS,
  // OP_SUPER_CHAIN_URL,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
  ...WARNING_LIST_URLS,
  // ...OPBNB_URLS,
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [
  // PANCAKE_EXTENDED,
  // PANCAKE_ETH_DEFAULT,
  // PANCAKE_ETH_MM,
  // PANCAKE_BSC_MM,
  // PANCAKE_ETH_DEFAULT,
  // PANCAKE_POLYGON_ZKEVM_DEFAULT,
  // PANCAKE_ZKSYNC_DEFAULT,
  // PANCAKE_ARB_DEFAULT,
  // PANCAKE_LINEA_DEFAULT,
  // PANCAKE_BASE_DEFAULT,
  // PANCAKE_OPBNB_DEFAULT,
  // OP_SUPER_CHAIN_URL,
  ZILLIQA,
  ZILLIQA_TESTNET,
  ZQ2_TESTNET,
]

export const MULTI_CHAIN_LIST_URLS: { [chainId: number]: string[] } = {
  [ChainId.BSC]: BSC_URLS,
  [ChainId.ETHEREUM]: ETH_URLS,
  [ChainId.ZKSYNC]: ZKSYNC_URLS,
  [ChainId.POLYGON_ZKEVM]: POLYGON_ZKEVM_URLS,
  [ChainId.ARBITRUM_ONE]: ARBITRUM_URLS,
  [ChainId.LINEA]: LINEA_URLS,
  [ChainId.BASE]: BASE_URLS,
  [ChainId.OPBNB]: OPBNB_URLS,
  [ChainId.ZILLIQA_TESTNET]: ZILLIQA_TESTNET_URLS,
  [ChainId.ZQ2_TESTNET]: ZQ2_URLS,
  [ChainId.ZILLIQA]: ZILLIQA_URLS,
}
