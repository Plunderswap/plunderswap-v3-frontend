import { Box, Card, ChevronDownIcon, ChevronUpIcon, CopyAddress, Flex, Text } from '@pancakeswap/uikit'
import widget from '@stealthex-io/widget'
import { fromBech32Address, toBech32Address } from '@zilliqa-js/crypto'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
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

const InfoSection = styled(Flex)`
  width: 100%;
  max-width: 1200px;
  gap: 24px;
  margin-top: 24px;
  flex-direction: row;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`

const HowItWorksSection = styled(Flex)`
  width: 100%;
  max-width: 1200px;
  margin-top: 48px;
  flex-direction: column;
  gap: 32px;
`

const StepCard = styled(Card)`
  padding: 24px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  display: flex;
  gap: 24px;
  align-items: flex-start;

  /* Increase minimum height further */
  min-height: 140px;
`

const StepContent = styled(Box)`
  flex: 1;

  /* Increase bottom padding further */
  padding-bottom: 12px;

  > p {
    line-height: 1.6;
  }

  > p:last-child {
    margin-bottom: 0;
    padding-bottom: 12px;
  }
`

const StepNumber = styled(Flex)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
`

const InfoCard = styled(Card)`
  flex: 1;
  padding: 24px;
  text-align: center;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`

const IconWrapper = styled(Flex)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.secondary};
  margin: 0 auto 16px;
  align-items: center;
  justify-content: center;
`

const AddressConverterCard = styled(Card)<{ isExpanded: boolean }>`
  width: 100%;
  max-width: 960px;
  padding: ${({ isExpanded }) => (isExpanded ? '24px' : '0')} 0;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`

const ConverterToggle = styled(Flex)`
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
`

const ConverterContent = styled(Box)<{ isExpanded: boolean }>`
  padding: 0 24px 24px;
  display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')};
`

const StealthExPage: NextPage<unknown> & { chains?: number[] } = () => {
  const { account } = useActiveWeb3React()
  const Zil1Address = account ? toBech32Address(account) : ''
  const [inputAddress, setInputAddress] = useState('')
  const [convertedAddress, setConvertedAddress] = useState('')
  const [error, setError] = useState('')
  const [isConverterExpanded, setIsConverterExpanded] = useState(false)

  const handleConversion = (address: string) => {
    try {
      setError('')
      if (address.startsWith('zil1')) {
        setConvertedAddress(fromBech32Address(address))
      } else if (address.startsWith('0x')) {
        setConvertedAddress(toBech32Address(address))
      } else {
        setError('Please enter a valid ZIL1 or 0x address')
      }
    } catch (err) {
      setError('Invalid address format')
      setConvertedAddress('')
    }
  }

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

      <AddressConverterCard isExpanded={isConverterExpanded}>
        <ConverterToggle onClick={() => setIsConverterExpanded(!isConverterExpanded)}>
          <Text bold fontSize="20px">
            zil1/0x Address Converter
          </Text>
          {isConverterExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </ConverterToggle>

        <ConverterContent isExpanded={isConverterExpanded}>
          <Text color="textSubtle" mb="16px">
            Convert between zil1 and 0x address formats
          </Text>
          <input
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid',
              marginBottom: '16px',
            }}
            value={inputAddress}
            onChange={(e) => {
              setInputAddress(e.target.value)
              handleConversion(e.target.value)
            }}
            placeholder="Enter ZIL1 or 0x address"
          />
          {error && (
            <Text color="failure" mb="16px">
              {error}
            </Text>
          )}
          {convertedAddress && (
            <AddressBox>
              <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
                Converted Address
              </Text>
              <CopyAddress account={convertedAddress} tooltipMessage="Copied" />
            </AddressBox>
          )}
        </ConverterContent>
      </AddressConverterCard>

      <InfoSection>
        <InfoCard>
          <IconWrapper>🔒</IconWrapper>
          <Text bold mb="8px" fontSize="20px">
            Non-Custodial
          </Text>
          <Text color="textSubtle">
            Exchange your crypto without registration, and we don&apos;t require any personal data.
          </Text>
        </InfoCard>

        <InfoCard>
          <IconWrapper>⚡</IconWrapper>
          <Text bold mb="8px" fontSize="20px">
            Limitless
          </Text>
          <Text color="textSubtle">Limitless, custody-free cryptocurrency exchange</Text>
        </InfoCard>

        <InfoCard>
          <IconWrapper>🔄</IconWrapper>
          <Text bold mb="8px" fontSize="20px">
            Cross-Chain Swaps
          </Text>
          <Text color="textSubtle">
            Exchange your assets across different blockchains seamlessly. Support for multiple chains.
          </Text>
        </InfoCard>
      </InfoSection>

      <HowItWorksSection>
        <Text bold fontSize="40px" textAlign="center">
          How it works
        </Text>

        <StepCard>
          <StepNumber>1</StepNumber>
          <StepContent>
            <Text bold mb="8px" fontSize="20px">
              Pick Your Exchange
            </Text>
            <Text color="textSubtle">
              Select the currencies you want to swap and enter the amount. The estimated amount you&apos;ll receive will
              be displayed instantly. Choose fixed-rate swap for exact amounts.
            </Text>
          </StepContent>
        </StepCard>

        <StepCard>
          <StepNumber>2</StepNumber>
          <StepContent>
            <Text bold mb="8px" fontSize="20px">
              Enter the Crypto Wallet Address
            </Text>
            <Text color="textSubtle">
              Paste your receiving wallet address. Double-check the information as blockchain transactions cannot be
              reversed. Include any required EXTRA ID if needed.
            </Text>
          </StepContent>
        </StepCard>

        <StepCard>
          <StepNumber>3</StepNumber>
          <StepContent>
            <Text bold mb="8px" fontSize="20px">
              Send the Deposit
            </Text>
            <Text color="textSubtle">
              Send your deposit to the provided StealthEX address. Make sure the amount matches exactly what&apos;s
              shown on screen. Your swap will begin once the deposit is received.
            </Text>
          </StepContent>
        </StepCard>

        <StepCard>
          <StepNumber>4</StepNumber>
          <StepContent>
            <Text bold mb="8px" fontSize="20px">
              Receive Your Coins
            </Text>
            <Text color="textSubtle">
              Our system will find the best exchange rate and perform the swap automatically. The exchanged funds will
              be sent directly to your provided address.
            </Text>
          </StepContent>
        </StepCard>
      </HowItWorksSection>
    </StyledContainer>
  )
}

// Allow all chains
StealthExPage.chains = []

export default StealthExPage
