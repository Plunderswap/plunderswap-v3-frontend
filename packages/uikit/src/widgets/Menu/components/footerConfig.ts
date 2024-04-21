import { ContextApi } from "@pancakeswap/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("About"),
    items: [
      // {
      //   label: t('Contact'),
      //   href: 'https://docs.plunderswap.com/contact-us',
      //   isHighlighted: true,
      // },
      // {
      //   label: t('Brand'),
      //   href: 'https://docs.plunderswap.com/brand',
      // },
      // {
      //   label: t('Blog'),
      //   href: 'https://medium.com/pancakeswap',
      // },
      {
        label: t("Community"),
        href: "https://docs.plunderswap.com/contact-us/communities/",
      },
      // {
      //   label: t('Litepaper'),
      //   href: 'https://v2litepaper.plunderswap.com/',
      // },
    ],
  },
  {
    label: t("Help"),
    items: [
      // {
      //   label: t('Customer Support'),
      //   href: 'https://docs.plunderswap.com/contact-us/customer-support',
      // },
      {
        label: t("Troubleshooting"),
        href: "https://docs.plunderswap.com/help/troubleshooting",
      },
      {
        label: t("Guides"),
        href: "https://docs.plunderswap.com/get-started",
      },
    ],
  },
  {
    label: t("Developers"),
    items: [
      {
        label: "Github",
        href: "https://github.com/Plunderswap",
      },
      {
        label: t("Documentation"),
        href: "https://docs.plunderswap.com",
      },
      // {
      //   label: t('Bug Bounty'),
      //   href: 'https://docs.plunderswap.com/code/bug-bounty',
      // },
      // {
      //   label: t('Audits'),
      //   href: 'https://docs.plunderswap.com/help/faq#is-pancakeswap-safe-has-pancakeswap-been-audited',
      // },
      // {
      //   label: t('Careers'),
      //   href: 'https://docs.plunderswap.com/hiring/become-a-chef',
      // },
    ],
  },
  {
    label: "Legal",
    items: [
      {
        label: "Privacy Policy",
        href: "https://docs.plunderswap.com/contact-us/privacy-policy/",
      },
      {
        label: "Terms and Conditions",
        href: "https://docs.plunderswap.com/contact-us/terms/",
      },
    ],
  },
];
