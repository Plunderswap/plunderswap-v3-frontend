import { ChevronDownIcon, ChevronUpIcon, Flex, SwapVertIcon, Text } from '@pancakeswap/uikit'
import { useState } from 'react'
import styled from 'styled-components'
import { PairData, PoolData } from '../types'
import {
  formatNumber,
  formatNumberWithDynamicDecimals,
  formatTokenSymbol,
  getTokenAddress,
  getTokenImagePath,
} from '../utils'
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

const RotateIcon = styled(SwapVertIcon)<{ $isRotated: boolean }>`
  transition: transform 0.2s;
  transform: ${({ $isRotated }) => ($isRotated ? 'rotate(180deg)' : 'rotate(0)')};
`

const MobileRow = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
`

const MobilePairInfo = styled(Flex)`
  flex-direction: column;
  gap: 2px;
  flex: 1;
`

const MobileTokenRow = styled(Flex)`
  align-items: center;
  gap: 4px;
`

const MobileAPR = styled(Text)`
  text-align: right;
  white-space: nowrap;
  margin: 0 24px;
  color: ${({ theme }) => theme.colors.text};
`

const MobileTVL = styled(Text)`
  text-align: right;
  white-space: nowrap;
  width: 60px; // Fixed width for alignment
`

const PairContainer = styled(Flex)`
  flex: 1.5;
  @media screen and (max-width: 852px) {
    flex: 2;
  }
`

const StatsContainer = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
  gap: 24px;
  padding-right: 56px;

  @media screen and (max-width: 852px) {
    padding-right: 32px;
    gap: 16px;
  }
`

const StatValue = styled(Text)`
  width: 100px;
  text-align: right;
  white-space: nowrap;

  @media screen and (max-width: 852px) {
    width: auto;
    min-width: 80px;
    font-size: 14px;
    &:last-child {
      min-width: 100px;
    }
  }
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
      <Flex padding={isMobile ? '16px' : '8px 16px'} onClick={() => setIsExpanded(!isExpanded)} flexDirection="column">
        {isMobile ? (
          <MobileRow>
            <MobilePairInfo>
              <MobileTokenRow>
                <TokenImage
                  src={`https://plunderswap.github.io/token-lists/images/${getTokenImagePath(
                    pair.symbol0,
                    token0Address,
                  )}`}
                  alt={pair.symbol0}
                  onError={() => setImageError0(true)}
                />
                <TokenImage
                  src={`https://plunderswap.github.io/token-lists/images/${getTokenImagePath(
                    pair.symbol1,
                    token1Address,
                  )}`}
                  alt={pair.symbol1}
                  onError={() => setImageError1(true)}
                />
                <Text fontSize="14px">
                  {formattedSymbol0}/{formattedSymbol1}
                </Text>
              </MobileTokenRow>
              <PriceText
                fontSize="12px"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowInversePrice(!showInversePrice)
                }}
              >
                1 {showInversePrice ? formattedSymbol1 : formattedSymbol0} ={' '}
                {formatNumberWithDynamicDecimals(Number(price), true)}{' '}
                {showInversePrice ? formattedSymbol0 : formattedSymbol1}
                <RotateIcon width="12px" height="12px" $isRotated={showInversePrice} />
              </PriceText>
            </MobilePairInfo>
            <Flex alignItems="center">
              <MobileAPR>
                {Math.abs(Number(pair.apr_7d_max) - Number(pair.apr_7d_min)) > 1
                  ? `${pair.apr_7d_max}%`
                  : `${pair.apr_7d_max}%`}
              </MobileAPR>
              <MobileTVL bold>${formatNumber(Number(pair.tvlUSD))}</MobileTVL>
            </Flex>
          </MobileRow>
        ) : (
          <Flex width="100%">
            <PairContainer alignItems="center">
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
            </PairContainer>

            <StatsContainer>
              <StatValue>${formatNumber(Number(pair.tvlUSD))}</StatValue>
              <StatValue>${formatNumber(Number(pair.volume_usd_7d))}</StatValue>
              <StatValue>
                {Math.abs(Number(pair.apr_7d_max) - Number(pair.apr_7d_min)) > 1
                  ? `${pair.apr_7d_min}-${pair.apr_7d_max}%`
                  : `${pair.apr_7d_max}%`}
              </StatValue>
            </StatsContainer>

            <Flex width="24px" justifyContent="center">
              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Flex>
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
