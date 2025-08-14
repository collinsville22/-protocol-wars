'use client';

  import { FC, ReactNode, useMemo } from 'react';
  import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
  import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
  import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
  import {
      PhantomWalletAdapter,
      SolflareWalletAdapter,
      TorusWalletAdapter,
  } from '@solana/wallet-adapter-wallets';
  import { clusterApiUrl } from '@solana/web3.js';

  // Import wallet adapter CSS
  require('@solana/wallet-adapter-react-ui/styles.css');

  interface Props {
      children: ReactNode;
  }

  const WalletContextProvider: FC<Props> = ({ children }) => {
      // Use devnet for development, mainnet-beta for production
      const network = WalletAdapterNetwork.Devnet;
      const endpoint = useMemo(() => clusterApiUrl(network), [network]);

      const wallets = useMemo(
          () => [
              new PhantomWalletAdapter(),
              new SolflareWalletAdapter(),
              new TorusWalletAdapter(),
          ],
          []
      );

      return (
          <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets} autoConnect>
                  <WalletModalProvider>
                      {children}
                  </WalletModalProvider>
              </WalletProvider>
          </ConnectionProvider>
      );
  };

  // Wallet status component for UI
  export const WalletStatus: FC = () => {
      const { publicKey, connected, connecting } = useWallet();

      if (connecting) {
          return (
              <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="font-mono text-sm text-yellow-400">CONNECTING...</span>
              </div>
          );
      }

      if (connected && publicKey) {
          return (
              <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="font-mono text-sm text-green-400">
                      {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                  </span>
              </div>
          );
      }

      return (
          <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="font-mono text-sm text-red-400">DISCONNECTED</span>
          </div>
      );
  };

  export default WalletContextProvider;
