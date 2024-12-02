export interface TokenData {
  quantity: string
  tvlUSD: string
  tvlZIL: string
}

export interface PriceData {
  price01: string
  price10: string
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
}

export interface PoolData extends PairData {
  address: string
  version: string
  fee: number
}
