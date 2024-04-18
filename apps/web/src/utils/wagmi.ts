import { getWagmiConnector } from '@binance/w3w-wagmi-connector'
import { CyberWalletConnector, isCyberWallet } from '@cyberlab/cyber-app-sdk'
import { ChainId } from '@pancakeswap/chains'
import { BloctoConnector } from '@pancakeswap/wagmi/connectors/blocto'
import { TrustWalletConnector } from '@pancakeswap/wagmi/connectors/trustWallet'
import memoize from 'lodash/memoize'
import { createConfig, createStorage } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
// import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { chains, publicClient } from './client'

export { chains, publicClient }

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
})

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'PlunderSwap',
    appLogoUrl: 'https://plunderswap.com/logo.png',
  },
})

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    // ignore the error in test environment
    // Error: To use QR modal, please install @walletconnect/modal package
    showQrModal: process.env.NODE_ENV !== 'test',
    projectId: '39d2eb6a6e536fb139160697cb32f9a5',
  },
})

export const walletConnectNoQrCodeConnector = new WalletConnectConnector({
  chains,
  options: {
    showQrModal: false,
    projectId: '39d2eb6a6e536fb139160697cb32f9a5',
  },
})

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
})

const bloctoConnector = new BloctoConnector({
  chains,
  options: {
    defaultChainId: 56,
    appId: 'e2f2f0cd-3ceb-4dec-b293-bb555f2ed5af',
  },
})

// const ledgerConnector = new LedgerConnector({
//   chains,
//   options: {
//     projectId: '39d2eb6a6e536fb139160697cb32f9a5',
//   },
// })

export const trustWalletConnector = new TrustWalletConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
})

export const cyberWalletConnector = isCyberWallet()
  ? new CyberWalletConnector({
      chains: chains as any,
      options: {
        name: 'PlunderSwap',
        appId: 'b825cd87-2db3-456d-b108-d61e74d89771',
      },
    })
  : undefined

const BinanceW3WConnector = getWagmiConnector()
export const binanceWeb3WalletConnector = new BinanceW3WConnector({
  chains,
  options: {
    chainId: ChainId.BSC,
  },
})

export const noopStorage = {
  getItem: (_key: any) => '',
  setItem: (_key: any, _value: any) => null,
  removeItem: (_key: any) => null,
}

export const wagmiConfig = createConfig({
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : noopStorage,
    key: 'wagmi_v1.1',
  }),
  autoConnect: false,
  publicClient,
  connectors: [
    metaMaskConnector,
    injectedConnector,
    coinbaseConnector,
    walletConnectConnector,
    // @ts-ignore FIXME: wagmi
    bloctoConnector,
    // ledgerConnector,
    trustWalletConnector,
    binanceWeb3WalletConnector,
    ...(cyberWalletConnector ? [cyberWalletConnector as any] : []),
  ],
})

export const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = memoize((chainId: number) => (CHAIN_IDS as number[]).includes(chainId))
export const isChainTestnet = memoize((chainId: number) => {
  const found = chains.find((c) => c.id === chainId)
  return found ? 'testnet' in found : false
})
