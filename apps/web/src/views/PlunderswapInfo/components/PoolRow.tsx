import { Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { PoolData } from '../types'
import { formatNumber } from '../utils'

const PoolContainer = styled(Flex)`
  padding: 8px 40px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};

  @media screen and (max-width: 852px) {
    padding: 8px 16px;
  }
`

const MobileStatsContainer = styled(Flex)`
  flex-direction: column;
  align-items: flex-end;
  margin-right: 12px;
  font-size: 12px;
  flex: 1;
`

const APRBadge = styled(Text)<{ isRange?: boolean }>`
  background: ${({ theme }) => theme.colors.background};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
`

const VersionBadge = styled(Text)<{ version: 'v2' | 'v3' }>`
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  background: ${({ theme, version }) => (version === 'v2' ? theme.colors.warning : theme.colors.success)};
  color: white;
`

const PairContainer = styled(Flex)`
  flex: 1.5;
  @media screen and (max-width: 852px) {
    flex: 2;
  }
`

const TVLContainer = styled(Flex)`
  flex: 1;
  @media screen and (max-width: 852px) {
    flex: 1.2;
  }
`

const MobileVolumeText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  white-space: nowrap;
  width: 110px;
  text-align: right;
`

const MobileTVLText = styled(Text)`
  white-space: nowrap;
  text-align: right;
  width: 90px;
`

const FeeText = styled(Text)`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSubtle};
  white-space: nowrap;
`

const StatsContainer = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
  gap: 24px;
  padding-right: 56px;

  @media screen and (max-width: 852px) {
    padding-right: 32px;
    gap: 24px;
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
  }
`

const MobilePoolRow = styled(Flex)`
  padding: 8px 16px 8px 24px;
  background: ${({ theme }) => theme.colors.background};
  justify-content: space-between;
  align-items: center;
`

const MobilePoolInfo = styled(Flex)`
  align-items: center;
  gap: 2px;
  height: 32px;
  align-items: center;
`

const MobilePoolStats = styled(Flex)`
  align-items: center;
  gap: 4px;
`

const StatsColumn = styled(Flex)`
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  margin: 0 28px;
  width: 80px;
`

const MobilePoolAPR = styled(Text)`
  text-align: right;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const MobilePoolTVL = styled(Text)`
  text-align: right;
  width: 50px;
  justify-content: flex-end;
  display: flex;
  height: 32px;
  align-items: center;
`

const MobilePoolVolume = styled(Text)`
  text-align: right;
  font-size: 14px;
`

interface PoolRowProps {
  pool: PoolData
  isMobile: boolean
}

const PoolRow: React.FC<PoolRowProps> = ({ pool, isMobile }) => {
  const fee = pool.version.toLowerCase() === 'v2' ? '0.35' : (pool.fee / 10000).toString()
  const isV3 = pool.version.toLowerCase() === 'v3'

  return isMobile ? (
    <MobilePoolRow>
      <MobilePoolInfo>
        <VersionBadge version={pool.version.toLowerCase() as 'v2' | 'v3'}>{pool.version.toUpperCase()}</VersionBadge>
        <FeeText>{pool.version.toLowerCase() === 'v2' ? '0.35' : (pool.fee / 10000).toString()}%</FeeText>
      </MobilePoolInfo>
      <MobilePoolStats>
        <StatsColumn>
          <MobilePoolVolume>${formatNumber(Number(pool.volume_usd_7d))}</MobilePoolVolume>
          <MobilePoolAPR>
            {pool.version.toLowerCase() === 'v3' ? (
              <Flex alignItems="center">
                {pool.apr_7d}%
                <Text as="sup" fontSize="8px" ml="1px">
                  *
                </Text>
              </Flex>
            ) : (
              `${pool.apr_7d}%`
            )}
          </MobilePoolAPR>
        </StatsColumn>
        <MobilePoolTVL>${formatNumber(Number(pool.tvlUSD))}</MobilePoolTVL>
      </MobilePoolStats>
    </MobilePoolRow>
  ) : (
    <PoolContainer>
      <PairContainer alignItems="center" style={{ flex: 0.8 }}>
        <VersionBadge version={pool.version.toLowerCase() as 'v2' | 'v3'}>{pool.version.toUpperCase()}</VersionBadge>
        <FeeText ml="8px" fontSize="14px">
          {fee}%
        </FeeText>
      </PairContainer>

      {!isMobile && (
        <StatsContainer>
          <StatValue>${formatNumber(Number(pool.tvlUSD))}</StatValue>
          <StatValue>${formatNumber(Number(pool.volume_usd_7d))}</StatValue>
          <StatValue>
            {pool.apr_7d}%{pool.version.toLowerCase() === 'v3' && '*'}
          </StatValue>
        </StatsContainer>
      )}
    </PoolContainer>
  )
}

export default PoolRow
