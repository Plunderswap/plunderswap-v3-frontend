import { buildTokenAddressMap } from './utils'

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
  return fetchWithRetry(PAIR_URL)
}

export const fetchPoolData = async () => {
  return fetchWithRetry(POOL_URL)
}

export const fetchPoolAddresses = async () => {
  return fetchWithRetry(POOL_ADDRESSES_URL)
}
