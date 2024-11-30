import { ChevronDownIcon, ChevronUpIcon, Flex, SwapVertIcon, Text } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useState } from 'react'
import styled from 'styled-components'
import { PairData, PoolData } from '../types'
import { formatNumberWithDynamicDecimals, formatTokenSymbol, getTokenAddress, getTokenImagePath } from '../utils'
import PoolRow from './PoolRow'

const RowContainer = styled.div<{ isExpanded: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.background};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt};
  }
`

const TokenImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
`

const TokenImageFallback = styled(Flex)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  align-items: center;
  justify-content: center;
  font-size: 12px;
`

const VersionBadge = styled(Text)<{ version: 'v2' | 'v3' }>`
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  background: ${
    ({ theme, version }) =>
      version === 'v2'
        ? theme.colors.warning // orange/yellow for v2
        : theme.colors.success // green for v3
  };
  color: white;
  margin-right: 4px;
`

const PriceText = styled(Text)`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  &:hover {
    opacity: 0.8;
  }
`

const PriceContainer = styled(Flex)`
  flex: 1.5;
  @media screen and (max-width: 852px) {
    flex: 2;
  }
`

const PairContainer = styled(Flex)`
  flex: 1.5;
  @media screen and (max-width: 852px) {
    flex: 2;
  }
`

const TVLContainer = styled(Flex)`
  flex: 1;
  @media screen and (max-width: 852px) {
    flex: 1.2;
  }
`

const RotateIcon = styled(SwapVertIcon)<{ $isRotated: boolean }>`
  transition: transform 0.2s;
  transform: ${({ $isRotated }) => ($isRotated ? 'rotate(180deg)' : 'rotate(0)')};
`

const MobileTokenInfo = styled(Flex)`
  flex-direction: column;
  gap: 4px;
  width: 100%;
`

const TokenSymbolsRow = styled(Flex)`
  align-items: center;
  width: 100%;
`

const TokenIconsContainer = styled(Flex)`
  margin-right: 8px;
`

interface PairRowProps {
  pair: PairData
  pools: PoolData[]
  isMobile: boolean
}

const MINIMUM_POOL_TVL = 1 // $1 USD minimum threshold

const PairRow: React.FC<PairRowProps> = ({ pair, pools, isMobile }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [imageError0, setImageError0] = useState(false)
  const [imageError1, setImageError1] = useState(false)
  const [showInversePrice, setShowInversePrice] = useState(false)

  const token0Address = getTokenAddress(pair.symbol0)
  const token1Address = getTokenAddress(pair.symbol1)
  const formattedSymbol0 = formatTokenSymbol(pair.symbol0)
  const formattedSymbol1 = formatTokenSymbol(pair.symbol1)

  // Get the appropriate price based on the toggle
  const price = showInversePrice ? pair.prices.price10 : pair.prices.price01

  // Filter pools with TVL >= $1 and sort by TVL in descending order
  const sortedPools = [...pools]
    .filter((pool) => Number(pool.tvlUSD) >= MINIMUM_POOL_TVL)
    .sort((a, b) => Number(b.tvlUSD) - Number(a.tvlUSD))

  return (
    <RowContainer isExpanded={isExpanded}>
      <Flex padding="16px" onClick={() => setIsExpanded(!isExpanded)}>
        <PairContainer alignItems="center">
          {isMobile ? (
            <MobileTokenInfo>
              <TokenSymbolsRow>
                <TokenIconsContainer>
                  {!imageError0 && token0Address && (
                    <TokenImage
                      src={`https://plunderswap.github.io/token-lists/images/${getTokenImagePath(
                        pair.symbol0,
                        token0Address,
                      )}`}
                      alt={pair.symbol0}
                      onError={() => setImageError0(true)}
                    />
                  )}
                  {(imageError0 || !token0Address) && (
                    <TokenImageFallback>{pair.symbol0.slice(0, 3)}</TokenImageFallback>
                  )}

                  {!imageError1 && token1Address && (
                    <TokenImage
                      src={`https://plunderswap.github.io/token-lists/images/${getTokenImagePath(
                        pair.symbol1,
                        token1Address,
                      )}`}
                      alt={pair.symbol1}
                      onError={() => setImageError1(true)}
                    />
                  )}
                  {(imageError1 || !token1Address) && (
                    <TokenImageFallback>{pair.symbol1.slice(0, 3)}</TokenImageFallback>
                  )}
                </TokenIconsContainer>
                <Text>
                  {formattedSymbol0}/{formattedSymbol1}
                </Text>
              </TokenSymbolsRow>
              <PriceText
                onClick={(e) => {
                  e.stopPropagation()
                  setShowInversePrice(!showInversePrice)
                }}
              >
                1 {showInversePrice ? formattedSymbol1 : formattedSymbol0} ={' '}
                {formatNumberWithDynamicDecimals(Number(price), true)}{' '}
                {showInversePrice ? formattedSymbol0 : formattedSymbol1}
                <RotateIcon width="14px" height="14px" $isRotated={showInversePrice} />
              </PriceText>
            </MobileTokenInfo>
          ) : (
            <>
              <Flex>
                {!imageError0 && token0Address && (
                  <TokenImage
                    src={`https://plunderswap.github.io/token-lists/images/${getTokenImagePath(
                      pair.symbol0,
                      token0Address,
                    )}`}
                    alt={pair.symbol0}
                    onError={() => setImageError0(true)}
                  />
                )}
                {(imageError0 || !token0Address) && <TokenImageFallback>{pair.symbol0.slice(0, 3)}</TokenImageFallback>}

                {!imageError1 && token1Address && (
                  <TokenImage
                    src={`https://plunderswap.github.io/token-lists/images/${getTokenImagePath(
                      pair.symbol1,
                      token1Address,
                    )}`}
                    alt={pair.symbol1}
                    onError={() => setImageError1(true)}
                  />
                )}
                {(imageError1 || !token1Address) && <TokenImageFallback>{pair.symbol1.slice(0, 3)}</TokenImageFallback>}
              </Flex>
              <Flex flexDirection="column">
                <Text ml="8px">
                  {formattedSymbol0}/{formattedSymbol1}
                </Text>
                <PriceText
                  ml="8px"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowInversePrice(!showInversePrice)
                  }}
                >
                  1 {showInversePrice ? formattedSymbol1 : formattedSymbol0} ={' '}
                  {formatNumberWithDynamicDecimals(Number(price), true)}{' '}
                  {showInversePrice ? formattedSymbol0 : formattedSymbol1}
                  <RotateIcon width="14px" height="14px" $isRotated={showInversePrice} />
                </PriceText>
              </Flex>
            </>
          )}
        </PairContainer>

        {!isMobile && (
          <>
            <TVLContainer justifyContent="flex-end">
              <Text>${formatNumber(Number(pair.tvlUSD))}</Text>
            </TVLContainer>
            <TVLContainer justifyContent="flex-end">
              <Text>{formatNumber(Number(pair.tvlZIL))} ZIL</Text>
            </TVLContainer>
          </>
        )}

        {isMobile && (
          <TVLContainer justifyContent="flex-end" alignItems="center">
            <Text mr="8px">${formatNumber(Number(pair.tvlUSD))}</Text>
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </TVLContainer>
        )}
        {!isMobile && (
          <Flex width="24px" justifyContent="flex-end">
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Flex>
        )}
      </Flex>

      {isExpanded && (
        <div>
          {sortedPools.map((pool) => (
            <PoolRow key={pool.address} pool={pool} isMobile={isMobile} />
          ))}
        </div>
      )}
    </RowContainer>
  )
}

export default PairRow
