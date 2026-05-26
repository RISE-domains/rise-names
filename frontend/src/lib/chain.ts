import { defineChain } from 'viem'

export const riseTestnet = defineChain({
  id: 11155931,
  name: 'Rise Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [import.meta.env.VITE_RPC_URL] },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://explorer.testnet.riselabs.xyz',
      apiUrl: 'https://explorer.testnet.riselabs.xyz/api',
    },
  },
  testnet: true,
})
