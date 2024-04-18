import { ChainId, chainNames } from '@pancakeswap/chains'
import memoize from 'lodash/memoize'
import { defineChain } from 'viem'
import { Chain, bscTestnet, bsc as bsc_ } from 'wagmi/chains'

export const zilliqaTestnet = defineChain({
  id: 33101,
  name: 'Zilliqa Testnet',
  network: 'zilliqaTestnet',
  nativeCurrency: { name: 'Zilliqa', symbol: 'ZIL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://api.testnet.zilliqa.com'],
    },
    public: {
      http: ['https://api.testnet.zilliqa.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'EVMX',
      url: 'https://otterscan.testnet.zilliqa.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0x3c2ffc98284b2f6e1035eaeed75e9273b5b63223',
      blockCreated: 5313022,
    },
  },
})

export const zilliqa = defineChain({
  id: 32769,
  name: 'Zilliqa',
  network: 'Zilliqa',
  nativeCurrency: { name: 'Zilliqa', symbol: 'ZIL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://api.zilliqa.com'],
    },
    public: {
      http: ['https://api.zilliqa.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'EVMX',
      url: 'https://evmx.zilliqa.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0x38899efb93d5106d3adb86662c557f237f6ecf57',
      blockCreated: 3251173,
    },
  },
})

export const CHAIN_QUERY_NAME = chainNames

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})

const bsc = {
  ...bsc_,
  rpcUrls: {
    ...bsc_.rpcUrls,
    public: {
      ...bsc_.rpcUrls.public,
      http: ['https://bsc-dataseed.binance.org/'],
    },
    default: {
      ...bsc_.rpcUrls.default,
      http: ['https://bsc-dataseed.binance.org/'],
    },
  },
} satisfies Chain

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS: ChainId[] = [
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_GOERLI,
  ChainId.POLYGON_ZKEVM,
  ChainId.POLYGON_ZKEVM_TESTNET,
  ChainId.ZKSYNC,
  ChainId.ZKSYNC_TESTNET,
  ChainId.LINEA_TESTNET,
  ChainId.LINEA,
  ChainId.BASE,
  ChainId.BASE_TESTNET,
  ChainId.OPBNB,
  ChainId.OPBNB_TESTNET,
  ChainId.ARBITRUM_SEPOLIA,
  ChainId.BASE_SEPOLIA,
]

export const CHAINS = [zilliqa, zilliqaTestnet, bscTestnet]
