import { ChainId, ERC20Token, WZIL } from '@pancakeswap/sdk'

export const zq2TestnetTokens = {
  wzil: WZIL[ChainId.ZQ2_TESTNET],
  // zil here points to the wzil contract. Wherever the currency ZIL is required, conditional checks for the symbol 'ZIL' can be used
  zil: new ERC20Token(
    ChainId.ZILLIQA_TESTNET,
    '0x78EEA00b588B94F21FDCbB0B88d2f923d2Ea77Fc',
    18,
    'ZIL',
    'ZIL',
    'https://www.zilliqa.com/',
  ),
  usdc: new ERC20Token(
    ChainId.ZILLIQA_TESTNET,
    '0xB3adD2b12F012EdE60aCCEF078f262d2DaC3Ebf1',
    18,
    'USDC',
    'USD Coin',
    'https://www.centre.io/usdc',
  ),
  loot: new ERC20Token(
    ChainId.ZILLIQA_TESTNET,
    '0x380004E23AFD141b0aBf176D7C9d0e6D1A283F4e',
    18,
    'STREAM',
    'TestSTREAM',
    'https://zilstream.com',
  ),
}
