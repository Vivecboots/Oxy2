import { StaticImageData } from "next/image";
import EthIcon from "./img/etherLogo.png";
import UsdcIcon from "./img/usd-coin-usdc-logo.png";
export type TokenOptions = {
  label: string;
  icon: StaticImageData;
  value?: string;
};
export const tokenOptions: TokenOptions[] = [
  { value: undefined, label: "ETH", icon: EthIcon },
  {
    value: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F", //Görli USDC Smart Contracts address
    label: "USDC",
    icon: UsdcIcon,
  },
];


//////////////////////////////
import { useEffect } from 'react';
import { setupDepositPool, depositPool } from '../lib/contracts/depositPool';

function HomePage() {
    useEffect(() => {
        setupDepositPool();
    }, []);

    async function handleDeposit() {
        const tx = await depositPool.deposit("0xYourHash", { value: ethers.utils.parseEther("1.0") });
        await tx.wait();
    }

    // ...
}

