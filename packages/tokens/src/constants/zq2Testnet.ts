import { ChainId, ERC20Token, WZIL } from '@pancakeswap/sdk'

export const zq2TestnetTokens = {
  wzil: WZIL[ChainId.ZQ2_TESTNET],
  // zil here points to the wzil contract. Wherever the currency ZIL is required, conditional checks for the symbol 'ZIL' can be used
  zil: new ERC20Token(
    ChainId.ZQ2_TESTNET,
    '0x78EEA00b588B94F21FDCbB0B88d2f923d2Ea77Fc',
    18,
    'ZIL',
    'ZIL',
    'https://www.zilliqa.com/',
  ),
  usdc: new ERC20Token(
    ChainId.ZQ2_TESTNET,
    '0x7F13801C219B2EF353cEEf9b9dF56d9aa2DB3417',
    18,
    'USDC',
    'USD Coin',
    'https://www.centre.io/usdc',
  ),
  seed: new ERC20Token(
    ChainId.ZQ2_TESTNET,
    '0x68b9D6cAd4a3117151c284244e90F2F4A2D4F3c7',
    18,
    'SEED',
    'Kalijo',
    'https://kalijo.io',
  ),
}
