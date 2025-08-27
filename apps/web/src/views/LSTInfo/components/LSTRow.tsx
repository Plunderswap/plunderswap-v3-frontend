import { Button, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { LSTData } from '../types'
import { addTokenToWallet, formatPercentage, formatPrice, isWeb3Supported } from '../utils'

interface LSTRowProps {
  lst: LSTData
  showHistorical: boolean
  showExtendedHistorical: boolean
  priceDirection: 'zil-to-lst' | 'lst-to-zil'
}

const RowContainer = styled(Flex)`
  padding: 16px 40px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  min-height: 80px;
  align-items: center;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt2};
  }

  @media screen and (max-width: 852px) {
    padding: 16px 20px;
  }
`

const TokenContainer = styled(Flex)`
  flex: 1.5;
  align-items: center;
  gap: 12px;

  @media screen and (max-width: 852px) {
    flex: 1;
    flex-direction: column;
    gap: 6px;
    justify-content: center;
  }
`

const TokenLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`

const TokenInfo = styled(Flex)`
  flex-direction: column;
  
  @media screen and (max-width: 852px) {
    align-items: center;
    text-align: center;
  }
`

const TokenSymbol = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`

const TokenName = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const PriceContainer = styled(Flex)`
  flex: 1;
  flex-direction: column;
  align-items: flex-end;

  @media screen and (max-width: 852px) {
    align-items: flex-start;
  }
`

const PriceText = styled(Text)`
  font-weight: 600;
  font-size: 14px;
`

const InversePriceText = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const GrowthContainer = styled(Flex)`
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;

  @media screen and (max-width: 852px) {
    flex: 1.2;
    align-items: flex-start;
  }
`

const TradeContainer = styled(Flex)`
  flex: 1;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 852px) {
    justify-content: flex-start;
  }
`

const GrowthText = styled(Text)<{ isPositive: boolean }>`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme, isPositive }) => (isPositive ? theme.colors.success : theme.colors.failure)};
`

const ActionsContainer = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
  gap: 8px;
  align-items: center;

  @media screen and (max-width: 852px) {
    flex-direction: column;
    gap: 4px;
  }
`

const AddToWalletButton = styled(Button)`
  padding: 8px 12px;
  height: auto;
  font-size: 12px;
  min-width: auto;
`

const TradeButton = styled(Button)`
  padding: 8px 12px;
  height: auto;
  font-size: 12px;
  min-width: auto;
`

const GrowthPeriodText = styled(Text)`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const MobileStatsContainer = styled(Flex)`
  flex-direction: column;
  flex: 2;
  gap: 8px;

  @media screen and (min-width: 853px) {
    display: none;
  }
`

const MobileStatRow = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`

export const LSTRow = ({ lst, showHistorical, showExtendedHistorical, priceDirection }: LSTRowProps) => {
  const [isAddingToWallet, setIsAddingToWallet] = useState(false)
  const { isMobile } = useMatchBreakpoints()

  // Helper function to get display name (shorten encapZIL)
  const getDisplayName = () => {
    if (lst.config.symbol === 'encapZIL') {
      return 'Encap'
    }
    return lst.config.name
  }

  // Helper functions to format prices based on direction
  const getProxyPriceDisplay = () => {
    if (priceDirection === 'lst-to-zil') {
      return `1 ${lst.config.symbol} → ${formatPrice(lst.price.inverse, 4)} ZIL`
    }
    return `1 ZIL → ${formatPrice(lst.price.current, 4)} ${lst.config.symbol}`
  }

  const getSwapPriceDisplay = () => {
    if (!lst.trading) return null
    
    const isToken0 = lst.config.tokenAddress.toLowerCase() === lst.trading.token0Address.toLowerCase()
    
    if (priceDirection === 'lst-to-zil') {
      const lstToZilPrice = isToken0 ? lst.trading.prices.price01 : lst.trading.prices.price10
      return `1 ${lst.config.symbol} → ${formatPrice(lstToZilPrice, 4)} ZIL`
    }
    
    const zilToLstPrice = isToken0 ? lst.trading.prices.price10 : lst.trading.prices.price01
    return `1 ZIL → ${formatPrice(zilToLstPrice, 4)} ${lst.config.symbol}`
  }

  const handleAddToWallet = useCallback(async () => {
    if (!isWeb3Supported()) return

    setIsAddingToWallet(true)
    try {
      await addTokenToWallet(lst.config)
    } catch (error) {
      console.error('Failed to add token to wallet:', error)
    } finally {
      setIsAddingToWallet(false)
    }
  }, [lst.config])

  const handleTrade = useCallback(() => {
    if (lst.trading) {
      window.open(lst.trading.swapUrl, '_blank')
    }
  }, [lst.trading])

  if (isMobile) {
    return (
      <RowContainer>
        <TokenContainer>
          <TokenLogo 
            src={`/images/${lst.config.logoPath}`} 
            alt={lst.config.symbol}
            onClick={isWeb3Supported() ? handleAddToWallet : undefined}
            title={isWeb3Supported() ? 'Click to add token to wallet' : 'Web3 wallet not detected'}
            style={{ cursor: isWeb3Supported() ? 'pointer' : 'default', opacity: isAddingToWallet ? 0.5 : 1 }}
          />
          <TokenInfo>
            <TokenSymbol>{lst.config.symbol}</TokenSymbol>
            <TokenName>{getDisplayName()}</TokenName>
          </TokenInfo>
        </TokenContainer>

        <MobileStatsContainer>
          <MobileStatRow>
            <Text fontSize="12px" color="textSubtle">Proxy Price</Text>
            <PriceText>{getProxyPriceDisplay()}</PriceText>
          </MobileStatRow>

          <MobileStatRow>
            <Text fontSize="12px" color="textSubtle">Swap Price</Text>
            <PriceText>{lst.trading ? getSwapPriceDisplay() : '-'}</PriceText>
          </MobileStatRow>

          {lst.trading && (
            <MobileStatRow>
              <Text fontSize="12px" color="textSubtle">Trade</Text>
              <TradeButton variant="primary" size="sm" onClick={handleTrade}>
                Trade
              </TradeButton>
            </MobileStatRow>
          )}
        </MobileStatsContainer>
      </RowContainer>
    )
  }

  return (
    <RowContainer>
      <TokenContainer>
                  <TokenLogo 
            src={`/images/${lst.config.logoPath}`} 
            alt={lst.config.symbol}
            onClick={isWeb3Supported() ? handleAddToWallet : undefined}
            title={isWeb3Supported() ? 'Click to add token to wallet' : 'Web3 wallet not detected'}
            style={{ cursor: isWeb3Supported() ? 'pointer' : 'default', opacity: isAddingToWallet ? 0.5 : 1 }}
          />
        <TokenInfo>
          <TokenSymbol>{lst.config.symbol}</TokenSymbol>
          <TokenName>{getDisplayName()}</TokenName>
        </TokenInfo>
      </TokenContainer>

      <PriceContainer>
        <PriceText>{getProxyPriceDisplay()}</PriceText>
      </PriceContainer>

      <PriceContainer>
        <PriceText>
          {lst.trading ? getSwapPriceDisplay() : '-'}
        </PriceText>
      </PriceContainer>

      <TradeContainer>
        {lst.trading && (
          <TradeButton variant="primary" size="sm" onClick={handleTrade}>
            Trade
          </TradeButton>
        )}
      </TradeContainer>

      {showHistorical && (
        <GrowthContainer>
          <GrowthText isPositive={(lst.historical.growth10k ?? 0) >= 0}>
            {formatPercentage(lst.historical.growth10k ?? 0, 5)}
          </GrowthText>
          <GrowthPeriodText>10k blocks</GrowthPeriodText>
        </GrowthContainer>
      )}

      {showHistorical && (
        <GrowthContainer>
          <GrowthText isPositive={(lst.historical.growth100k ?? 0) >= 0}>
            {formatPercentage(lst.historical.growth100k ?? 0, 5)}
          </GrowthText>
          <GrowthPeriodText>100k blocks</GrowthPeriodText>
        </GrowthContainer>
      )}

      {showHistorical && (
        <GrowthContainer>
          <GrowthText isPositive={lst.historical.growth500k >= 0}>
            {formatPercentage(lst.historical.growth500k, 5)}
          </GrowthText>
          <GrowthPeriodText>500k blocks</GrowthPeriodText>
        </GrowthContainer>
      )}

      {showExtendedHistorical && (
        <GrowthContainer>
          <GrowthText isPositive={lst.historical.growth1M >= 0}>
            {formatPercentage(lst.historical.growth1M, 5)}
          </GrowthText>
          <GrowthPeriodText>1M blocks</GrowthPeriodText>
        </GrowthContainer>
      )}

      {showExtendedHistorical && (
        <GrowthContainer>
          <GrowthText isPositive={lst.historical.growth2M >= 0}>
            {formatPercentage(lst.historical.growth2M, 5)}
          </GrowthText>
          <GrowthPeriodText>2M blocks</GrowthPeriodText>
        </GrowthContainer>
      )}

      {showExtendedHistorical && (
        <GrowthContainer>
          <GrowthText isPositive={lst.historical.growth3M >= 0}>
            {formatPercentage(lst.historical.growth3M, 5)}
          </GrowthText>
          <GrowthPeriodText>3M blocks</GrowthPeriodText>
        </GrowthContainer>
      )}


    </RowContainer>
  )
} 