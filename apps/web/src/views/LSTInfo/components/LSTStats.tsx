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

const CompactStatCard = styled(Card)`
  flex: 1;
  min-width: 180px;
`

const StatValue = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 2px;
`

const StatLabel = styled(Text)`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSubtle};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const GrowthText = styled(Text)<{ isPositive: boolean }>`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 2px;
  color: ${({ theme, isPositive }) => (isPositive ? theme.colors.success : theme.colors.failure)};
`

const CompactGrowthText = styled(Text)<{ isPositive: boolean }>`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: 2px;
  color: ${({ theme, isPositive }) => (isPositive ? theme.colors.success : theme.colors.failure)};
`

const BestPerformerText = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
`

const BestPerformerSubtext = styled(Text)`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 2px;
`

export const LSTStats = ({ stats, lastUpdated }: LSTStatsProps) => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      {/* Average Growth Row */}
      <StatsContainer>
        <CompactStatCard>
          <CardBody style={{ padding: '12px 16px' }}>
            <GrowthText isPositive={stats.avgGrowth500k >= 0}>
              {formatPercentage(stats.avgGrowth500k)}
            </GrowthText>
            <StatLabel>Avg Growth (500k blocks)</StatLabel>
          </CardBody>
        </CompactStatCard>

        <CompactStatCard>
          <CardBody style={{ padding: '12px 16px' }}>
            <GrowthText isPositive={stats.avgGrowth1M >= 0}>
              {formatPercentage(stats.avgGrowth1M)}
            </GrowthText>
            <StatLabel>Avg Growth (1M blocks)</StatLabel>
          </CardBody>
        </CompactStatCard>

        <CompactStatCard>
          <CardBody style={{ padding: '12px 16px' }}>
            <GrowthText isPositive={stats.avgGrowth2M >= 0}>
              {formatPercentage(stats.avgGrowth2M)}
            </GrowthText>
            <StatLabel>Avg Growth (2M blocks)</StatLabel>
          </CardBody>
        </CompactStatCard>

        <CompactStatCard>
          <CardBody style={{ padding: '12px 16px' }}>
            <GrowthText isPositive={stats.avgGrowth3M >= 0}>
              {formatPercentage(stats.avgGrowth3M)}
            </GrowthText>
            <StatLabel>Avg Growth (3M blocks)</StatLabel>
          </CardBody>
        </CompactStatCard>
      </StatsContainer>

      {/* Best Performers Row */}
      <StatsContainer>
        {stats.bestPerformer500k && (
          <CompactStatCard>
            <CardBody style={{ padding: '10px 14px' }}>
              <BestPerformerText>{stats.bestPerformer500k.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 500k Growth</BestPerformerSubtext>
              <CompactGrowthText isPositive={stats.bestPerformer500k.historical.growth500k >= 0}>
                {formatPercentage(stats.bestPerformer500k.historical.growth500k)}
              </CompactGrowthText>
            </CardBody>
          </CompactStatCard>
        )}

        {stats.bestPerformer1M && (
          <CompactStatCard>
            <CardBody style={{ padding: '10px 14px' }}>
              <BestPerformerText>{stats.bestPerformer1M.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 1M Growth</BestPerformerSubtext>
              <CompactGrowthText isPositive={stats.bestPerformer1M.historical.growth1M >= 0}>
                {formatPercentage(stats.bestPerformer1M.historical.growth1M)}
              </CompactGrowthText>
            </CardBody>
          </CompactStatCard>
        )}

        {stats.bestPerformer2M && (
          <CompactStatCard>
            <CardBody style={{ padding: '10px 14px' }}>
              <BestPerformerText>{stats.bestPerformer2M.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 2M Growth</BestPerformerSubtext>
              <CompactGrowthText isPositive={stats.bestPerformer2M.historical.growth2M >= 0}>
                {formatPercentage(stats.bestPerformer2M.historical.growth2M)}
              </CompactGrowthText>
            </CardBody>
          </CompactStatCard>
        )}

        {stats.bestPerformer3M && (
          <CompactStatCard>
            <CardBody style={{ padding: '10px 14px' }}>
              <BestPerformerText>{stats.bestPerformer3M.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 3M Growth</BestPerformerSubtext>
              <CompactGrowthText isPositive={stats.bestPerformer3M.historical.growth3M >= 0}>
                {formatPercentage(stats.bestPerformer3M.historical.growth3M)}
              </CompactGrowthText>
            </CardBody>
          </CompactStatCard>
        )}
      </StatsContainer>
    </>
  )
} 