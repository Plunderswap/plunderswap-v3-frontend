import { Flex, Spinner, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const LoadingContainer = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 400px;
  gap: 16px;
`

const LoadingText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 16px;
`

const SubText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  text-align: center;
  max-width: 400px;
`

export const LoadingState = () => {
  return (
    <LoadingContainer>
      <Spinner size={64} />
      <LoadingText>Loading LST Data...</LoadingText>
      <SubText>
        Fetching liquid staking token prices from proxy contracts and trading data from PlunderSwap...
      </SubText>
    </LoadingContainer>
  )
} 