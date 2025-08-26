export interface LSTConfig {
  name: string
  symbol: string
  tokenAddress: string
  proxyAddress: string
  logoPath?: string
  jsonFilename?: string // For pre-indexed price data
}

export interface LSTPrice {
  current: string // Current LST/ZIL rate from proxy contract
  formatted: string // Formatted for display
  inverse: string // ZIL/LST rate
  inverseFormatted: string // Formatted inverse for display
}

export interface LSTHistoricalPrice {
  blocks10k?: string // Price 10k blocks ago
  blocks100k?: string // Price 100k blocks ago
  blocks500k: string // Price 500k blocks ago
  blocks1M: string // Price 1M blocks ago
  currentPrice: string
  growth10k?: number // Growth percentage from 10k blocks ago
  growth100k?: number // Growth percentage from 100k blocks ago
  growth500k: number // Growth percentage from 500k blocks ago
  growth1M: number // Growth percentage from 1M blocks ago
}

export interface LSTTradingData {
  symbol0: string
  symbol1: string
  token0Address: string
  token1Address: string
  prices: {
    price01: string
    price10: string
    token0USD: string
    token1USD: string
  }
  tvlUSD: string
  volume_usd_24h: string
  volume_usd_7d: string
  swapUrl: string // Direct link to PlunderSwap
}

export interface LSTData {
  config: LSTConfig
  price: LSTPrice
  historical: LSTHistoricalPrice
  trading?: LSTTradingData // Optional - only available for tokens with trading pairs
  lastUpdated: string
}

export interface LSTStats {
  totalCount: number
  avgGrowth10k?: number
  avgGrowth100k?: number
  avgGrowth500k: number
  avgGrowth1M: number
  bestPerformer10k?: LSTData | null
  bestPerformer100k?: LSTData | null
  bestPerformer500k: LSTData | null
  bestPerformer1M: LSTData | null
}

// EIP-747 Add Token to Wallet interface
export interface AddTokenParams {
  type: 'ERC20'
  options: {
    address: string
    symbol: string
    decimals: number
    image?: string
  }
}

// Ethereum RPC call types
export interface EthCallParams {
  to: string
  data: string
}

export interface EthRPCRequest {
  jsonrpc: string
  method: string
  params: [EthCallParams, string] // [call params, block number]
  id: number
}

export interface EthRPCResponse {
  jsonrpc: string
  id: number
  result?: string
  error?: {
    code: number
    message: string
  }
}

// Pre-indexed JSON price data interfaces
export interface LSTJsonPriceEntry {
  block: number
  price: string
  timestamp: number
}

export interface LSTJsonPriceData {
  symbol: string
  name: string
  prices: LSTJsonPriceEntry[]
} 