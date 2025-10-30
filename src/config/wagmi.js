import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected, walletConnect, metaMask, coinbaseWallet } from 'wagmi/connectors';

// Get project ID from environment variables
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID || "your-walletconnect-project-id";

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  // Prevent auto connecting - user must click a button
  autoConnect: false,
  connectors: [
    // Trust Wallet (and others) if you're inside the Trust in-app browser or using its desktop extension
    injected({ shimDisconnect: true }),

    // Specific brand connectors (optional but nice UX)
    metaMask({ 
      dappMetadata: { 
        name: 'Hedgex Exchange', 
        url: 'https://hedgex.io' 
      }, 
      shimDisconnect: true 
    }),
    coinbaseWallet({ 
      appName: 'Hedgex Exchange', 
      preference: 'all' 
    }),

    // Trust Wallet (and many others) via WalletConnect v2 — used for mobile deep links
    walletConnect({
      projectId: PROJECT_ID,
      showQrModal: true, // we deep-link on mobile ourselves
      metadata: {
        name: 'Hedgex Exchange',
        description: 'Hedgex Exchange Trading Platform',
        url: 'https://hedgex.io',
        icons: ['https://hedgex-dao-prod-bucket.s3.us-east-1.amazonaws.com/images/Image.jpeg'],
      },
    }),
  ],
});
