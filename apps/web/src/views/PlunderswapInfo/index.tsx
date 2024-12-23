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
import {
  getStoredHideSmallPools,
  getStoredShow24hData,
  orderPairData,
  setStoredHideSmallPools,
  setStoredShow24hData,
} from './utils'

type SortField = 'tvl' | 'volume' | 'apr' | 'pair' | null
type SortDirection = 'asc' | 'desc'

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`

const TableHeader = styled(Flex)`
  padding: 16px 40px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 16px 16px 0 0;
`

const ToggleWrapper = styled(Flex)`
  align-items: center;
  position: relative;

  &:first-child {
    margin-right: 64px;
  }

  &:hover > div:last-child {
    visibility: visible;
    opacity: 1;
  }

  ${Text} {
    @media screen and (max-width: 852px) {
      font-size: 12px;
    }
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

const MobileHeaderStats = styled(Flex)`
  flex-direction: column;
  align-items: flex-end;
  margin-right: 90px;
`

const MobileHeaderContainer = styled(Flex)`
  flex: 1.4;
  justify-content: flex-end;
  gap: 8px;
`

const VolumeAPRText = styled(Text)`
  text-align: right;
  width: 120px;
  margin: 0 4px;
  justify-content: flex-end;
  display: flex;
  cursor: pointer;
  font-size: 13px;

  @media screen and (max-width: 852px) {
    font-size: 16px;
    width: 130px;
  }

  &:hover {
    opacity: 0.8;
  }
`

const TVLText = styled(Text)`
  text-align: right;
  width: 50px;
  justify-content: flex-end;
  display: flex;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`

const HeaderContainer = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
  gap: 24px;
  padding-right: 56px;

  @media screen and (max-width: 852px) {
    padding-right: 32px;
  }
`
const PairContainer = styled(Flex)`
  flex: 1.5;
  @media screen and (max-width: 852px) {
    flex: 2;
  }
`

const HeaderText = styled(Text)`
  width: 100px;
  text-align: right;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  @media screen and (max-width: 852px) {
    width: auto;
    font-size: 14px;
  }
`

export const PlunderswapInfo = () => {
  const [pairs, setPairs] = useState<PairData[]>([])
  const [pools, setPools] = useState<PoolData[]>([])
  const [hideSmallPools, setHideSmallPools] = useState(getStoredHideSmallPools())
  const [show24hData, setShow24hData] = useState(getStoredShow24hData())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const { isMobile, isXs } = useMatchBreakpoints()
  const theme = useTheme()
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

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

      // Filter, order, and sort pairs
      const nonZeroPairs = pairData
        .filter((pair) => Number(pair.tvlUSD) >= MINIMUM_TVL_FILTER)
        .map(orderPairData) // Apply ordering logic
        .sort((a, b) => {
          const tvlA = Number(a.tvlUSD)
          const tvlB = Number(b.tvlUSD)
          return tvlB - tvlA
        })

      setPairs(nonZeroPairs)
      setPools(poolData)
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

  const handleHideSmallPoolsChange = (newValue: boolean) => {
    setHideSmallPools(newValue)
    setStoredHideSmallPools(newValue)
  }

  const handleShow24hDataChange = (newValue: boolean) => {
    setShow24hData(newValue)
    setStoredShow24hData(newValue)
  }

  const sortedPairs = useMemo(() => {
    const filtered = hideSmallPools ? pairs.filter((pair) => Number(pair.tvlUSD) >= MIN_TVL) : pairs

    if (!sortField) return filtered

    return [...filtered].sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      switch (sortField) {
        case 'pair':
          aValue = `${a.symbol0}/${a.symbol1}`
          bValue = `${b.symbol0}/${b.symbol1}`
          return sortDirection === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue)
        case 'tvl':
          aValue = Number(a.tvlUSD)
          bValue = Number(b.tvlUSD)
          break
        case 'volume':
          aValue = show24hData ? Number(a.volume_usd_24h) : Number(a.volume_usd_7d)
          bValue = show24hData ? Number(b.volume_usd_24h) : Number(b.volume_usd_7d)
          break
        case 'apr':
          aValue = show24hData ? Number(a.apr_24h_max) : Number(a.apr_7d_max)
          bValue = show24hData ? Number(b.apr_24h_max) : Number(b.apr_7d_max)
          break
        default:
          return 0
      }

      return sortDirection === 'desc' ? bValue - aValue : aValue - bValue
    })
  }, [pairs, hideSmallPools, sortField, sortDirection, show24hData])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

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
          <Text mr="8px">Show 24h Data</Text>
          <Toggle checked={show24hData} onChange={() => handleShow24hDataChange(!show24hData)} scale="sm" />
        </ToggleWrapper>
        <ToggleWrapper>
          <Text mr="8px">Hide Small Pools</Text>
          <Toggle checked={hideSmallPools} onChange={() => handleHideSmallPoolsChange(!hideSmallPools)} scale="sm" />
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
            <PairContainer>
              <Text onClick={() => handleSort('pair')} style={{ cursor: 'pointer' }}>
                Pair/Price {sortField === 'pair' && (sortDirection === 'desc' ? '↓' : '↑')}
              </Text>
            </PairContainer>
            {isMobile ? (
              <MobileHeaderContainer>
                <VolumeAPRText onClick={() => handleSort('apr')}>
                  Vol/APR ({show24hData ? '24h' : '7d'}) {sortField === 'apr' && (sortDirection === 'desc' ? '↓' : '↑')}
                </VolumeAPRText>
                <TVLText onClick={() => handleSort('tvl')}>
                  TVL {sortField === 'tvl' && (sortDirection === 'desc' ? '↓' : '↑')}
                </TVLText>
              </MobileHeaderContainer>
            ) : (
              <HeaderContainer>
                <HeaderText onClick={() => handleSort('tvl')}>
                  TVL {sortField === 'tvl' && (sortDirection === 'desc' ? '↓' : '↑')}
                </HeaderText>
                <HeaderText onClick={() => handleSort('volume')}>
                  Volume ({show24hData ? '24h' : '7d'}){' '}
                  {sortField === 'volume' && (sortDirection === 'desc' ? '↓' : '↑')}
                </HeaderText>
                <HeaderText onClick={() => handleSort('apr')}>
                  APR ({show24hData ? '24h' : '7d'}) {sortField === 'apr' && (sortDirection === 'desc' ? '↓' : '↑')}
                </HeaderText>
              </HeaderContainer>
            )}
          </TableHeader>
          {sortedPairs.map((pair) => (
            <PairRow
              key={`${pair.symbol0}-${pair.symbol1}`}
              pair={pair}
              pools={pools.filter((pool) => pair.pools.includes(pool.address))}
              isMobile={isMobile}
              show24hData={show24hData}
            />
          ))}
        </>
      )}

      <Text fontSize="12px" color="textSubtle" mt="16px" textAlign="center">
        * APR for V3 pools assumes full range liquidity. Concentrated liquidity positions may earn significantly higher
        APR, while full range positions may earn less when there is high concentration of liquidity.
      </Text>
    </Container>
  )
}
