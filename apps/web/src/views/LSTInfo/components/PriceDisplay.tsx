import { Button, Flex, Text } from '@pancakeswap/uikit'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { LSTData } from '../types'
import { formatPrice } from '../utils'

interface PriceDisplayProps {
  lst: LSTData
  showReverse?: boolean
}

const PriceContainer = styled(Flex)`
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  flex: 1;

  @media screen and (max-width: 852px) {
    align-items: flex-start;
  }
`

const PriceRow = styled(Flex)`
  align-items: center;
  gap: 8px;
  justify-content: flex-end;

  @media screen and (max-width: 852px) {
    justify-content: flex-start;
  }
`

const PriceText = styled(Text)`
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
`

const SwapPriceText = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
  white-space: nowrap;
`

const TradeButton = styled(Button)`
  padding: 4px 8px;
  height: auto;
  font-size: 10px;
  min-width: auto;
`

const ToggleButton = styled(Button)`
  padding: 2px 4px;
  height: auto;
  font-size: 10px;
  min-width: auto;
  width: 20px;
  height: 20px;
`

const ArbIndicator = styled(Text)<{ isPositive: boolean }>`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme, isPositive }) => (isPositive ? theme.colors.success : theme.colors.failure)};
`

export const PriceDisplay = ({ lst, showReverse = false }: PriceDisplayProps) => {
  const [isReversed, setIsReversed] = useState(showReverse)

  const handleToggle = useCallback(() => {
    setIsReversed(!isReversed)
  }, [isReversed])

  const handleTradeProxy = useCallback(() => {
    window.open(`https://plunderswap.com/swap?outputCurrency=${lst.config.tokenAddress}`, '_blank')
  }, [lst.config.tokenAddress])

  const handleTradeSwap = useCallback(() => {
    if (lst.trading) {
      window.open(lst.trading.swapUrl, '_blank')
    }
  }, [lst.trading])

  // Calculate proxy price display
  const proxyPrice = parseFloat(lst.price.current)
  const proxyDisplay = isReversed 
    ? `1 ${lst.config.symbol} → ${formatPrice(1 / proxyPrice, 4)} ZIL`
    : `1 ZIL → ${formatPrice(proxyPrice, 4)} ${lst.config.symbol}`

  // Calculate swap price display and arbitrage opportunity
  let swapDisplay = ''
  let arbOpportunity = 0
  let hasArb = false

  if (lst.trading) {
    // Determine which price to use based on token order
    const isToken0 = lst.config.tokenAddress.toLowerCase() === lst.trading.token0Address.toLowerCase()
    const swapRate = isToken0 ? parseFloat(lst.trading.prices.price10) : parseFloat(lst.trading.prices.price01)
    
    swapDisplay = isReversed
      ? `1 ${lst.config.symbol} → ${formatPrice(1 / swapRate, 4)} ZIL`
      : `1 ZIL → ${formatPrice(swapRate, 4)} ${lst.config.symbol}`

    // Calculate arbitrage opportunity (difference between proxy and swap rates)
    const proxyRate = isReversed ? (1 / proxyPrice) : proxyPrice
    const swapRateDisplay = isReversed ? (1 / swapRate) : swapRate
    arbOpportunity = ((swapRateDisplay - proxyRate) / proxyRate) * 100
    hasArb = Math.abs(arbOpportunity) > 0.01 // Show if difference > 0.01%
  }

  return (
    <PriceContainer>
      <PriceRow>
        <PriceText>{proxyDisplay}</PriceText>
        <ToggleButton variant="text" onClick={handleToggle}>
          ⇄
        </ToggleButton>
        <TradeButton variant="primary" size="sm" onClick={handleTradeProxy}>
          Trade
        </TradeButton>
      </PriceRow>
      
      {lst.trading && (
        <PriceRow>
          <SwapPriceText>{swapDisplay}</SwapPriceText>
          {hasArb && (
            <ArbIndicator isPositive={arbOpportunity > 0}>
              {arbOpportunity > 0 ? '+' : ''}{arbOpportunity.toFixed(2)}%
            </ArbIndicator>
          )}
          <TradeButton variant="secondary" size="sm" onClick={handleTradeSwap}>
            Swap
          </TradeButton>
        </PriceRow>
      )}
    </PriceContainer>
  )
} 