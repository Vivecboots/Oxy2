import { StaticImageData } from "next/image";
import EthIcon from "./img/etherLogo.png";
import UsdcIcon from "./img/usd-coin-usdc-logo.png";
import MyTokenIcon from "./img/mytoken-logo.jpeg"; // make sure to replace "./img/mytoken-logo.png" with the actual path to your token's icon

export type TokenOptions = {
  label: string;
  icon: StaticImageData;
  value?: string;
  decimals: number;
};

export const tokenOptions: TokenOptions[] = [
  { value: undefined, label: "ETH", icon: EthIcon, decimals: 18 },
  {
    value: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F", //Görli USDC Smart Contracts address
    label: "USDC",
    icon: UsdcIcon,
    decimals: 6,
  },
  {
    value: "0x07201C3C380380cB9380c21858A035b3b4c8a6A3", // replace with your token's contract address
    label: "MYTOKEN",
    icon: MyTokenIcon,
    decimals: 0, // replace with your token's decimal precision
  },
];



