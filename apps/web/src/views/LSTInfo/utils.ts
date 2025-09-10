import { AddTokenParams, LSTConfig, LSTData, LSTJsonPriceData, LSTJsonPriceEntry, LSTStats } from './types'

// Simple cookie functions (temporary)
const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return undefined
}

const setCookie = (name: string, value: string, days: number = 365) => {
  if (typeof document === 'undefined') return
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

// LST Token Configurations
export const LST_CONFIGS: LSTConfig[] = [
  {
    name: 'Encapsulate',
    symbol: 'encapZIL',
    tokenAddress: '0x8E3073b22F670d3A09C66D0Abb863f9E358402d2',
    proxyAddress: '0x1311059DD836D7000Dc673eA4Cc834fe04e9933C',
    logoPath: 'lst/logo_encapsulate.webp',
    jsonFilename: 'encapZIL_prices.json',
  },
  {
    name: 'Lithium Digital',
    symbol: 'litZIL',
    tokenAddress: '0x3B78f66651E2eCAbf13977817848F82927a17DcF',
    proxyAddress: '0xBD6ca237f30A86eea8CF9bF869677F3a0496a990',
    logoPath: 'lst/logo_lithiumdigital.webp',
    jsonFilename: 'litZIL_prices.json',
  },
  {
    name: 'StakeShark',
    symbol: 'shZIL',
    tokenAddress: '0x737EBf814D2C14fb21E00Fd2990AFc364C2AF506',
    proxyAddress: '0xF7F4049e7472fC32805Aae5bcCE909419a34D254',
    logoPath: 'lst/logo_shark.svg',
    jsonFilename: 'shZIL_prices.json',
  },
  {
    name: 'PlunderSwap',
    symbol: 'pZIL',
    tokenAddress: '0xc85b0db68467dede96A7087F4d4C47731555cA7A',
    proxyAddress: '0x691682FCa60Fa6B702a0a69F60d045c08f404220',
    logoPath: 'lst/logo_Plunderswap.webp',
    jsonFilename: 'pZIL_prices.json',
  },
  {
    name: 'TorchWallet.io',
    symbol: 'tZIL',
    tokenAddress: '0x9e4E0F7A06E50DA13c78cF8C83E907f792DE54fd',
    proxyAddress: '0xBB2Cb8B573Ec1ec4f77953128df7F1d08D9c34DF',
    logoPath: 'lst/logo_torchwallet.webp',
    jsonFilename: 'tZIL_prices.json',
  },
  {
    name: 'Amazing Pool - Avely and ZilPay',
    symbol: 'aZIL',
    tokenAddress: '0x8a2afD8Fe79F8C694210eB71f4d726Fc8cAFdB31',
    proxyAddress: '0x1f0e86Bc299Cc66df2e5512a7786C3F528C0b5b6',
    logoPath: 'lst/logo_amazing_pool.svg',
    jsonFilename: 'aZIL_prices.json',
  },
]

// Cookie keys for user preferences
const LST_SHOW_HISTORICAL_COOKIE = 'lst_show_historical'
const LST_SHOW_EXTENDED_HISTORICAL_COOKIE = 'lst_show_extended_historical'
const LST_SHOW_CHARTS_COOKIE = 'lst_show_charts'
const LST_SORT_PREFERENCE_COOKIE = 'lst_sort_preference'
const LST_PRICE_DIRECTION_COOKIE = 'lst_price_direction'

// LST Price Data Utility Functions
export const LST_PRICES_BASE_URL = 'https://static.plunderswap.com/lst-prices/'

/**
 * Find the closest price entry for a given target block number
 */
export const findClosestPriceEntry = (prices: LSTJsonPriceEntry[], targetBlock: number): LSTJsonPriceEntry | null => {
  if (!prices.length) return null
  
  // Binary search for the closest block
  let left = 0
  let right = prices.length - 1
  let closest = prices[0]
  let minDiff = Math.abs(prices[0].block - targetBlock)
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const currentDiff = Math.abs(prices[mid].block - targetBlock)
    
    if (currentDiff < minDiff) {
      minDiff = currentDiff
      closest = prices[mid]
    }
    
    if (prices[mid].block === targetBlock) {
      return prices[mid]
    }
    if (prices[mid].block < targetBlock) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  
  return closest
}

/**
 * Calculate historical block numbers based on current block
 */
export const calculateHistoricalBlocks = (currentBlock: number): {
  blocks10k: number
  blocks100k: number
  blocks500k: number
  blocks1M: number
  blocks2M: number
  blocks3M: number
  blocks4M: number
} => {
  return {
    blocks10k: Math.max(currentBlock - 10000, 1),
    blocks100k: Math.max(currentBlock - 100000, 1),
    blocks500k: Math.max(currentBlock - 500000, 1),
    blocks1M: Math.max(currentBlock - 1000000, 1),
    blocks2M: Math.max(currentBlock - 2000000, 1),
    blocks3M: Math.max(currentBlock - 3000000, 1),
    blocks4M: Math.max(currentBlock - 4000000, 1),
  }
}

/**
 * Calculate uptime percentage based on price changes over 10k block intervals
 * Downtime is detected when consecutive entries (10k blocks apart) have identical prices
 */
export const calculateUptime = (prices: LSTJsonPriceEntry[]): number => {
  if (prices.length < 2) return 100 // Can't calculate with less than 2 data points
  
  let totalPeriods = 0
  let uptimePeriods = 0
  
  for (let i = 1; i < prices.length; i++) {
    const currentEntry = prices[i]
    const previousEntry = prices[i - 1]
    
    // Check if this is a 10k block interval (approximately)
    const blockDiff = currentEntry.block - previousEntry.block
    if (blockDiff >= 9000 && blockDiff <= 11000) { // Allow some tolerance for 10k intervals
      totalPeriods++
      
      // If prices are different, this is uptime (activity detected)
      if (currentEntry.price !== previousEntry.price) {
        uptimePeriods++
      }
      // If prices are identical, this is downtime (no activity)
    }
  }
  
  if (totalPeriods === 0) return 100 // No 10k intervals found, assume 100% uptime
  
  return (uptimePeriods / totalPeriods) * 100
}

/**
 * Get historical prices from JSON data using latest values as baseline
 */
export const getHistoricalPricesFromJSON = (
  jsonData: LSTJsonPriceData
): {
  blocks10k: string
  blocks100k: string
  blocks500k: string
  blocks1M: string
  blocks2M: string
  blocks3M: string
  blocks4M: string
  currentPrice: string
  latestBlock: number
  change10k: number
  change100k: number
  change500k: number
  change1M: number
  change2M: number
  change3M: number
  change4M: number
  uptime: number
} => {
  if (!jsonData.prices.length) {
    return {
      blocks10k: '0',
      blocks100k: '0',
      blocks500k: '0',
      blocks1M: '0',
      blocks2M: '0',
      blocks3M: '0',
      blocks4M: '0',
      currentPrice: '0',
      latestBlock: 0,
      change10k: 0,
      change100k: 0,
      change500k: 0,
      change1M: 0,
      change2M: 0,
      change3M: 0,
      change4M: 0,
      uptime: 100,
    }
  }

  // Get the latest (most recent) entry as our baseline
  const latestEntry = jsonData.prices[jsonData.prices.length - 1]
  const latestBlock = latestEntry.block
  const latestPrice = latestEntry.price
  
  // Calculate historical block numbers based on latest block
  const blocks10k = latestBlock - 10000
  const blocks100k = latestBlock - 100000
  const blocks500k = latestBlock - 500000
  const blocks1M = latestBlock - 1000000
  const blocks2M = latestBlock - 2000000
  const blocks3M = latestBlock - 3000000
  const blocks4M = latestBlock - 4000000
  
  // Find closest price entries for each period
  const price10k = findClosestPriceEntry(jsonData.prices, blocks10k)?.price || '0'
  const price100k = findClosestPriceEntry(jsonData.prices, blocks100k)?.price || '0'
  const price500k = findClosestPriceEntry(jsonData.prices, blocks500k)?.price || '0'
  const price1M = findClosestPriceEntry(jsonData.prices, blocks1M)?.price || '0'
  const price2M = findClosestPriceEntry(jsonData.prices, blocks2M)?.price || '0'
  const price3M = findClosestPriceEntry(jsonData.prices, blocks3M)?.price || '0'
  const price4M = findClosestPriceEntry(jsonData.prices, blocks4M)?.price || '0'
  
  // Use latest price as baseline for all calculations
  const latestNum = parseFloat(latestPrice)
  const price10kNum = parseFloat(price10k)
  const price100kNum = parseFloat(price100k)
  const price500kNum = parseFloat(price500k)
  const price1MNum = parseFloat(price1M)
  const price2MNum = parseFloat(price2M)
  const price3MNum = parseFloat(price3M)
  const price4MNum = parseFloat(price4M)
  
  // Calculate raw price change based on latest JSON price vs historical JSON prices
  const change10k = latestNum - price10kNum
  const change100k = latestNum - price100kNum
  const change500k = latestNum - price500kNum
  const change1M = latestNum - price1MNum
  const change2M = latestNum - price2MNum
  const change3M = latestNum - price3MNum
  const change4M = latestNum - price4MNum
  
  // Calculate uptime based on price changes over 10k block intervals
  const uptime = calculateUptime(jsonData.prices)
  
  return {
    blocks10k: price10k,
    blocks100k: price100k,
    blocks500k: price500k,
    blocks1M: price1M,
    blocks2M: price2M,
    blocks3M: price3M,
    blocks4M: price4M,
    currentPrice: latestPrice,
    latestBlock,
    change10k,
    change100k,
    change500k,
    change1M,
    change2M,
    change3M,
    change4M,
    uptime,
  }
}

// Utility functions
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

export const formatPercentage = (value: number, decimals = 2): string => {
  if (Number.isNaN(value)) return '0.00%'
  return `${value.toFixed(decimals)}%`
}

export const formatRawChange = (value: number, decimals = 8): string => {
  if (Number.isNaN(value)) return '0.00000000'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}`
}

export const formatPrice = (value: string | number, decimals = 6): string => {
  const num = Number(value)
  if (Number.isNaN(num) || num === 0) return '0'
  
  // For very small numbers, show more decimals
  if (num < 0.000001) {
    return num.toExponential(3)
  }
  
  return num.toFixed(decimals)
}

export const formatTimeAgo = (timestamp: string): string => {
  if (!timestamp) return 'Unknown'
  
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes === 1 ? '' : 's'} ago`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  } catch (error) {
    console.error('Error formatting timestamp:', error)
    return 'Unknown'
  }
}

// EIP-747 Add Token to Wallet functionality
export const addTokenToWallet = async (config: LSTConfig): Promise<boolean> => {
  const ethereum = (window as any)?.ethereum
  if (!ethereum) {
    console.error('No Ethereum provider found')
    return false
  }

  const params: AddTokenParams = {
    type: 'ERC20',
    options: {
      address: config.tokenAddress,
      symbol: config.symbol,
      decimals: 18,
      image: config.logoPath ? `https://plunderswap.com/images/${config.logoPath}` : undefined,
    },
  }

  try {
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params,
    })

    return wasAdded
  } catch (error) {
    console.error('Error adding token to wallet:', error)
    return false
  }
}

// Calculate overall LST statistics
export const calculateLSTStats = (lstData: LSTData[]): LSTStats => {
  const validData = lstData.filter((lst) => lst.historical.currentPrice !== '0')
  
  if (validData.length === 0) {
    return {
      totalCount: 0,
      avgChange10k: 0,
      avgChange100k: 0,
      avgChange500k: 0,
      avgChange1M: 0,
      avgChange2M: 0,
      avgChange3M: 0,
      avgChange4M: 0,
      bestPerformer10k: null,
      bestPerformer100k: null,
      bestPerformer500k: null,
      bestPerformer1M: null,
      bestPerformer2M: null,
      bestPerformer3M: null,
      bestPerformer4M: null,
    }
  }

  const avgChange10k = validData.reduce((sum, lst) => sum + (lst.historical.change10k ?? 0), 0) / validData.length
  const avgChange100k = validData.reduce((sum, lst) => sum + (lst.historical.change100k ?? 0), 0) / validData.length
  const avgChange500k = validData.reduce((sum, lst) => sum + lst.historical.change500k, 0) / validData.length
  const avgChange1M = validData.reduce((sum, lst) => sum + lst.historical.change1M, 0) / validData.length
  const avgChange2M = validData.reduce((sum, lst) => sum + lst.historical.change2M, 0) / validData.length
  const avgChange3M = validData.reduce((sum, lst) => sum + lst.historical.change3M, 0) / validData.length
  const avgChange4M = validData.reduce((sum, lst) => sum + lst.historical.change4M, 0) / validData.length

  const bestPerformer10k = validData.reduce((best, current) => 
    (current.historical.change10k ?? -Infinity) > (best.historical.change10k ?? -Infinity) ? current : best
  )

  const bestPerformer100k = validData.reduce((best, current) => 
    (current.historical.change100k ?? -Infinity) > (best.historical.change100k ?? -Infinity) ? current : best
  )

  const bestPerformer500k = validData.reduce((best, current) => 
    current.historical.change500k > best.historical.change500k ? current : best
  )

  const bestPerformer1M = validData.reduce((best, current) => 
    current.historical.change1M > best.historical.change1M ? current : best
  )

  const bestPerformer2M = validData.reduce((best, current) => 
    current.historical.change2M > best.historical.change2M ? current : best
  )

  const bestPerformer3M = validData.reduce((best, current) => 
    current.historical.change3M > best.historical.change3M ? current : best
  )

  const bestPerformer4M = validData.reduce((best, current) => 
    current.historical.change4M > best.historical.change4M ? current : best
  )

  return {
    totalCount: validData.length,
    avgChange10k,
    avgChange100k,
    avgChange500k,
    avgChange1M,
    avgChange2M,
    avgChange3M,
    avgChange4M,
    bestPerformer10k,
    bestPerformer100k,
    bestPerformer500k,
    bestPerformer1M,
    bestPerformer2M,
    bestPerformer3M,
    bestPerformer4M,
  }
}

// Cookie management for user preferences
export const getStoredShowHistorical = (): boolean => {
  const stored = getCookie(LST_SHOW_HISTORICAL_COOKIE)
  return stored ? stored === 'true' : true // default to true
}

export const setStoredShowHistorical = (value: boolean) => {
  setCookie(LST_SHOW_HISTORICAL_COOKIE, value.toString())
}

export const getStoredShowExtendedHistorical = (): boolean => {
  const stored = getCookie(LST_SHOW_EXTENDED_HISTORICAL_COOKIE)
  return stored ? stored === 'true' : true // default to true
}

export const setStoredShowExtendedHistorical = (value: boolean) => {
  setCookie(LST_SHOW_EXTENDED_HISTORICAL_COOKIE, value.toString())
}

export const getStoredShowCharts = (): boolean => {
  const stored = getCookie(LST_SHOW_CHARTS_COOKIE)
  return stored ? stored === 'true' : true // default to true
}

export const setStoredShowCharts = (value: boolean) => {
  setCookie(LST_SHOW_CHARTS_COOKIE, value.toString())
}

export const getStoredSortPreference = (): string => {
  return getCookie(LST_SORT_PREFERENCE_COOKIE) || 'growth500k' // default sort
}

export const setStoredSortPreference = (value: string) => {
  setCookie(LST_SORT_PREFERENCE_COOKIE, value)
}

export const getStoredPriceDirection = (): 'zil-to-lst' | 'lst-to-zil' => {
  const stored = getCookie(LST_PRICE_DIRECTION_COOKIE)
  return stored === 'lst-to-zil' ? 'lst-to-zil' : 'zil-to-lst' // default to ZIL to LST
}

export const setStoredPriceDirection = (value: 'zil-to-lst' | 'lst-to-zil') => {
  setCookie(LST_PRICE_DIRECTION_COOKIE, value)
}

// Get token logo path
export const getTokenLogoPath = (symbol: string): string => {
  const config = LST_CONFIGS.find((c) => c.symbol === symbol)
  return config?.logoPath || 'default-token.png'
}

// Format address for display
export const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Get PlunderSwap URL for token
export const getPlunderSwapUrl = (tokenAddress: string): string => {
  return `https://plunderswap.com/swap?outputCurrency=${tokenAddress}`
}

// Sort LST data by different criteria
export const sortLSTData = (data: LSTData[], sortBy: string, direction: 'asc' | 'desc' = 'desc'): LSTData[] => {
  const sorted = [...data].sort((a, b) => {
    let aValue: number
    let bValue: number

    switch (sortBy) {
      case 'symbol':
        return direction === 'desc' 
          ? b.config.symbol.localeCompare(a.config.symbol)
          : a.config.symbol.localeCompare(b.config.symbol)
      case 'price':
        aValue = parseFloat(a.price.current)
        bValue = parseFloat(b.price.current)
        break
      case 'change10k':
        aValue = a.historical.change10k ?? 0
        bValue = b.historical.change10k ?? 0
        break
      case 'change100k':
        aValue = a.historical.change100k ?? 0
        bValue = b.historical.change100k ?? 0
        break
      case 'change500k':
        aValue = a.historical.change500k
        bValue = b.historical.change500k
        break
      case 'change1M':
        aValue = a.historical.change1M
        bValue = b.historical.change1M
        break
      case 'change2M':
        aValue = a.historical.change2M
        bValue = b.historical.change2M
        break
      case 'change3M':
        aValue = a.historical.change3M
        bValue = b.historical.change3M
        break
      case 'change4M':
        aValue = a.historical.change4M
        bValue = b.historical.change4M
        break
      case 'uptime':
        aValue = a.historical.uptime
        bValue = b.historical.uptime
        break
      case 'tradingVolume':
        aValue = a.trading ? parseFloat(a.trading.volume_usd_24h) : 0
        bValue = b.trading ? parseFloat(b.trading.volume_usd_24h) : 0
        break
      default:
        return 0
    }

    return direction === 'desc' ? bValue - aValue : aValue - bValue
  })

  return sorted
}

// Check if browser supports Web3
export const isWeb3Supported = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined'
} 