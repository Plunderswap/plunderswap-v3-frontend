import { ChainId, ERC20Token, WZIL } from '@pancakeswap/sdk'

export const zilliqaTokens = {
  wzil: WZIL[ChainId.ZILLIQA],
  // zil here points to the wzil contract. Wherever the currency ZIL is required, conditional checks for the symbol 'ZIL' can be used
  zil: new ERC20Token(
    ChainId.ZILLIQA,
    '0x94e18aE7dd5eE57B55f30c4B63E2760c09EFb192',
    18,
    'ZIL',
    'ZIL',
    'https://www.zilliqa.com/',
  ),
  usdt: new ERC20Token(
    ChainId.ZILLIQA,
    '0x2274005778063684fbB1BfA96a2b725dC37D75f9',
    18,
    'zUSDT',
    'Zilliqa-bridged USDT',
    'https://tether.to/',
  ),
  kusd: new ERC20Token(
    ChainId.ZILLIQA,
    '0xE9df5b4b1134A3aadf693Db999786699B016239e',
    6,
    'kUSD',
    'Kalijo USD',
    'https://kalijo.io/',
  ),
}
