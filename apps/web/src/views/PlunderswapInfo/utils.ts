import { getAddress } from 'ethers/lib/utils'
import Cookies from 'js-cookie'
import { getBlockExploreLink as getExplorerLink } from 'utils'
import { PairData } from './types'

export const formatNumber = (value: string | number, decimals = 2): string => {
  const num = Number(value)
  if (Number.isNaN(num)) return '0'

  if (num > 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`
  }
  if (num > 1000) {
    return `${(num / 1000).toFixed(decimals)}K`
  }
  return num.toFixed(decimals)
}

export const getBlockExploreLink = (address: string): string => {
  return getExplorerLink(address, 'address')
}

export const formatAddress = (address: string): string => {
  if (!address) return ''
  try {
    return getAddress(address)
  } catch (error) {
    console.error('Invalid address:', address)
    return address
  }
}

export const calculatePrice = (amount0: string, amount1: string, decimal0: number, decimal1: number): string => {
  const num0 = Number(amount0) / 10 ** decimal0
  const num1 = Number(amount1) / 10 ** decimal1
  if (num0 === 0 || num1 === 0) return '0'
  return (num0 / num1).toFixed(6)
}

interface TokenMap {
  [symbol: string]: string
}

export const tokenAddressMap: TokenMap = {}

export const buildTokenAddressMap = (poolsData: any[]) => {
  poolsData.forEach((pool) => {
    try {
      tokenAddressMap[pool.symbol0] = getAddress(pool.token0)
      tokenAddressMap[pool.symbol1] = getAddress(pool.token1)
    } catch (error) {
      console.error('Error formatting address:', error)
    }
  })
  return tokenAddressMap
}

export const getTokenAddress = (symbol: string): string => {
  try {
    const address = tokenAddressMap[symbol]
    return address ? getAddress(address) : ''
  } catch (error) {
    console.error('Error getting token address:', error)
    return ''
  }
}

export const getTokenImagePath = (symbol: string, address: string): string => {
  if (symbol.toLowerCase() === 'zusdt') {
    return 'zusdt.svg'
  }
  return `${address}.png`
}

export const formatNumberWithDynamicDecimals = (value: number, isPrice = false): string => {
  if (value === 0) return '0'

  if (isPrice) {
    if (value < 1) {
      // Convert to string to handle scientific notation
      const str = value.toString()

      // If in scientific notation, convert to decimal
      if (str.includes('e')) {
        const [base, exponent] = str.split('e')
        const exp = parseInt(exponent)
        // eslint-disable-next-line no-param-reassign
        value = parseFloat(base) * 10 ** exp
      }

      // Find first non-zero digit after decimal
      let decimals = 0
      let tempValue = value
      while (tempValue < 0.1) {
        decimals++
        tempValue *= 10
      }

      // Add 4 more decimal places after first significant digit
      return value.toFixed(decimals + 4)
    }
    return value.toFixed(2)
  }

  let decimals = 2
  let tempValue = value

  // Increase decimals until we find a non-zero number
  while (tempValue < 0.01 && decimals < 8) {
    decimals++
    tempValue *= 10
  }

  return value.toFixed(decimals)
}

export const formatTokenSymbol = (symbol: string): string => {
  return symbol === 'WZIL' ? 'ZIL' : symbol
}

export const STABLECOINS = ['USDC', 'zUSDT', 'kUSD']
export const PREFERRED_SECOND_TOKEN = ['ZIL', 'WZIL']

export const getOrderedPairSymbols = (symbol0: string, symbol1: string): [string, string] => {
  const upperSymbol0 = symbol0.toUpperCase()
  const upperSymbol1 = symbol1.toUpperCase()

  // If either token is a stablecoin, make it the second token
  if (STABLECOINS.includes(symbol1)) return [symbol0, symbol1]
  if (STABLECOINS.includes(symbol0)) return [symbol1, symbol0]

  // If no stablecoins, and one token is ZIL/WZIL, make it the second token
  if (PREFERRED_SECOND_TOKEN.includes(upperSymbol1)) return [symbol0, symbol1]
  if (PREFERRED_SECOND_TOKEN.includes(upperSymbol0)) return [symbol1, symbol0]

  // Otherwise keep original order
  return [symbol0, symbol1]
}

export const orderPairData = (pair: PairData): PairData => {
  const [orderedSymbol0, orderedSymbol1] = getOrderedPairSymbols(pair.symbol0, pair.symbol1)

  // If order hasn't changed, return original pair
  if (orderedSymbol0 === pair.symbol0) return pair

  // If order has changed, swap everything
  return {
    ...pair,
    symbol0: orderedSymbol0,
    symbol1: orderedSymbol1,
    token0Address: pair.token1Address,
    token1Address: pair.token0Address,
    decimal0: pair.decimal1,
    decimal1: pair.decimal0,
    token0: pair.token1,
    token1: pair.token0,
    prices: {
      price01: pair.prices.price10,
      price10: pair.prices.price01,
      token0USD: pair.prices.token1USD,
      token1USD: pair.prices.token0USD,
      priceSource: pair.prices.priceSource,
    },
  }
}

const HIDE_SMALL_POOLS_COOKIE = 'plunderswap_hide_small_pools'
const SHOW_24H_DATA_COOKIE = 'plunderswap_show_24h_data'

export const getStoredHideSmallPools = (): boolean => {
  const stored = Cookies.get(HIDE_SMALL_POOLS_COOKIE)
  return stored ? stored === 'true' : true // default to true
}

export const setStoredHideSmallPools = (value: boolean) => {
  Cookies.set(HIDE_SMALL_POOLS_COOKIE, value.toString(), { expires: 365 })
}

export const getStoredShow24hData = (): boolean => {
  const stored = Cookies.get(SHOW_24H_DATA_COOKIE)
  return stored ? stored === 'true' : false // default to false (7d)
}

export const setStoredShow24hData = (value: boolean) => {
  Cookies.set(SHOW_24H_DATA_COOKIE, value.toString(), { expires: 365 })
}
