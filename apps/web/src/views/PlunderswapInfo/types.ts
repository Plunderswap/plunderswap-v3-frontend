export interface TokenData {
  quantity: string
  tvlUSD: string
  tvlZIL: string
}

export interface PriceData {
  price01: string
  price10: string
  token0USD: string
  token1USD: string
  priceSource: string
}

export interface PairData {
  symbol0: string
  symbol1: string
  token0Address: string
  token1Address: string
  decimal0: number
  decimal1: number
  token0: TokenData
  token1: TokenData
  prices: PriceData
  tvlUSD: string
  tvlZIL: string
  pools: string[]
  timestamp: string
  volume_usd_24h: string
  volume_usd_7d: string
  fees_usd_24h: string
  fees_usd_7d: string
  apr_24h_min: string
  apr_24h_max: string
  apr_7d_min: string
  apr_7d_max: string
  tx_count_24h: number
  tx_count_7d: number
}

export interface PoolData
  extends Omit<PairData, 'pools' | 'apr_24h_min' | 'apr_24h_max' | 'apr_7d_min' | 'apr_7d_max'> {
  address: string
  version: string
  fee: number
  apr_24h: string
  apr_7d: string
}
