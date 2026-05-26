import { createConfig, http } from 'wagmi'
import { getDefaultConfig } from 'connectkit'
import { riseTestnet } from './chain'

export const config = createConfig(
  getDefaultConfig({
    chains: [riseTestnet],
    transports: {
      [riseTestnet.id]: http(import.meta.env.VITE_RPC_URL),
    },
    walletConnectProjectId: import.meta.env.VITE_WC_PROJECT_ID ?? '',
    appName: 'Rise Names',
    appDescription: '.RISE Name Service',
    appUrl: 'https://explorer.testnet.riselabs.xyz',
  }),
)
