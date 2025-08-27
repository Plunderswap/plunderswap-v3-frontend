import { Card, CardBody, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { LSTStats as LSTStatsType } from '../types'
import { formatPercentage } from '../utils'

interface LSTStatsProps {
  stats: LSTStatsType
  lastUpdated?: string
}

const StatsContainer = styled(Flex)`
  gap: 16px;
  margin-bottom: 24px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`

const StatCard = styled(Card)`
  flex: 1;
  min-width: 200px;
`

const StatValue = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 4px;
`

const StatLabel = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const GrowthText = styled(Text)<{ isPositive: boolean }>`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 4px;
  color: ${({ theme, isPositive }) => (isPositive ? theme.colors.success : theme.colors.failure)};
`

const BestPerformerText = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`

const BestPerformerSubtext = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
`

export const LSTStats = ({ stats, lastUpdated }: LSTStatsProps) => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      <StatsContainer>
        <StatCard>
          <CardBody>
            <StatValue>{stats.totalCount}</StatValue>
            <StatLabel>Total LSTs</StatLabel>
          </CardBody>
        </StatCard>

        <StatCard>
          <CardBody>
            <GrowthText isPositive={stats.avgGrowth500k >= 0}>
              {formatPercentage(stats.avgGrowth500k)}
            </GrowthText>
            <StatLabel>Avg Growth (500k blocks)</StatLabel>
          </CardBody>
        </StatCard>

        <StatCard>
          <CardBody>
            <GrowthText isPositive={stats.avgGrowth1M >= 0}>
              {formatPercentage(stats.avgGrowth1M)}
            </GrowthText>
            <StatLabel>Avg Growth (1M blocks)</StatLabel>
          </CardBody>
        </StatCard>

        <StatCard>
          <CardBody>
            <GrowthText isPositive={stats.avgGrowth2M >= 0}>
              {formatPercentage(stats.avgGrowth2M)}
            </GrowthText>
            <StatLabel>Avg Growth (2M blocks)</StatLabel>
          </CardBody>
        </StatCard>

        <StatCard>
          <CardBody>
            <GrowthText isPositive={stats.avgGrowth3M >= 0}>
              {formatPercentage(stats.avgGrowth3M)}
            </GrowthText>
            <StatLabel>Avg Growth (3M blocks)</StatLabel>
          </CardBody>
        </StatCard>

        {stats.bestPerformer500k && (
          <StatCard>
            <CardBody>
              <BestPerformerText>{stats.bestPerformer500k.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 500k Growth</BestPerformerSubtext>
              <GrowthText isPositive={stats.bestPerformer500k.historical.growth500k >= 0}>
                {formatPercentage(stats.bestPerformer500k.historical.growth500k)}
              </GrowthText>
            </CardBody>
          </StatCard>
        )}

        {stats.bestPerformer1M && (
          <StatCard>
            <CardBody>
              <BestPerformerText>{stats.bestPerformer1M.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 1M Growth</BestPerformerSubtext>
              <GrowthText isPositive={stats.bestPerformer1M.historical.growth1M >= 0}>
                {formatPercentage(stats.bestPerformer1M.historical.growth1M)}
              </GrowthText>
            </CardBody>
          </StatCard>
        )}

        {stats.bestPerformer2M && (
          <StatCard>
            <CardBody>
              <BestPerformerText>{stats.bestPerformer2M.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 2M Growth</BestPerformerSubtext>
              <GrowthText isPositive={stats.bestPerformer2M.historical.growth2M >= 0}>
                {formatPercentage(stats.bestPerformer2M.historical.growth2M)}
              </GrowthText>
            </CardBody>
          </StatCard>
        )}

        {stats.bestPerformer3M && (
          <StatCard>
            <CardBody>
              <BestPerformerText>{stats.bestPerformer3M.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 3M Growth</BestPerformerSubtext>
              <GrowthText isPositive={stats.bestPerformer3M.historical.growth3M >= 0}>
                {formatPercentage(stats.bestPerformer3M.historical.growth3M)}
              </GrowthText>
            </CardBody>
          </StatCard>
        )}
      </StatsContainer>
    </>
  )
} 