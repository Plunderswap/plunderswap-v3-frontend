import { ChainId } from '@pancakeswap/chains'
import { publicClient } from 'utils/wagmi'
import { formatUnits } from 'viem'
import { LSTConfig, LSTData, LSTHistoricalPrice, LSTJsonPriceData, LSTPrice, LSTTradingData } from './types'
import { getHistoricalPricesFromJSON, LST_CONFIGS, LST_PRICES_BASE_URL } from './utils'

const PLUNDERSWAP_PAIR_URL = 'https://static.plunderswap.com/PlunderswapPairPrices.json'

// Simple ABI for getPrice function
const GET_PRICE_ABI = [
  {
    name: 'getPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'amount', type: 'uint256' }],
  },
] as const

const fetchWithRetry = async (url: string, options?: RequestInit, retries = 3): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: options?.method || 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return fetchWithRetry(url, options, retries - 1)
    }
    console.error(`Failed to fetch from ${url}:`, error)
    throw error
  }
}

export const getLSTPrice = async (proxyAddress: string, blockNumber?: bigint): Promise<string> => {
  try {
    const data = await publicClient({ chainId: ChainId.ZILLIQA }).readContract({
      abi: GET_PRICE_ABI,
      address: proxyAddress as `0x${string}`,
      functionName: 'getPrice',
      blockNumber,
    })

    return formatUnits(data, 18)
  } catch (error) {
    console.error(`Failed to fetch price for ${proxyAddress}:`, error)
    return '0'
  }
}

export const getCurrentBlockNumber = async (): Promise<bigint> => {
  try {
    const blockNumber = await publicClient({ chainId: ChainId.ZILLIQA }).getBlockNumber()
    return blockNumber
  } catch (error) {
    console.error('Failed to get current block number:', error)
    // Fallback to a recent block number
    return BigInt(7200000)
  }
}

export const fetchLSTJsonPriceData = async (config: LSTConfig): Promise<LSTJsonPriceData | null> => {
  if (!config.jsonFilename) {
    console.error(`No JSON filename configured for ${config.symbol}`)
    return null
  }

  try {
    const url = `${LST_PRICES_BASE_URL}${config.jsonFilename}`
    // Cache for 1 hour to reduce requests while staying within R2 cache window
    const response = await fetchWithRetry(url, {
      headers: {
        'Cache-Control': 'max-age=3600', // 1 hour = 3600 seconds
      },
    })
    return response as LSTJsonPriceData
  } catch (error) {
    console.error(`Failed to fetch JSON price data for ${config.symbol}:`, error)
    return null
  }
}

const fetchLSTHistoricalPrices = async (config: LSTConfig): Promise<LSTHistoricalPrice> => {
  try {
    // Fetch pre-indexed JSON price data (no blockchain calls needed)
    const jsonData = await fetchLSTJsonPriceData(config)
    
    if (!jsonData) {
      // Fallback to zeros if JSON data is not available
      return {
        blocks10k: '0',
        blocks100k: '0',
        blocks500k: '0',
        blocks1M: '0',
        blocks2M: '0',
        blocks3M: '0',
        currentPrice: '0',
        latestBlock: 0,
        change10k: 0,
        change100k: 0,
        change500k: 0,
        change1M: 0,
        change2M: 0,
        change3M: 0,
      }
    }
    
    // Get all data from JSON using latest values as baseline
    const historicalData = getHistoricalPricesFromJSON(jsonData)
    
    return {
      blocks10k: historicalData.blocks10k,
      blocks100k: historicalData.blocks100k,
      blocks500k: historicalData.blocks500k,
      blocks1M: historicalData.blocks1M,
      blocks2M: historicalData.blocks2M,
      blocks3M: historicalData.blocks3M,
      currentPrice: historicalData.currentPrice,
      latestBlock: historicalData.latestBlock,
      change10k: historicalData.change10k,
      change100k: historicalData.change100k,
      change500k: historicalData.change500k,
      change1M: historicalData.change1M,
      change2M: historicalData.change2M,
      change3M: historicalData.change3M,
    }
  } catch (error) {
    console.error(`Failed to fetch historical prices for ${config.symbol}:`, error)
    return {
      blocks10k: '0',
      blocks100k: '0',
      blocks500k: '0',
      blocks1M: '0',
      blocks2M: '0',
      blocks3M: '0',
      currentPrice: '0',
      latestBlock: 0,
      change10k: 0,
      change100k: 0,
      change500k: 0,
      change1M: 0,
      change2M: 0,
      change3M: 0,
    }
  }
}

const formatLSTPrice = (priceStr: string): LSTPrice => {
  const price = parseFloat(priceStr)
  const inverse = price > 0 ? 1 / price : 0

  return {
    current: priceStr,
    formatted: price.toFixed(6),
    inverse: inverse.toString(),
    inverseFormatted: inverse.toFixed(6),
  }
}

export const fetchPlunderSwapTradingData = async (): Promise<LSTTradingData[]> => {
  try {
    // No caching for trading data - always fetch fresh pair prices
    const pairData = await fetchWithRetry(PLUNDERSWAP_PAIR_URL, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    
    const lstTradingData: LSTTradingData[] = []
    
    // WZIL token address on Zilliqa
    const WZIL_ADDRESS = '0x94e18aE7dd5eE57B55f30c4B63E2760c09EFb192'
    
    pairData.forEach((pair: any) => {
      // Check if this is a WZIL pair with an LST token
      const isWZILPair = 
        pair.token0Address.toLowerCase() === WZIL_ADDRESS.toLowerCase() ||
        pair.token1Address.toLowerCase() === WZIL_ADDRESS.toLowerCase()
      
      if (!isWZILPair) return // Skip non-WZIL pairs
      
      // Find which token is the LST (not WZIL)
      const lstTokenAddress = pair.token0Address.toLowerCase() === WZIL_ADDRESS.toLowerCase() 
        ? pair.token1Address 
        : pair.token0Address
      
      const lstConfig = LST_CONFIGS.find(
        (config) => config.tokenAddress.toLowerCase() === lstTokenAddress.toLowerCase()
      )
      
      if (lstConfig) {
        const swapUrl = `https://plunderswap.com/swap?outputCurrency=${lstConfig.tokenAddress}`
        
        lstTradingData.push({
          symbol0: pair.symbol0,
          symbol1: pair.symbol1,
          token0Address: pair.token0Address,
          token1Address: pair.token1Address,
          prices: {
            price01: pair.prices.price01,
            price10: pair.prices.price10,
            token0USD: pair.prices.token0USD,
            token1USD: pair.prices.token1USD,
          },
          tvlUSD: pair.tvlUSD,
          volume_usd_24h: pair.volume_usd_24h,
          volume_usd_7d: pair.volume_usd_7d,
          swapUrl,
        })
      }
    })
    
    return lstTradingData
  } catch (error) {
    console.error('Failed to fetch PlunderSwap trading data:', error)
    return []
  }
}

export const fetchLSTData = async (config: LSTConfig): Promise<LSTData> => {
  try {
    // Fetch all data from JSON (no blockchain calls needed)
    const historical = await fetchLSTHistoricalPrices(config)

    // Use the current price from JSON data
    const price = formatLSTPrice(historical.currentPrice)

    return {
      config,
      price,
      historical,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Failed to fetch LST data for ${config.symbol}:`, error)
    return {
      config,
      price: formatLSTPrice('0'),
      historical: {
        blocks10k: '0',
        blocks100k: '0',
        blocks500k: '0',
        blocks1M: '0',
        blocks2M: '0',
        blocks3M: '0',
        currentPrice: '0',
        latestBlock: 0,
        change10k: 0,
        change100k: 0,
        change500k: 0,
        change1M: 0,
        change2M: 0,
        change3M: 0,
      },
      lastUpdated: new Date().toISOString(),
    }
  }
}

export const fetchAllLSTData = async (): Promise<LSTData[]> => {
  try {
    const lstDataPromises = LST_CONFIGS.map(fetchLSTData)
    const lstData = await Promise.all(lstDataPromises)

    const tradingData = await fetchPlunderSwapTradingData()

    const mergedData = lstData.map((lst) => {
      const trading = tradingData.find(
        (trade) =>
          trade.token0Address.toLowerCase() === lst.config.tokenAddress.toLowerCase() ||
          trade.token1Address.toLowerCase() === lst.config.tokenAddress.toLowerCase()
      )

      return {
        ...lst,
        trading,
      }
    })

    return mergedData
  } catch (error) {
    console.error('Failed to fetch all LST data:', error)
    return []
  }
} 