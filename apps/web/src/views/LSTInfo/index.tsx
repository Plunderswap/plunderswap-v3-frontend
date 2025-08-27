import { useTheme } from '@pancakeswap/hooks'
import { Button, Flex, Text, Toggle, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { fetchAllLSTData } from './api'
import { ErrorState } from './components/ErrorState'
import { LoadingState } from './components/LoadingState'
import { LSTRow } from './components/LSTRow'
import { LSTStats } from './components/LSTStats'
import { LSTData } from './types'
import {
    calculateLSTStats,
    formatTimeAgo,
    getStoredPriceDirection,
    getStoredShowHistorical,
    getStoredSortPreference,
    setStoredPriceDirection,
    setStoredShowHistorical,
    setStoredSortPreference,
    sortLSTData
} from './utils'

type SortField = 'symbol' | 'price' | 'growth10k' | 'growth100k' | 'growth500k' | 'growth1M' | 'tradingVolume' | null
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
    
    @media screen and (max-width: 852px) {
      margin-right: 16px;
    }
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

const HeaderContainer = styled(Flex)`
  flex: 1;
  align-items: center;
`

const HeaderText = styled(Text)`
  flex: 1;
  text-align: right;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  @media screen and (max-width: 852px) {
    font-size: 14px;
  }
`

const HeaderTokenColumn = styled(Text)`
  flex: 1.5;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  @media screen and (max-width: 852px) {
    font-size: 14px;
    flex: 2;
  }
`

const TokenContainer = styled(Flex)`
  flex: 1.5;
  @media screen and (max-width: 852px) {
    flex: 2;
  }
`

const MobileHeaderContainer = styled(Flex)`
  flex: 1.4;
  justify-content: flex-end;
  gap: 8px;
`

const RefreshButton = styled(Button)`
  margin-left: 16px;
`

export const LSTInfo = () => {
  const [lstData, setLSTData] = useState<LSTData[]>([])
  const [showHistorical, setShowHistorical] = useState(getStoredShowHistorical())
  const [priceDirection, setPriceDirection] = useState<'zil-to-lst' | 'lst-to-zil'>(getStoredPriceDirection())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const { isMobile } = useMatchBreakpoints()
  const theme = useTheme()
  const [sortField, setSortField] = useState<SortField>(getStoredSortPreference() as SortField)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(false)

      const data = await fetchAllLSTData()

      if (!data?.length) {
        setError(true)
        return
      }

      setLSTData(data)
      setLastUpdated(new Date().toISOString())
    } catch (err) {
      console.error('Error fetching LST data:', err)
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // No auto refresh - user can manually refresh if needed
  }, [fetchData])

  const handleShowHistoricalChange = useCallback((newValue: boolean) => {
    setShowHistorical(newValue)
    setStoredShowHistorical(newValue)
  }, [])

  const handlePriceDirectionChange = useCallback(() => {
    const newDirection = priceDirection === 'zil-to-lst' ? 'lst-to-zil' : 'zil-to-lst'
    setPriceDirection(newDirection)
    setStoredPriceDirection(newDirection)
  }, [priceDirection])

  const sortedLSTData = useMemo(() => {
    if (!sortField) return lstData

    const sorted = sortLSTData(lstData, sortField, sortDirection)
    return sorted
  }, [lstData, sortField, sortDirection])

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
    } else {
      setSortField(field)
      setSortDirection('desc')
      if (field) {
        setStoredSortPreference(field)
      }
    }
  }, [sortField, sortDirection])

  const stats = useMemo(() => calculateLSTStats(lstData), [lstData])

  if (error) {
    return <ErrorState onRetry={fetchData} />
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <Container>
      <Flex flexDirection="column" mb="16px">
        <Flex justifyContent="space-between" alignItems="center" mb="8px">
          <Text bold fontSize="24px">
            Liquid Staking Tokens (LSTs)
          </Text>
          <RefreshButton variant="text" onClick={fetchData} disabled={isLoading}>
            Refresh
          </RefreshButton>
        </Flex>
        <Flex flexDirection="column">
          <Text fontSize="12px" color="textSubtle">
            LST prices are fetched from proxy contracts. Trading data is updated on each refresh.
          </Text>
          {lastUpdated && (
            <Text fontSize="11px" color="textSubtle" mt="4px">
              Last updated: {formatTimeAgo(lastUpdated)}
            </Text>
          )}
        </Flex>
      </Flex>

      <LSTStats stats={stats} lastUpdated={lastUpdated || undefined} />

      <Flex justifyContent="flex-end" mb="16px" style={{ gap: isMobile ? '8px' : '24px' }}>
        <ToggleWrapper>
          <Text mr="8px" style={{ whiteSpace: 'nowrap' }}>
            Price Direction
          </Text>
          <Button 
            variant="tertiary" 
            size="sm" 
            onClick={handlePriceDirectionChange}
            style={{ minWidth: 'auto', padding: '4px 8px', fontSize: '12px' }}
          >
            {priceDirection === 'zil-to-lst' ? 'ZIL → LST' : 'LST → ZIL'}
          </Button>
        </ToggleWrapper>
        {!isMobile && (
          <ToggleWrapper>
            <Text mr="8px">Show Historical Data</Text>
            <Toggle 
              checked={showHistorical} 
              onChange={() => handleShowHistoricalChange(!showHistorical)} 
              scale="sm" 
            />
            <Tooltip>Shows growth over 10k, 100k, 500k and 1M blocks</Tooltip>
          </ToggleWrapper>
        )}
      </Flex>

      {lstData.length === 0 ? (
        <Flex justifyContent="center" alignItems="center" padding="24px">
          <Text>No LST data found</Text>
        </Flex>
      ) : (
        <>
          <TableHeader>
            {isMobile ? (
              <>
                <TokenContainer>
                  <Text onClick={() => handleSort('symbol')} style={{ cursor: 'pointer' }}>
                    Token {sortField === 'symbol' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </Text>
                </TokenContainer>
                <MobileHeaderContainer>
                  <Text fontSize="13px">Price</Text>
                </MobileHeaderContainer>
              </>
            ) : (
              <>
                <HeaderTokenColumn onClick={() => handleSort('symbol')}>
                  Token {sortField === 'symbol' && (sortDirection === 'desc' ? '↓' : '↑')}
                </HeaderTokenColumn>
                
                <HeaderText onClick={() => handleSort('price')}>
                  Proxy Price {sortField === 'price' && (sortDirection === 'desc' ? '↓' : '↑')}
                </HeaderText>
                
                <HeaderText>
                  Swap Price
                </HeaderText>
                
                <HeaderText style={{ textAlign: 'center' }}>
                  Trade
                </HeaderText>
                
                {showHistorical && (
                  <>
                    <HeaderText onClick={() => handleSort('growth10k')}>
                      10k Growth {sortField === 'growth10k' && (sortDirection === 'desc' ? '↓' : '↑')}
                    </HeaderText>
                    <HeaderText onClick={() => handleSort('growth100k')}>
                      100k Growth {sortField === 'growth100k' && (sortDirection === 'desc' ? '↓' : '↑')}
                    </HeaderText>
                    <HeaderText onClick={() => handleSort('growth500k')}>
                      500k Growth {sortField === 'growth500k' && (sortDirection === 'desc' ? '↓' : '↑')}
                    </HeaderText>
                    <HeaderText onClick={() => handleSort('growth1M')}>
                      1M Growth {sortField === 'growth1M' && (sortDirection === 'desc' ? '↓' : '↑')}
                    </HeaderText>
                  </>
                )}
              </>
            )}
          </TableHeader>
          
          {sortedLSTData.map((lst) => (
            <LSTRow
              key={lst.config.symbol}
              lst={lst}
              showHistorical={showHistorical}
              priceDirection={priceDirection}
            />
          ))}
        </>
      )}

      <Text fontSize="12px" color="textSubtle" mt="16px" textAlign="center">
        * LST prices are obtained from proxy contracts using the getPrice() function.
        <br />
        * Historical growth is calculated comparing current prices to prices 10k, 100k, 500k and 1M blocks ago.
        <br />
        * Swap prices show arbitrage opportunities between proxy rates and PlunderSwap pairs.
        <br />
        * Click token logos to add to wallet via EIP-747.
      </Text>
    </Container>
  )
} 