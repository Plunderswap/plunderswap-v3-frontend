import { PREFERRED_SECOND_TOKEN, STABLECOINS, buildTokenAddressMap } from './utils'

const PAIR_URL = 'https://static.plunderswap.com/PlunderswapPairPrices.json'
const POOL_URL = 'https://static.plunderswap.com/PlunderswapPoolPrices.json'
const POOL_ADDRESSES_URL = 'https://static.plunderswap.com/PlunderswapPools.json'

const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (url === POOL_ADDRESSES_URL && data.pools) {
      buildTokenAddressMap(data.pools)
    }

    return data
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return fetchWithRetry(url, retries - 1)
    }
    console.error(`Failed to fetch from ${url}:`, error)
    return []
  }
}

export const fetchPairData = async () => {
  const data = await fetchWithRetry(PAIR_URL)
  // Pre-process the data to ensure consistent price ordering
  return data.map((pair: any) => {
    const shouldReverse =
      STABLECOINS.includes(pair.symbol0) ||
      (!STABLECOINS.includes(pair.symbol1) && PREFERRED_SECOND_TOKEN.includes(pair.symbol0.toUpperCase()))

    if (shouldReverse) {
      return {
        ...pair,
        symbol0: pair.symbol1,
        symbol1: pair.symbol0,
        token0Address: pair.token1Address,
        token1Address: pair.token0Address,
        decimal0: pair.decimal1,
        decimal1: pair.decimal0,
        token0: pair.token1,
        token1: pair.token0,
        prices: {
          price01: pair.prices.price10,
          price10: pair.prices.price01,
        },
      }
    }
    return pair
  })
}

export const fetchPoolData = async () => {
  return fetchWithRetry(POOL_URL)
}

export const fetchPoolAddresses = async () => {
  return fetchWithRetry(POOL_ADDRESSES_URL)
}
