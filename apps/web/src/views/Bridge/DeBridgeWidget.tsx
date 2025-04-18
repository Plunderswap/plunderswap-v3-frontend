import { Box, Card, CopyAddress, Flex, Message, Text } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

const StyledContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding: 24px;
  min-height: calc(100vh - 64px);
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`

const WidgetContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 640px) {
    width: 100%;
    max-width: 100%;
  }
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

const WidgetNotice = styled(Message)`
  width: 100%;
  max-width: 600px;
  margin-bottom: 8px;
  padding: 8px 12px;
`

const AddressCard = styled(InfoCard)`
  padding: 16px;
  margin-top: 16px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ContractAddressBox = styled(Flex)`
  align-items: center;
  margin-top: 8px;
`

// Add TypeScript definition for the deBridge global object
declare global {
  interface Window {
    deBridge: {
      widget: (params: {
        element: string
        v?: string
        mode?: string
        title?: string
        affiliateFeePercent?: string
        affiliateFeeRecipient?: string
        width?: string
        height?: string
        inputChain?: number
        outputChain?: number
        inputCurrency?: string
        outputCurrency?: string
        address?: string
        amount?: string
        lang?: string
        theme?: string
        styles?: string
        r?: string
        supportedChains?: string
      }) => {
        on: (event: string, callback: (widget: any, params: any) => void) => void
      }
    }
  }
}

const DeBridgeWidget = () => {
  const { address: account } = useAccount()
  const { isDark } = useTheme()
  const widgetRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)
  
  useEffect(() => {
    // Step 1: Add the script to the document as shown in the documentation
    const script = document.createElement('script')
    script.src = 'https://app.debridge.finance/assets/scripts/widget.js'
    script.async = true
    
    // Initialize widget after script loads
    script.onload = () => {
      // Make sure we don't have any duplicate initialization
      if (initialized.current || !window.deBridge) return
      
      // Step 3: Initialize with the object settings exactly as in documentation
      try {
        // Clear any existing content
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
        }
        
        // Use exact parameters from documentation
        const widgetSettings = {
          element: "debridgeWidget",
          v: "1",
          mode: "deswap",
          title: "deBridgeSwap",
          affiliateFeePercent: "0.3",
          affiliateFeeRecipient: "0xd21E70dD2678Ee2AAAbE3E5c54b6A52D252E7400",
          width: window.innerWidth < 640 ? "100%" : "600",
          height: window.innerWidth < 640 ? "800" : "800",
          supportedChains: JSON.stringify({
            inputChains: {
              1: "all", 10: "all", 56: "all", 100: "all", 137: "all", 146: "all", 250: "all", 388: "all",
              747: "all", 998: "all", 1088: "all", 1514: "all", 2741: "all", 4158: "all", 7171: "all", 
              8453: "all", 32769: "all", 42161: "all", 43114: "all", 48900: "all", 59144: "all", 
              60808: "all", 80094: "all", 7565164: "all", 245022934: "all"
            },
            outputChains: {
              1: "all", 10: "all", 56: "all", 100: "all", 137: "all", 146: "all", 250: "all", 388: "all",
              747: "all", 998: "all", 999: "all", 1088: "all", 1514: "all", 2741: "all", 4158: "all", 
              7171: "all", 8453: "all", 32769: "all", 42161: "all", 43114: "all", 48900: "all", 59144: "all", 
              60808: "all", 80094: "all", 7565164: "all", 245022934: "all"
            }
          }),
          inputChain: 42161, // Arbitrum
          outputChain: 32769, // Zilliqa
          inputCurrency: "0xaf88d065e77c8cc2239327c5edb3a432268e5831", // USDC on Arbitrum
          outputCurrency: "0xD8b73cEd1B16C047048f2c5EA42233DA33168198", // USDC on Zilliqa
          address: account || "",
          amount: "",
          lang: "en",
          theme: isDark ? "dark" : "light",
          styles: "e30=", // Default styles
          r: "31787" // Referral code
        }
        
        console.log('Initializing deBridge widget with settings:', widgetSettings)
        
        // Initialize widget
        widgetRef.current = window.deBridge.widget(widgetSettings)
        initialized.current = true
        
        // Add event listeners as shown in documentation
        if (widgetRef.current && widgetRef.current.on) {
          // Order event
          widgetRef.current.on('order', (widget, params) => {
            console.log('Order created:', params)
          })
          
          // Chain change events
          widgetRef.current.on('inputChainChanged', (widget, params) => {
            console.log('Input chain changed:', params)
          })
          
          widgetRef.current.on('outputChainChanged', (widget, params) => {
            console.log('Output chain changed:', params)
          })
        }
      } catch (error) {
        console.error('Failed to initialize deBridge widget:', error)
      }
    }
    
    // Add script to document
    document.body.appendChild(script)
    
    // Cleanup function
    return () => {
      // Clean up the widget
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      
      // Remove the script tag
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      
      initialized.current = false
    }
  }, [account, isDark]) // Re-initialize when account or theme changes
  
  return (
    <StyledContainer>
      <WidgetNotice variant="warning">
        <Text>Please use the Connect Wallet button within the deBridge widget to connect for cross-chain swaps</Text>
      </WidgetNotice>
      
      <WidgetContainer id="debridgeWidget" ref={containerRef} />

      <AddressCard>
        <Text bold>Zilliqa USDC Contract Address</Text>
        <ContractAddressBox>
          <CopyAddress account="0xD8b73cEd1B16C047048f2c5EA42233DA33168198" />
        </ContractAddressBox>
      </AddressCard>

      <InfoSection>
        <InfoCard>
          <IconWrapper>🔒</IconWrapper>
          <Text bold mb="8px" fontSize="20px">
            Secure & Non-Custodial
          </Text>
          <Text color="textSubtle">
            Exchange your assets across any blockchain without giving up control of your assets. DLN uses 0-TVL infrastructure with no locked liquidity at risk.
          </Text>
        </InfoCard>

        <InfoCard>
          <IconWrapper>⚡</IconWrapper>
          <Text bold mb="8px" fontSize="20px">
            Lightning Fast
          </Text>
          <Text color="textSubtle">
            Experience near-instant settlement with zero slippage on any order size. DLN provides guaranteed rates and low fees across all supported chains.
          </Text>
        </InfoCard>

        <InfoCard>
          <IconWrapper>🔄</IconWrapper>
          <Text bold mb="8px" fontSize="20px">
            Cross-Chain Swaps
          </Text>
          <Text color="textSubtle">
            Trade native tokens with unlimited market depth across Ethereum, BSC, Arbitrum, Zilliqa, and 20+ other blockchains with rapid scaling to any trading volume.
          </Text>
        </InfoCard>
      </InfoSection>

      <Text fontSize="16px" textAlign="center" mt="24px" color="textSubtle">
        For more information on deBridge visit the <a href="https://docs.debridge.finance/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
          official documentation
        </a> or learn about the <a href="https://docs.debridge.finance/dln-the-debridge-liquidity-network-protocol/introduction" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
          deBridge Liquidity Network
        </a>
      </Text>

      <HowItWorksSection>
        <Text bold fontSize="40px" textAlign="center">
          How it works
        </Text>

        <StepCard>
          <StepNumber>1</StepNumber>
          <StepContent>
            <Text bold mb="8px" fontSize="20px">
              Select Chains & Tokens
            </Text>
            <Text color="textSubtle">
              Choose your source and destination blockchains, then select the tokens you want to swap.
            </Text>
          </StepContent>
        </StepCard>

        <StepCard>
          <StepNumber>2</StepNumber>
          <StepContent>
            <Text bold mb="8px" fontSize="20px">
              Enter Amount
            </Text>
            <Text color="textSubtle">
              Specify how much you want to swap and review the estimated output amount. Connect your wallet when ready.
            </Text>
          </StepContent>
        </StepCard>

        <StepCard>
          <StepNumber>3</StepNumber>
          <StepContent>
            <Text bold mb="8px" fontSize="20px">
              Confirm Transaction
            </Text>
            <Text color="textSubtle">
              Approve the transaction in your wallet. deBridge will handle all the cross-chain mechanics behind the scenes.
            </Text>
          </StepContent>
        </StepCard>

        <StepCard>
          <StepNumber>4</StepNumber>
          <StepContent>
            <Text bold mb="8px" fontSize="20px">
              Receive Your Tokens
            </Text>
            <Text color="textSubtle">
              Once the transaction is complete, your swapped tokens will appear in your destination wallet automatically.
            </Text>
          </StepContent>
        </StepCard>
      </HowItWorksSection>
    </StyledContainer>
  )
}

export default DeBridgeWidget 