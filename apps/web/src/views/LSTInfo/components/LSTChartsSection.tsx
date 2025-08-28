import { Card, CardBody, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import styled from 'styled-components'
import { fetchLSTJsonPriceData } from '../api'
import { LSTJsonPriceData } from '../types'
import { LST_CONFIGS } from '../utils'

interface LSTChartsProps {
  show: boolean
}

interface ChartDataPoint {
  block: number
  timestamp: number
  [key: string]: number // For dynamic LST symbol prices
}

const ChartsContainer = styled(Card)`
  margin-bottom: 24px;
`

const ChartSection = styled.div`
  margin-bottom: 32px;
`

const ChartTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
`

const FilterContainer = styled(Flex)`
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

const FilterButtonGroup = styled(Flex)`
  gap: 8px;
  align-items: center;
`

const FilterButton = styled.button<{ isActive: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${({ theme, isActive }) => (isActive ? theme.colors.primary : theme.colors.cardBorder)};
  background: ${({ theme, isActive }) => (isActive ? theme.colors.primary : 'transparent')};
  color: ${({ theme, isActive }) => (isActive ? theme.colors.invertedContrast : theme.colors.text)};
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
  
  @media screen and (max-width: 768px) {
    padding: 4px 8px;
    font-size: 11px;
  }
`

const TooltipContainer = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const TooltipLabel = styled(Text)`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
`

const TooltipValue = styled(Text)`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSubtle};
`

// Color palette for different LST lines
const LST_COLORS = [
  '#3B82F6', // Blue - encapZIL
  '#10B981', // Green - litZIL  
  '#F59E0B', // Orange - shZIL
  '#EF4444', // Red - pZIL
  '#8B5CF6', // Purple - tZIL
  '#06B6D4', // Cyan - aZIL
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const blockNumber = label
    const timestamp = payload[0]?.payload?.timestamp
    const date = new Date(timestamp * 1000).toLocaleDateString()
    
    return (
      <TooltipContainer>
        <TooltipLabel>Block: {blockNumber?.toLocaleString()}</TooltipLabel>
        <TooltipValue>Date: {date}</TooltipValue>
        {payload.map((entry: any) => (
          <TooltipValue key={entry.dataKey} style={{ color: entry.color }}>
            {entry.dataKey}: {Number(entry.value).toFixed(8)}
          </TooltipValue>
        ))}
      </TooltipContainer>
    )
  }
  return null
}

type FilterOption = 'all' | '100k' | '500k' | '1M'

export const LSTChartsSection = ({ show }: LSTChartsProps) => {
  const [lstJsonData, setLSTJsonData] = useState<{ [symbol: string]: LSTJsonPriceData }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [filterOption, setFilterOption] = useState<FilterOption>('all')
  const { isMobile } = useMatchBreakpoints()

  const fetchAllLSTJsonData = useCallback(async () => {
    if (!show) return
    
    setIsLoading(true)
    try {
      const promises = LST_CONFIGS.map(async (config) => {
        const data = await fetchLSTJsonPriceData(config)
        return { symbol: config.symbol, data }
      })
      
      const results = await Promise.all(promises)
      const dataMap: { [symbol: string]: LSTJsonPriceData } = {}
      
      results.forEach(({ symbol, data }) => {
        if (data) {
          dataMap[symbol] = data
        }
      })
      
      setLSTJsonData(dataMap)
    } catch (error) {
      console.error('Failed to fetch LST JSON data for charts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [show])

  useEffect(() => {
    fetchAllLSTJsonData()
  }, [fetchAllLSTJsonData])

     const chartData = useMemo(() => {
     const symbols = Object.keys(lstJsonData)
     if (symbols.length === 0) return []

     // For each LST, create sorted price data and calculate changes
     const lstSortedData: { [symbol: string]: Array<{ block: number, price: number, timestamp: number }> } = {}
     
     symbols.forEach(symbol => {
       lstSortedData[symbol] = lstJsonData[symbol].prices
         .map(entry => ({
           block: entry.block,
           price: parseFloat(entry.price),
           timestamp: entry.timestamp
         }))
         .sort((a, b) => a.block - b.block)
     })

     // Collect all unique block numbers, but we'll only chart changes (skip first block for each LST)
     const allBlocks = new Set<number>()
     symbols.forEach(symbol => {
       const data = lstSortedData[symbol]
       // Skip the first entry since we can't calculate change for it
       for (let i = 1; i < data.length; i++) {
         allBlocks.add(data[i].block)
       }
     })

     const sortedBlocks = Array.from(allBlocks).sort((a, b) => a - b)

     // Create chart data points with price changes
     const data: ChartDataPoint[] = sortedBlocks.map(block => {
       const dataPoint: ChartDataPoint = { block, timestamp: 0 }
       
       symbols.forEach(symbol => {
         const lstData = lstSortedData[symbol]
         const currentIndex = lstData.findIndex(p => p.block === block)
         
         if (currentIndex > 0) {
           const currentPrice = lstData[currentIndex].price
           const previousPrice = lstData[currentIndex - 1].price
           const priceChange = currentPrice - previousPrice
           
           dataPoint[symbol] = priceChange
           dataPoint.timestamp = lstData[currentIndex].timestamp
         } else {
           // Find closest entries for change calculation
           const currentEntry = lstData.reduce((closest, current) => {
             return Math.abs(current.block - block) < Math.abs(closest.block - block) ? current : closest
           })
           const currentIdx = lstData.indexOf(currentEntry)
           
           if (currentIdx > 0) {
             const previousEntry = lstData[currentIdx - 1]
             const priceChange = currentEntry.price - previousEntry.price
             dataPoint[symbol] = priceChange
             dataPoint.timestamp = currentEntry.timestamp
           }
         }
       })
       
       return dataPoint
     })

     // Filter out data points where no symbols have valid changes
     return data.filter(point => symbols.some(symbol => point[symbol] !== undefined))
   }, [lstJsonData])

  const filteredChartData = useMemo(() => {
    if (filterOption === 'all' || chartData.length === 0) return chartData
    
    const maxBlock = Math.max(...chartData.map(d => d.block))
    let blocksAgo: number
    
    switch (filterOption) {
      case '100k':
        blocksAgo = maxBlock - 100000
        break
      case '500k':
        blocksAgo = maxBlock - 500000
        break
      case '1M':
        blocksAgo = maxBlock - 1000000
        break
      default:
        return chartData
    }
    
    return chartData.filter(d => d.block >= blocksAgo)
  }, [chartData, filterOption])

  const symbols = Object.keys(lstJsonData)

  // Calculate dynamic Y-axis domain based on change data (always positive or zero)
  const yAxisDomain = useMemo(() => {
    if (filteredChartData.length === 0) return [0, 0.001]
    
    let maxChange = 0
    
    filteredChartData.forEach(dataPoint => {
      symbols.forEach(symbol => {
        const change = dataPoint[symbol]
        if (change !== undefined && !Number.isNaN(change) && change >= 0) {
          maxChange = Math.max(maxChange, change)
        }
      })
    })
    
    // Default range if no valid data
    if (maxChange === 0) {
      return [0, 0.001]
    }
    
    // Add padding (10%) to the top for better visualization
    const padding = maxChange * 0.1
    const dataMax = maxChange + padding
    
    return [0, dataMax]
  }, [filteredChartData, symbols])

  if (!show) return null

  return (
    <ChartsContainer>
      <CardBody style={{ padding: '24px' }}>
        <ChartTitle>LST Price Changes (Block-to-Block)</ChartTitle>
        
        <FilterContainer>
          <Text fontSize="14px" mr="8px">Show blocks:</Text>
          <FilterButtonGroup>
            <FilterButton 
              isActive={filterOption === 'all'} 
              onClick={() => setFilterOption('all')}
            >
              All
            </FilterButton>
            <FilterButton 
              isActive={filterOption === '100k'} 
              onClick={() => setFilterOption('100k')}
            >
              Latest 100k
            </FilterButton>
            <FilterButton 
              isActive={filterOption === '500k'} 
              onClick={() => setFilterOption('500k')}
            >
              Latest 500k
            </FilterButton>
            <FilterButton 
              isActive={filterOption === '1M'} 
              onClick={() => setFilterOption('1M')}
            >
              Latest 1M
            </FilterButton>
          </FilterButtonGroup>
        </FilterContainer>

        {isLoading && (
          <Flex justifyContent="center" alignItems="center" height="400px">
            <Text>Loading chart data...</Text>
          </Flex>
        )}

        {!isLoading && filteredChartData.length > 0 && (
          <ChartSection>
            <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
              <LineChart data={filteredChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="block"
                  type="number"
                  scale="linear"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                  fontSize={12}
                />
                <YAxis 
                  domain={yAxisDomain}
                  tickFormatter={(value) => {
                    if (value < 0.0001) {
                      return value.toExponential(2)
                    }
                    return value.toFixed(8)
                  }}
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" opacity={0.6} />
                
                {symbols.map((symbol, index) => (
                  <Line
                    key={symbol}
                    type="monotone"
                    dataKey={symbol}
                    stroke={LST_COLORS[index % LST_COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartSection>
        )}

        {!isLoading && filteredChartData.length === 0 && (
          <Flex justifyContent="center" alignItems="center" height="200px">
            <Text color="textSubtle">No chart data available</Text>
          </Flex>
        )}

        <Text fontSize="12px" color="textSubtle" textAlign="center" mt="12px">
          {(() => {
            switch (filterOption) {
              case '100k':
                return `Showing price changes for the latest ~100k blocks (${filteredChartData.length} data points)`
              case '500k':
                return `Showing price changes for the latest ~500k blocks (${filteredChartData.length} data points)`
              case '1M':
                return `Showing price changes for the latest ~1M blocks (${filteredChartData.length} data points)`
              default:
                return `Showing all historical price changes (${chartData.length} data points)`
            }
          })()}
          <br />
          Each point represents the change from the previous block interval (~10k blocks)
        </Text>
      </CardBody>
    </ChartsContainer>
  )
}
