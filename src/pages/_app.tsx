import { chains, publicClient, webSocketPublicClient } from '@/config/wallet';

import { RainbowKitProvider, connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app'
import { WagmiConfig, createConfig } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import '@/styles/globals.css'
import { SiteHeader } from '@/components/header/site-header';
import BottomBar from '@/components/bottom/bottom-bar';
import { Toaster } from "@/components/ui/toaster"

const projectId = '9bf3510aab08be54d5181a126967ee71';
const { wallets } = getDefaultWallets({
  projectId,
  appName: 'greenfield js sdk demo',
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  webSocketPublicClient,
  publicClient,
});


export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider modalSize="compact" chains={chains}>
        <SiteHeader />
        <Component {...pageProps} />
        <Toaster />
        <BottomBar />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
