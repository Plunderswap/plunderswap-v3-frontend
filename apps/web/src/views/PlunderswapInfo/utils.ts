import { getAddress } from 'ethers/lib/utils'
import { getBlockExploreLink as getExplorerLink } from 'utils'

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
