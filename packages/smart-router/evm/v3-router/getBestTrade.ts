import { ChainId } from '@pancakeswap/chains'
import { BigintIsh, Currency, CurrencyAmount, TradeType, ZERO } from '@pancakeswap/sdk'
import { ROUTE_CONFIG_BY_CHAIN } from './constants'
import { computeAllRoutes, getBestRouteCombinationByQuotes } from './functions'
import { createGasModel } from './gasModel'
import { getRoutesWithValidQuote } from './getRoutesWithValidQuote'
import { BestRoutes, RouteConfig, RouteType, SmartRouterTrade, TradeConfig } from './types'
import { logger } from './utils/logger'

logger.enable('error,log')

export async function getBestTrade(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  config: TradeConfig,
): Promise<SmartRouterTrade<TradeType> | null> {
  const { blockNumber: blockNumberFromConfig } = config
  const blockNumber: BigintIsh | undefined =
    typeof blockNumberFromConfig === 'function' ? await blockNumberFromConfig() : blockNumberFromConfig
  const bestRoutes = await getBestRoutes(amount, currency, tradeType, {
    ...config,
    blockNumber,
  })
  if (!bestRoutes || bestRoutes.outputAmount.equalTo(ZERO)) {
    throw new Error('Cannot find a valid swap route')
  }

  const { routes, gasEstimateInUSD, gasEstimate, inputAmount, outputAmount } = bestRoutes
  // TODO restrict trade type to exact input if routes include one of the old
  // stable swap pools, which only allow to swap with exact input
  return {
    tradeType,
    routes,
    gasEstimate,
    gasEstimateInUSD,
    inputAmount,
    outputAmount,
    blockNumber,
  }
}

async function getBestRoutes(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  routeConfig: RouteConfig,
): Promise<BestRoutes | null> {
  const { chainId } = currency
  const {
    maxHops = 3,
    maxSplits = 4,
    distributionPercent: configuredDistributionPercent = 5,
    poolProvider,
    quoteProvider,
    blockNumber,
    gasPriceWei,
    allowedPoolTypes,
    quoterOptimization,
    quoteCurrencyUsdPrice,
    nativeCurrencyUsdPrice,
    signal,
  } = {
    ...routeConfig,
    ...(ROUTE_CONFIG_BY_CHAIN[chainId as ChainId] || {}),
  }

  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const inputCurrency = isExactIn ? amount.currency : currency
  const outputCurrency = isExactIn ? currency : amount.currency

  const candidatePools = await poolProvider?.getCandidatePools({
    currencyA: amount.currency,
    currencyB: currency,
    blockNumber,
    protocols: allowedPoolTypes,
    signal,
  })

  let baseRoutes = computeAllRoutes(inputCurrency, outputCurrency, candidatePools, maxHops)

  // Check if we have a direct route (single hop)
  const hasDirectRoute = baseRoutes.some((route) => route.pools.length === 1)

  // Use 100% distribution for direct routes, configured percent otherwise
  const distributionPercent = hasDirectRoute ? 100 : configuredDistributionPercent

  logger.log('Route distribution:', {
    hasDirectRoute,
    distributionPercent,
    routeCount: baseRoutes.length,
    directRoutes: baseRoutes.filter((r) => r.pools.length === 1).length,
  })

  // Do not support mix route on exact output
  if (tradeType === TradeType.EXACT_OUTPUT) {
    baseRoutes = baseRoutes.filter(({ type }) => type !== RouteType.MIXED)
  }

  const gasModel = await createGasModel({
    gasPriceWei,
    poolProvider,
    quoteCurrency: currency,
    blockNumber,
    quoteCurrencyUsdPrice,
    nativeCurrencyUsdPrice,
  })

  const routesWithValidQuote = await getRoutesWithValidQuote({
    amount,
    baseRoutes,
    distributionPercent, // Now using the adjusted distribution percent
    quoteProvider,
    tradeType,
    blockNumber,
    gasModel,
    quoterOptimization,
    signal,
  })

  return getBestRouteCombinationByQuotes(amount, currency, routesWithValidQuote, tradeType, { maxSplits })
}
