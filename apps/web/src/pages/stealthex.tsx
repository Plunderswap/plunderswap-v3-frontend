import { Box, CopyAddress, Flex, Text } from '@pancakeswap/uikit'
import widget from '@stealthex-io/widget'
import { toBech32Address } from '@zilliqa-js/crypto'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { NextPage } from 'next'
import { useEffect } from 'react'
import styled from 'styled-components'

const StyledContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding: 24px;
  min-height: calc(100vh - 64px);
  gap: 24px;
`

const AddressBox = styled(Box)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 16px;
  width: 100%;
  max-width: 960px;
`

const StealthExPage: NextPage<unknown> & { chains?: number[] } = () => {
  const { account } = useActiveWeb3React()
  const Zil1Address = account ? toBech32Address(account) : ''

  useEffect(() => {
    // Initialize widget with the Zil1 address if available
    widget.init('2208eef9-f341-490c-9d00-31cccb95970a', {
      size: 960,
      ...(Zil1Address && {
        defaultReceiver: Zil1Address, // This will pre-fill the recipient address if the widget supports it
      }),
    })

    return () => {
      const container = document.getElementById('stealthex-widget-container')
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [Zil1Address]) // Re-initialize when address changes

  return (
    <StyledContainer>
      {account && (
        <AddressBox>
          <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
            Your ZIL1 Address
          </Text>
          <CopyAddress account={Zil1Address} tooltipMessage="Copied" />
        </AddressBox>
      )}
      <div id="stealthex-widget-container" style={{ width: '100%', maxWidth: '960px' }} />
    </StyledContainer>
  )
}

// Allow all chains
StealthExPage.chains = []

export default StealthExPage
