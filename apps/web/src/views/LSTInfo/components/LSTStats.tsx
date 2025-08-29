import { Card, CardBody, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { LSTStats as LSTStatsType } from '../types'
import { formatRawChange } from '../utils'

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
      {/* Average Change Row */}
      <StatsContainer>
        {stats.avgChange10k !== undefined && (
          <CompactStatCard>
            <CardBody style={{ padding: '12px 16px' }}>
              <GrowthText isPositive={stats.avgChange10k >= 0}>
                {formatRawChange(stats.avgChange10k, 8)}
              </GrowthText>
              <StatLabel>Avg Change (10k blocks)</StatLabel>
            </CardBody>
          </CompactStatCard>
        )}

        {stats.avgChange100k !== undefined && (
          <CompactStatCard>
            <CardBody style={{ padding: '12px 16px' }}>
              <GrowthText isPositive={stats.avgChange100k >= 0}>
                {formatRawChange(stats.avgChange100k, 8)}
              </GrowthText>
              <StatLabel>Avg Change (100k blocks)</StatLabel>
            </CardBody>
          </CompactStatCard>
        )}

        <CompactStatCard>
          <CardBody style={{ padding: '12px 16px' }}>
            <GrowthText isPositive={stats.avgChange500k >= 0}>
              {formatRawChange(stats.avgChange500k, 8)}
            </GrowthText>
            <StatLabel>Avg Change (500k blocks)</StatLabel>
          </CardBody>
        </CompactStatCard>

        <CompactStatCard>
          <CardBody style={{ padding: '12px 16px' }}>
            <GrowthText isPositive={stats.avgChange1M >= 0}>
              {formatRawChange(stats.avgChange1M, 8)}
            </GrowthText>
            <StatLabel>Avg Change (1M blocks)</StatLabel>
          </CardBody>
        </CompactStatCard>

        <CompactStatCard>
          <CardBody style={{ padding: '12px 16px' }}>
            <GrowthText isPositive={stats.avgChange2M >= 0}>
              {formatRawChange(stats.avgChange2M, 8)}
            </GrowthText>
            <StatLabel>Avg Change (2M blocks)</StatLabel>
          </CardBody>
        </CompactStatCard>

        <CompactStatCard>
          <CardBody style={{ padding: '12px 16px' }}>
            <GrowthText isPositive={stats.avgChange3M >= 0}>
              {formatRawChange(stats.avgChange3M, 8)}
            </GrowthText>
            <StatLabel>Avg Change (3M blocks)</StatLabel>
          </CardBody>
        </CompactStatCard>
      </StatsContainer>

      {/* Best Performers Row */}
      <StatsContainer>
        {stats.bestPerformer10k && (
          <CompactStatCard>
            <CardBody style={{ padding: '10px 14px' }}>
              <BestPerformerText>{stats.bestPerformer10k.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 10k Change</BestPerformerSubtext>
              <CompactGrowthText isPositive={(stats.bestPerformer10k.historical.change10k ?? 0) >= 0}>
                {formatRawChange(stats.bestPerformer10k.historical.change10k ?? 0, 8)}
              </CompactGrowthText>
            </CardBody>
          </CompactStatCard>
        )}

        {stats.bestPerformer100k && (
          <CompactStatCard>
            <CardBody style={{ padding: '10px 14px' }}>
              <BestPerformerText>{stats.bestPerformer100k.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 100k Change</BestPerformerSubtext>
              <CompactGrowthText isPositive={(stats.bestPerformer100k.historical.change100k ?? 0) >= 0}>
                {formatRawChange(stats.bestPerformer100k.historical.change100k ?? 0, 8)}
              </CompactGrowthText>
            </CardBody>
          </CompactStatCard>
        )}

        {stats.bestPerformer500k && (
          <CompactStatCard>
            <CardBody style={{ padding: '10px 14px' }}>
              <BestPerformerText>{stats.bestPerformer500k.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 500k Change</BestPerformerSubtext>
              <CompactGrowthText isPositive={stats.bestPerformer500k.historical.change500k >= 0}>
                {formatRawChange(stats.bestPerformer500k.historical.change500k, 8)}
              </CompactGrowthText>
            </CardBody>
          </CompactStatCard>
        )}

        {stats.bestPerformer1M && (
          <CompactStatCard>
            <CardBody style={{ padding: '10px 14px' }}>
              <BestPerformerText>{stats.bestPerformer1M.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 1M Change</BestPerformerSubtext>
              <CompactGrowthText isPositive={stats.bestPerformer1M.historical.change1M >= 0}>
                {formatRawChange(stats.bestPerformer1M.historical.change1M, 8)}
              </CompactGrowthText>
            </CardBody>
          </CompactStatCard>
        )}

        {stats.bestPerformer2M && (
          <CompactStatCard>
            <CardBody style={{ padding: '10px 14px' }}>
              <BestPerformerText>{stats.bestPerformer2M.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 2M Change</BestPerformerSubtext>
              <CompactGrowthText isPositive={stats.bestPerformer2M.historical.change2M >= 0}>
                {formatRawChange(stats.bestPerformer2M.historical.change2M, 8)}
              </CompactGrowthText>
            </CardBody>
          </CompactStatCard>
        )}

        {stats.bestPerformer3M && (
          <CompactStatCard>
            <CardBody style={{ padding: '10px 14px' }}>
              <BestPerformerText>{stats.bestPerformer3M.config.symbol}</BestPerformerText>
              <BestPerformerSubtext>Best 3M Change</BestPerformerSubtext>
              <CompactGrowthText isPositive={stats.bestPerformer3M.historical.change3M >= 0}>
                {formatRawChange(stats.bestPerformer3M.historical.change3M, 8)}
              </CompactGrowthText>
            </CardBody>
          </CompactStatCard>
        )}
      </StatsContainer>
    </>
  )
} 