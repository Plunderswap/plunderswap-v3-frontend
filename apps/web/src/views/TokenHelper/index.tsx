import { useTranslation } from '@pancakeswap/localization'
import { Currency, Native, Percent, Token } from '@pancakeswap/sdk'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { AtomBox, AutoColumn, Flex, LinkExternal, Text } from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { Swap } from '@pancakeswap/widgets-internal'
import { BN, Long } from '@zilliqa-js/util'
import BigNumber from 'bignumber.js'
import { AppBody } from 'components/App'
import { CommitButton } from 'components/CommitButton'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { CommonBasesType } from 'components/SearchModal/types'
import proxyAbi from 'config/abi/erc20Zrc2Proxy.json'
import { useCurrency } from 'hooks/Tokens'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useCurrencyBalances } from 'state/wallet/hooks'
import currencyId from 'utils/currencyId'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import Page from 'views/Page'
import { Wrapper } from 'views/Swap/components/styleds'
import useWarningImport from 'views/Swap/hooks/useWarningImport'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from 'views/Swap/styles'
import { usePublicClient } from 'wagmi'

export default function TokenHelper() {
  const { t } = useTranslation()
  const warningSwapHandler = useWarningImport()

  const { account, chainId } = useAccountActiveChain()
  const publicClient = usePublicClient({ chainId })

  // get custom setting values for user
  const [allowUseSmartRouter, setAllowUseSmartRouter] = useState(() => false)
  const [zilpayWallet, setZilpayWallet] = useState(() => {
    return {
      network: 'mainnet',
      bech32: '',
      byte20: '',
    }
  })
  const isZilpayConnected = zilpayWallet.bech32 !== ''

  useEffect(() => {
    if (localStorage.getItem('zilPay') === 'true') {
      connectZilPay()
    }
  }, [])

  const connectZilPay = async () => {
    const zilPay = await getConnectedZilPay()
    await connectWalletZilPay(zilPay)
  }

  const connectWalletZilPay = async (zilPay: any) => {
    if (!zilPay.wallet.isConnect) throw new Error('ZilPay connection failed.')

    const wallet: any = zilPay.wallet.defaultAccount
    if (!wallet) throw new Error('Please sign in to your ZilPay account before connecting.')

    const net = zilPay.wallet.net

    setZilpayWallet({
      network: net,
      bech32: wallet!.bech32,
      byte20: wallet!.base16,
    })

    localStorage.setItem('zilPay', 'true')

    await setTokenData()
  }

  const getConnectedZilPay = async () => {
    let zilPay = (window as any).zilPay
    if (!zilPay) {
      await delay(1500) // wallet injection may sometimes be slow
      zilPay = (window as any).zilPay
    }
    try {
      if (typeof zilPay !== 'undefined') {
        const result = await zilPay.wallet.connect()
        if (result === zilPay.wallet.isConnect) {
          return zilPay
        }
      }
    } catch (e) {
      console.error(e)
    }
    return null
  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }),
    [inputCurrency, outputCurrency],
  )

  const [formattedAmount, setFormattedAmount] = useState('')

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  const [inputBalance] = useCurrencyBalances(account, [inputCurrency, outputCurrency])
  const maxAmountInput = useMemo(() => maxAmountSpend(inputBalance), [inputBalance])

  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const handleTypeInput = useCallback(
    (value: string) => {
      setFormattedAmount(value)
    },
    [onUserInput],
  )

  const shortenAddress = (address: string, length = 4): string => {
    return `${address.substr(0, length + 1)}...${address.substr(address.length - length, length)}`
  }

  const handleInputSelect = useCallback(
    (newCurrencyInput) => {
      onCurrencySelection(Field.INPUT, newCurrencyInput)

      warningSwapHandler(newCurrencyInput)

      const newCurrencyInputId = currencyId(newCurrencyInput)
      if (newCurrencyInputId === outputCurrencyId) {
        replaceBrowserHistory('outputCurrency', inputCurrencyId)
      }
      replaceBrowserHistory('inputCurrency', newCurrencyInputId)
    },
    [inputCurrencyId, outputCurrencyId, onCurrencySelection, warningSwapHandler],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handlePercentInput = useCallback(
    (percent) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const [tokenIsNative, setTokenIsNative] = useState<boolean>(true)
  const [zrc2Address, setZrc2Address] = useState<string>('')
  const [zrc2Balance, setZrc2Balance] = useState<string>('0')
  const [transactionHash, setTransactionHash] = useState<string>('')

  useEffect(() => {
    setTokenData()
  }, [currencies[Field.INPUT], zilpayWallet])

  useEffect(() => {
    setTokenData()
  }, [])

  const setTokenData = async () => {
    const token = currencies[Field.INPUT]
    if (token === undefined) return
    setZrc2Balance('0')
    if (token instanceof Native) {
      setTokenIsNative(true)
      await getZilBalance()
    } else if (token instanceof WrappedTokenInfo || token instanceof Token) {
      setTokenIsNative(false)
      await getProxyAddress(token)
    }
  }

  const getZilBalance = async () => {
    const zilPay = await getConnectedZilPay()
    if (!zilpayWallet.byte20) return
    zilPay.blockchain.getBalance(zilpayWallet.byte20).then((balance: any) => {
      setZrc2Balance(new BigNumber(balance.result.balance).shiftedBy(-12).toFixed(3))
    })
  }

  const getProxyAddress = async (token: WrappedTokenInfo | Token) => {
    const zrc2AddressCall = [
      {
        abi: proxyAbi,
        address: token.address,
        functionName: 'zrc2_address',
      },
    ]
    const [zrc2addr] = await publicClient.multicall({
      contracts: zrc2AddressCall,
      allowFailure: false,
    })
    setZrc2Address(zrc2addr)
    await getTokenBalance(token, zrc2addr)
  }

  const getTokenBalance = async (token: WrappedTokenInfo | Token, tokenAddress: string) => {
    try {
      const zilPay = await getConnectedZilPay()

      const balances = await zilPay.blockchain.getSmartContractSubState(tokenAddress, 'balances', [
        zilpayWallet.byte20.toLowerCase(),
      ])

      const balance = new BigNumber(balances.result.balances[zilpayWallet.byte20.toLowerCase()])
      setZrc2Balance(balance.shiftedBy(-token.decimals).toFixed(3))
    } catch (error) {
      // console.log(error)
    }
  }

  const transferToEVM = async () => {
    if (formattedAmount === '') return

    const zilPay = await getConnectedZilPay()
    const token = currencies[Field.INPUT]

    if (tokenIsNative) {
      const txn = await zilPay.blockchain.createTransaction({
        toAddr: account,
        amount: new BigNumber(formattedAmount).shiftedBy(12).toString(),
        gasPrice: '2000',
        gasLimit: '50',
      })
      txn.id = txn.ID
      setTransactionHash(txn.id)
    } else {
      const contract = zilPay.contracts.at(zrc2Address)

      try {
        const txn = await contract.call(
          'Transfer',
          [
            {
              vname: 'to',
              type: 'ByStr20',
              value: `${account}`,
            },
            {
              vname: 'amount',
              type: 'Uint128',
              value: new BigNumber(formattedAmount).shiftedBy(token.decimals).toString(),
            },
          ],
          {
            amount: new BN(0),
            gasPrice: new BN(2000000000),
            gasLimit: Long.fromNumber(1500),
          },
          true,
        )
        txn.id = txn.ID
        setTransactionHash(txn.id)
      } catch {
        console.log('error: ')
      }
    }
  }

  const wrongNetwork =
    (chainId === 32769 && zilpayWallet.network === 'testnet') ||
    (chainId === 33101 && zilpayWallet.network === 'mainnet')

  return (
    <Page>
      <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative">
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={false}>
            <StyledInputCurrencyWrapper>
              <AppBody>
                <AtomBox width="100%" alignItems="center" flexDirection="column" padding="24px" borderBottom="1">
                  <AtomBox display="flex" width="100%" alignItems="center" justifyContent="center">
                    <Swap.CurrencyInputHeaderTitle>{t('EVM Token Transfer')}</Swap.CurrencyInputHeaderTitle>
                  </AtomBox>
                  <Swap.CurrencyInputHeaderSubTitle>
                    {t('Send your tokens to Zilliqa EVM')}
                  </Swap.CurrencyInputHeaderSubTitle>
                </AtomBox>
                {transactionHash !== '' && (
                  <AtomBox width="100%" alignItems="center" flexDirection="column" padding="24px" borderBottom="1">
                    <Text>Sendin&apos; yer tokens across</Text>
                    <Text>
                      <LinkExternal href={`https://viewblock.io/zilliqa/tx/${transactionHash}?network=mainnet`}>
                        {shortenAddress(transactionHash, 10)}
                      </LinkExternal>
                    </Text>
                  </AtomBox>
                )}
                <Wrapper id="swap-page">
                  <AutoColumn gap="sm">
                    <CurrencyInputPanel
                      label={
                        independentField === Field.OUTPUT && !showWrap && tradeInfo ? t('From (estimated)') : t('From')
                      }
                      value={formattedAmount}
                      showMaxButton={false}
                      // showQuickInputButton
                      currency={currencies[Field.INPUT]}
                      onUserInput={handleTypeInput}
                      onPercentInput={handlePercentInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={handleInputSelect}
                      id="swap-currency-input"
                      showCommonBases
                      commonBasesType={CommonBasesType.SWAP_LIMITORDER}
                    />

                    <Text
                      color="textSubtle"
                      fontSize="14px"
                      style={{ display: 'inline', cursor: 'pointer', textAlign: 'right' }}
                    >
                      ZilPay balance: {zrc2Balance}
                    </Text>

                    {wrongNetwork && (
                      <Text style={{ display: 'inline', textAlign: 'center' }}>Change ZilPay network</Text>
                    )}

                    <CommitButton
                      variant="zilliqa"
                      onClick={() => {
                        connectZilPay()
                      }}
                      id="swap-button"
                      width="100%"
                      disabled={isZilpayConnected}
                    >
                      {isZilpayConnected ? (
                        <div>
                          <div>ZilPay connected</div>
                          <div>{shortenAddress(zilpayWallet.bech32, 6)}</div>
                        </div>
                      ) : (
                        <>Connect ZilPay</>
                      )}
                    </CommitButton>

                    <CommitButton
                      variant="primary"
                      onClick={() => {
                        transferToEVM()
                      }}
                      id="swap-button"
                      width="100%"
                      disabled={!isZilpayConnected || wrongNetwork}
                    >
                      Transfer to EVM
                    </CommitButton>
                    {/* <CommitButton
                      variant="primary"
                      onClick={() => {
                        transferFromEVM()
                      }}
                      id="swap-button"
                      width="100%"
                      disabled={!isZilpayConnected}
                    >
                      Transfer from EVM
                    </CommitButton> */}
                  </AutoColumn>
                </Wrapper>
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
