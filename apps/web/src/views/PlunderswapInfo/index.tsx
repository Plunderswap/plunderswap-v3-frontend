import { useTheme } from '@pancakeswap/hooks'
import { Flex, Text, Toggle, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { fetchPairData, fetchPoolAddresses, fetchPoolData } from './api'
import ErrorState from './components/ErrorState'
import LoadingState from './components/LoadingState'
import PairRow from './components/PairRow'
import TotalStats from './components/TotalStats'
import { PairData, PoolData } from './types'

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`

const TableHeader = styled(Flex)`
  padding: 16px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 16px 16px 0 0;
`

const ToggleWrapper = styled(Flex)`
  align-items: center;
  position: relative;

  &:hover > div:last-child {
    visibility: visible;
    opacity: 1;
  }
`

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  white-space: nowrap;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.2s;
  z-index: 100;
  margin-bottom: 4px;
`

const MIN_TVL = 50
const MINIMUM_TVL_FILTER = 0.01 // $0.01 minimum TVL

const HeaderPairContainer = styled(Flex)`
  flex: 1.5;
  @media screen and (max-width: 852px) {
    flex: 2;
  }
`

const HeaderTVLContainer = styled(Flex)`
  flex: 1;
  @media screen and (max-width: 852px) {
    flex: 1.2;
  }
`

export const PlunderswapInfo = () => {
  const [pairs, setPairs] = useState<PairData[]>([])
  const [pools, setPools] = useState<PoolData[]>([])
  const [hideSmallPools, setHideSmallPools] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const { isMobile } = useMatchBreakpoints()
  const theme = useTheme()

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(false)

      const [pairData, poolData, poolAddresses] = await Promise.all([
        fetchPairData(),
        fetchPoolData(),
        fetchPoolAddresses(),
      ])

      if (!pairData?.length && !poolData?.length) {
        setError(true)
        return
      }

      // Filter and sort pairs by TVL
      const nonZeroPairs = pairData
        .filter((pair) => Number(pair.tvlUSD) >= MINIMUM_TVL_FILTER)
        .sort((a, b) => {
          const tvlA = Number(a.tvlUSD)
          const tvlB = Number(b.tvlUSD)
          return tvlB - tvlA // Sort in descending order (highest TVL first)
        })

      // Filter and sort pools by TVL
      const nonZeroPools = poolData
        .filter((pool) => Number(pool.tvlUSD) >= MINIMUM_TVL_FILTER)
        .sort((a, b) => {
          const tvlA = Number(a.tvlUSD)
          const tvlB = Number(b.tvlUSD)
          return tvlB - tvlA // Sort in descending order (highest TVL first)
        })

      setPairs(nonZeroPairs)
      setPools(nonZeroPools)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredPairs = useMemo(() => {
    return hideSmallPools ? pairs.filter((pair) => Number(pair.tvlUSD) >= MIN_TVL) : pairs
  }, [pairs, hideSmallPools])

  if (error) {
    return <ErrorState onRetry={fetchData} />
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <Container>
      <Flex flexDirection="column" mb="16px">
        <Text bold fontSize="24px">
          Pairs & Pools
        </Text>
        <Text fontSize="12px" color="textSubtle">
          Data refreshes every 5 minutes
        </Text>
      </Flex>

      <TotalStats pairs={pairs} />

      <Flex justifyContent="flex-end" mb="16px">
        <ToggleWrapper>
          <Text mr="8px">Hide Small Pools</Text>
          <Toggle checked={hideSmallPools} onChange={() => setHideSmallPools(!hideSmallPools)} scale="sm" />
          <Tooltip>Hiding pools that are less than $50 USD TVL</Tooltip>
        </ToggleWrapper>
      </Flex>

      {pairs.length === 0 ? (
        <Flex justifyContent="center" alignItems="center" padding="24px">
          <Text>No pairs found</Text>
        </Flex>
      ) : (
        <>
          <TableHeader>
            <HeaderPairContainer>
              <Text>Pair</Text>
            </HeaderPairContainer>
            {!isMobile && (
              <>
                <HeaderTVLContainer justifyContent="flex-end">
                  <Text>Liquidity (USD)</Text>
                </HeaderTVLContainer>
                <HeaderTVLContainer justifyContent="flex-end">
                  <Text>Liquidity (ZIL)</Text>
                </HeaderTVLContainer>
              </>
            )}
          </TableHeader>

          {filteredPairs.map((pair) => (
            <PairRow
              key={`${pair.symbol0}-${pair.symbol1}`}
              pair={pair}
              pools={pools.filter((pool) => pair.pools.includes(pool.address))}
              isMobile={isMobile}
            />
          ))}
        </>
      )}
    </Container>
  )
}
