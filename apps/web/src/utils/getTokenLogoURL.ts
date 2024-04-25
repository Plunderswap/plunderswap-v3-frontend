import { ChainId } from '@pancakeswap/chains'
import { Token } from '@pancakeswap/sdk'
import memoize from 'lodash/memoize'
import { isAddress } from 'viem'

const mapping = {
  [ChainId.BSC]: 'smartchain',
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.POLYGON_ZKEVM]: 'polygonzkevm',
  [ChainId.ZKSYNC]: 'zksync',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.LINEA]: 'linea',
}

const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && isAddress(token.address)) {
      return `https://plunderswap.github.io/token-lists/images/${token.address}.png`
    }
    return null
  },
  (t) => `${t?.chainId}#${t?.address}`,
)

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && isAddress(address)) {
      return `https://plunderswap.github.io/token-lists/images/${address}.png`
    }
    return null
  },
  (address, chainId) => `${chainId}#${address}`,
)

export default getTokenLogoURL
