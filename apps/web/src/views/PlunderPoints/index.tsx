import { useTheme } from '@pancakeswap/hooks'
import { Button, Flex, Heading, Text, TrophyIcon } from '@pancakeswap/uikit'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import ErrorState from '../PlunderswapInfo/components/ErrorState'
import LoadingState from '../PlunderswapInfo/components/LoadingState'

export interface PointsData {
  total_points: number
  zilnames_points: number
  early_bird_swap_points: number
  early_bird_lp_points: number
  swap_points: number
  lp_points: number
  wallet_address: string
}

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`

const TableHeader = styled(Flex)`
  padding: 16px 24px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 16px 16px 0 0;
  align-items: center;
`

const MedalIcon = styled(Text)<{ color: string }>`
  font-size: 20px;
  margin-right: 8px;
  color: ${({ color }) => color};
`

const Row = styled(Flex)<{ isEven: boolean; isConnectedWallet: boolean }>`
  padding: 16px 24px;
  background: ${({ theme, isEven, isConnectedWallet }) =>
    isConnectedWallet ? `${theme.colors.warning}20` : isEven ? theme.colors.background : theme.colors.backgroundAlt};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-left: ${({ theme, isConnectedWallet }) => (isConnectedWallet ? `4px solid ${theme.colors.warning}` : 'none')};
  align-items: center;
  position: relative;
  padding-left: ${({ isConnectedWallet }) => (isConnectedWallet ? '20px' : '24px')};

  &:hover {
    background: ${({ theme, isConnectedWallet }) =>
      isConnectedWallet ? `${theme.colors.warning}30` : theme.colors.backgroundAlt};
  }
`

const RankText = styled(Text)`
  width: 60px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AddressText = styled(Text)`
  width: 200px;
`

const PointsText = styled(Text)`
  width: 120px;
  text-align: right;
  margin-left: auto;
`

const TitleWrapper = styled(Flex)`
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`

const StyledTrophyIcon = styled(TrophyIcon)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.warning};
`

const TopThreeRow = styled(Row)`
  ${RankText} {
    color: ${({ theme }) => theme.colors.warning};
    font-weight: bold;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${PointsText} {
    color: ${({ theme }) => theme.colors.warning};
    font-weight: bold;
    font-size: 18px;
  }
`

const ActionContainer = styled(Flex)`
  justify-content: flex-end;
  margin-bottom: 16px;
`

const ScrollAnchor = styled.div`
  position: relative;
  top: -80px;
`

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const PlunderPoints = () => {
  const [points, setPoints] = useState<PointsData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const { address: connectedAddress } = useAccount()
  const theme = useTheme()

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(false)

      const response = await fetch('https://static.plunderswap.com/PlunderPoints.json', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch points data')
      }

      const data = await response.json()

      // Sort by total points in descending order
      const sortedData = data.sort((a: PointsData, b: PointsData) => b.total_points - a.total_points)
      setPoints(sortedData)
    } catch (err) {
      console.error('Error fetching points data:', err)
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return <ErrorState onRetry={fetchData} />
  }

  if (isLoading) {
    return <LoadingState />
  }

  const isTopThree = (index: number) => index < 3

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <MedalIcon color="#FFD700">🥇</MedalIcon>
      case 1:
        return <MedalIcon color="#C0C0C0">🥈</MedalIcon>
      case 2:
        return <MedalIcon color="#CD7F32">🥉</MedalIcon>
      default:
        return <Text>{index + 1}</Text>
    }
  }

  const scrollToWallet = () => {
    if (!connectedAddress) return
    const element = document.getElementById(`wallet-${connectedAddress.toLowerCase()}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const connectedWalletRank = points.findIndex(
    (point) => point.wallet_address.toLowerCase() === connectedAddress?.toLowerCase(),
  )

  return (
    <Container>
      <Flex flexDirection="column" mb="16px">
        <TitleWrapper>
          <StyledTrophyIcon />
          <Heading as="h1" scale="xl">
            PlunderPoints Leaderboard
          </Heading>
        </TitleWrapper>
        <Text fontSize="14px" color="textSubtle">
          Points earned from trading, providing liquidity, and registering Zilnames
        </Text>
      </Flex>

      {connectedAddress && connectedWalletRank !== -1 && (
        <ActionContainer>
          <Button scale="sm" variant="secondary" onClick={scrollToWallet}>
            Find Me ({connectedWalletRank + 1} / {points.length})
          </Button>
        </ActionContainer>
      )}

      <TableHeader>
        <RankText bold>Rank</RankText>
        <AddressText bold>Wallet</AddressText>
        <PointsText bold>Total Points</PointsText>
      </TableHeader>

      {points.map((pointData, index) => {
        const isConnectedWallet = connectedAddress?.toLowerCase() === pointData.wallet_address.toLowerCase()
        const RowComponent = isTopThree(index) ? TopThreeRow : Row

        return (
          <>
            {isConnectedWallet && <ScrollAnchor id={`wallet-${pointData.wallet_address.toLowerCase()}`} />}
            <RowComponent key={pointData.wallet_address} isEven={index % 2 === 0} isConnectedWallet={isConnectedWallet}>
              <RankText>{getMedalIcon(index)}</RankText>
              <AddressText color={isConnectedWallet ? 'warning' : 'text'}>
                {formatAddress(pointData.wallet_address)}
              </AddressText>
              <PointsText>{pointData.total_points.toLocaleString()}</PointsText>
            </RowComponent>
          </>
        )
      })}

      <Text fontSize="12px" color="textSubtle" mt="16px" textAlign="center">
        Data refreshes every 5 minutes. Points are calculated daily.
      </Text>
    </Container>
  )
}
