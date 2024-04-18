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
}
