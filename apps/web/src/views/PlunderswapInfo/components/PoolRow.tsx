import { Flex, Link, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { PoolData } from '../types'
import { formatNumber } from '../utils'

const PoolContainer = styled(Flex)`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  margin-left: 24px;
`

const VersionBadge = styled(Text)<{ version: 'v2' | 'v3' }>`
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  background: ${
    ({ theme, version }) =>
      version === 'v2'
        ? theme.colors.warning // orange/yellow for v2
        : theme.colors.success // green for v3
  };
  color: white;
`

interface PoolRowProps {
  pool: PoolData
  isMobile: boolean
}

const PoolRow: React.FC<PoolRowProps> = ({ pool, isMobile }) => {
  const fee = pool.version.toLowerCase() === 'v2' ? '0.35' : (pool.fee / 10000).toString()

  return (
    <PoolContainer>
      <Flex flex={2} alignItems="center">
        <VersionBadge version={pool.version.toLowerCase() as 'v2' | 'v3'}>{pool.version.toUpperCase()}</VersionBadge>
        <Text ml="8px" fontSize="14px">
          <Link href={getBlockExploreLink(pool.address, 'address')} external>
            Fee {fee}%
          </Link>
        </Text>
      </Flex>

      {!isMobile && (
        <>
          <Flex flex={1} justifyContent="flex-end">
            <Text fontSize="14px">${formatNumber(Number(pool.tvlUSD))}</Text>
          </Flex>
          <Flex flex={1} justifyContent="flex-end">
            <Text fontSize="14px">{formatNumber(Number(pool.tvlZIL))} ZIL</Text>
          </Flex>
        </>
      )}

      <Flex flex={1} justifyContent="flex-end">
        <Text fontSize="14px">${formatNumber(Number(pool.tvlUSD))}</Text>
      </Flex>
    </PoolContainer>
  )
}

export default PoolRow
