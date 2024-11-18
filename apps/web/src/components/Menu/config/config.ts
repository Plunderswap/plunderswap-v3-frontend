import { ContextApi } from '@pancakeswap/localization'
import {
  CurrencyIcon,
  DropdownMenuItemType,
  DropdownMenuItems,
  EarnFillIcon,
  EarnIcon,
  MenuItemsType,
  PoolIcon,
  SwapFillIcon,
  SwapIcon,
  SwapVertIcon,
} from '@pancakeswap/uikit'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Trade'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/swap',
      showItemsOnMobile: false,
      hideSubNav: true,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Liquidity'),
      icon: EarnIcon,
      fillIcon: EarnFillIcon,
      image: '/images/decorations/pe2.png',
      href: '/liquidity',
      hideSubNav: true,
      showItemsOnMobile: false,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Transfer'),
      href: '/transfer',
      icon: CurrencyIcon,
      fillIcon: CurrencyIcon,
      image: '/images/decorations/pe2.png',
      hideSubNav: true,
      showItemsOnMobile: false,
      showOnMobile: false,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: 'Launchpad',
      href: 'https://launchpad.kalijo.io',
      icon: PoolIcon,
      type: DropdownMenuItemType.EXTERNAL_LINK,
      showItemsOnMobile: false,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: 'Cross-Chain',
      href: '/stealthex',
      icon: SwapVertIcon,
      fillIcon: SwapVertIcon,
      hideSubNav: true,
      showItemsOnMobile: false,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: 'Staking',
      href: 'https://stake.plunderswap.com',
      icon: CurrencyIcon,
      type: DropdownMenuItemType.EXTERNAL_LINK,
      hideSubNav: false,
      showItemsOnMobile: true,
      items: [
        {
          label: t('Stake ZIL'),
          href: 'https://stake.plunderswap.com',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          label: t('Stake SEED'),
          href: 'https://stake.kalijo.io',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
