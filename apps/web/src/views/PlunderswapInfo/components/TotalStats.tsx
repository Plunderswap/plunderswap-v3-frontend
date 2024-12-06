import { Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { PairData } from '../types'
import { formatNumber } from '../utils'

const StatsContainer = styled(Flex)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  width: 100%;
  flex-wrap: wrap;
  gap: 8px;

  @media screen and (max-width: 480px) {
    padding: 12px;
    flex-direction: column;
  }
`

const StatBox = styled(Flex)`
  flex-direction: column;
  flex: 1;
  min-width: 200px;
  padding: 8px 16px;

  @media screen and (max-width: 480px) {
    padding: 4px 8px;
    min-width: unset;
  }
`

interface TotalStatsProps {
  pairs: PairData[]
}

const TotalStats: React.FC<TotalStatsProps> = ({ pairs }) => {
  const { isXs } = useMatchBreakpoints()
  const totalTVL = pairs.reduce((sum, pair) => sum + Number(pair.tvlUSD), 0)
  const totalVolume24h = pairs.reduce((sum, pair) => sum + Number(pair.volume_usd_24h), 0)
  const totalVolume7d = pairs.reduce((sum, pair) => sum + Number(pair.volume_usd_7d), 0)

  return (
    <StatsContainer>
      {isXs ? (
        <>
          <Flex width="100%" justifyContent="space-between">
            <StatBox>
              <Text color="textSubtle">24h Volume</Text>
              <Text bold fontSize="24px">
                ${formatNumber(totalVolume24h)}
              </Text>
            </StatBox>
            <StatBox alignItems="flex-end">
              <Text color="textSubtle">Total Value Locked</Text>
              <Text bold fontSize="24px">
                ${formatNumber(totalTVL)}
              </Text>
            </StatBox>
          </Flex>
          <StatBox>
            <Text color="textSubtle">7d Volume</Text>
            <Text bold fontSize="24px">
              ${formatNumber(totalVolume7d)}
            </Text>
          </StatBox>
        </>
      ) : (
        <>
          <StatBox>
            <Text color="textSubtle">Total Value Locked</Text>
            <Text bold fontSize="24px">
              ${formatNumber(totalTVL)}
            </Text>
          </StatBox>
          <StatBox>
            <Text color="textSubtle">24h Volume</Text>
            <Text bold fontSize="24px">
              ${formatNumber(totalVolume24h)}
            </Text>
          </StatBox>
          <StatBox>
            <Text color="textSubtle">7d Volume</Text>
            <Text bold fontSize="24px">
              ${formatNumber(totalVolume7d)}
            </Text>
          </StatBox>
        </>
      )}
    </StatsContainer>
  )
}

export default TotalStats
