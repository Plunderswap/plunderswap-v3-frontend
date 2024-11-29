import { Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { PairData } from '../types'
import { formatNumber } from '../utils'

const StatsContainer = styled(Flex)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`

const StatBox = styled(Flex)`
  flex-direction: column;
  padding: 8px 16px;
  min-width: 200px;
`

interface TotalStatsProps {
  pairs: PairData[]
}

const TotalStats: React.FC<TotalStatsProps> = ({ pairs }) => {
  const totalTVL = pairs.reduce((sum, pair) => sum + Number(pair.tvlUSD), 0)
  const totalZIL = pairs.reduce((sum, pair) => sum + Number(pair.tvlZIL), 0)

  return (
    <StatsContainer justifyContent="space-between">
      <StatBox>
        <Text color="textSubtle">Total Value Locked (USD)</Text>
        <Text bold fontSize="24px">
          ${formatNumber(totalTVL)}
        </Text>
      </StatBox>
      <StatBox>
        <Text color="textSubtle">Total Value Locked (ZIL)</Text>
        <Text bold fontSize="24px">
          {formatNumber(totalZIL)} ZIL
        </Text>
      </StatBox>
    </StatsContainer>
  )
}

export default TotalStats
