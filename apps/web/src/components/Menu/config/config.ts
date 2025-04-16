import { ContextApi } from '@pancakeswap/localization';
import {
  CurrencyIcon,
  DropdownMenuItemType,
  DropdownMenuItems,
  EarnFillIcon,
  EarnIcon,
  FarmIcon,
  InfoIcon,
  MenuItemsType,
  SwapFillIcon,
  SwapIcon,
  SwapVertIcon,
} from '@pancakeswap/uikit';

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
      showItemsOnMobile: true,
      hideSubNav: true,
      items: [
        {
          label: t('Swap'),
          href: '/swap',
          icon: SwapIcon,
          fillIcon: SwapFillIcon,
        },
        {
          label: 'Buy ZIL',
          href: '/onramp',
          icon: EarnIcon,
          fillIcon: EarnFillIcon,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Pool'),
      icon: FarmIcon,
      fillIcon: FarmIcon,
      image: '/images/decorations/pe2.png',
      href: '/pool',
      hideSubNav: true,
      showItemsOnMobile: false,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: 'Bridge',
      href: '/bridge',
      icon: SwapVertIcon,
      fillIcon: SwapVertIcon,
      hideSubNav: true,
      showItemsOnMobile: true,
      items: [
        {
          label: 'deBridge',
          href: '/bridge',
          icon: SwapVertIcon,
          fillIcon: SwapVertIcon,
        },
        {
          label: 'StealthEX Cross-Chain',
          href: '/crosschain',
          icon: SwapVertIcon,
          fillIcon: SwapVertIcon,
        },
        {
          label: 'xBridge',
          href: 'https://xbridge.zilliqa.com/',
          type: DropdownMenuItemType.EXTERNAL_LINK,
          icon: SwapVertIcon,
          fillIcon: SwapVertIcon,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: 'Info',
      href: '/stats',
      icon: InfoIcon,
      hideSubNav: true,
      showItemsOnMobile: true,
      items: [
        {
          label: 'Stats',
          href: '/stats',
          icon: SwapVertIcon,
          fillIcon: SwapVertIcon,
        },
        {
          label: 'PlunderPoints',
          href: '/plunder-points',
          icon: 'Trophy',
          fillIcon: 'Trophy',
        },
        {
          label: t('Legacy Transfer'),
          href: '/transfer',
          icon: CurrencyIcon,
          fillIcon: CurrencyIcon,
          image: '/images/decorations/pe2.png',
        },
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
    // {
    //   label: 'Launchpad',
    //   href: 'https://launchpad.kalijo.io',
    //   icon: PoolIcon,
    //   type: DropdownMenuItemType.EXTERNAL_LINK,
    //   showItemsOnMobile: false,
    //   items: [].map((item) => addMenuItemSupported(item, chainId)),
    // },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
