import { Button, Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

interface ErrorStateProps {
  onRetry: () => void
}

const ErrorContainer = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 400px;
  gap: 16px;
`

const ErrorIcon = styled.div`
  font-size: 48px;
  color: ${({ theme }) => theme.colors.failure};
`

const ErrorTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.failure};
  font-size: 20px;
  font-weight: 600;
`

const ErrorText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  text-align: center;
  max-width: 400px;
  margin-bottom: 8px;
`

const RetryButton = styled(Button)`
  margin-top: 8px;
`

export const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <ErrorContainer>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorTitle>Failed to Load LST Data</ErrorTitle>
      <ErrorText>
        Unable to fetch liquid staking token information. This could be due to network issues or temporary API problems.
      </ErrorText>
      <ErrorText>
        Please check your internet connection and try again.
      </ErrorText>
      <RetryButton onClick={onRetry} variant="primary">
        Retry
      </RetryButton>
    </ErrorContainer>
  )
} 