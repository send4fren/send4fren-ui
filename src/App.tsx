import './App.css';
import { useMemo } from 'react';
import * as anchor from '@project-serum/anchor';
import Home from './Home';
import {ThemeProps, MintSelection, MintProps} from './MintSelection'

import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
} from '@solana/wallet-adapter-wallets';

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletDialogProvider } from '@solana/wallet-adapter-material-ui';

import { ThemeProvider, createTheme } from '@material-ui/core';
import { MintCountdown } from './MintCountdown';


const theme = createTheme({
  palette: {
    type: 'dark',
  },
});

const getCandyMachineIds = (): anchor.web3.PublicKey[] | undefined[] => {
  try {
    const niceCandyMachineId = new anchor.web3.PublicKey(
      process.env.REACT_APP_CANDY_MACHINE_ID_NICE!,
    );
    const naughtyCandyMachineId = new anchor.web3.PublicKey(
      process.env.REACT_APP_CANDY_MACHINE_ID_NAUGHTY!,
    );
    const savageCandyMachineId = new anchor.web3.PublicKey(
      process.env.REACT_APP_CANDY_MACHINE_ID_SAVAGE!,
    );

    return [niceCandyMachineId, naughtyCandyMachineId, savageCandyMachineId];
  } catch (e) {
    console.log('Failed to construct CandyMachineId', e);
    return [undefined, undefined, undefined];
  }
};

const [niceCandyMachineId, naughtyCandyMachineId, savageCandyMachineId] = getCandyMachineIds();
const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost
  ? rpcHost
  : anchor.web3.clusterApiUrl('devnet'));

const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);
const txTimeoutInMilliseconds = 30000;

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getSlopeWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    [],
  );

  const nice: ThemeProps = {
    name: 'Nice',
    description: "Send them a sweet message they'll be thinking about all day",
    imgSrc: "images/SWEET_ShibaCupid.png",
    imgSrcSet: "images/SWEET_ShibaCupid-p-500.png 500w, images/SWEET_ShibaCupid-p-800.png 800w, images/SWEET_ShibaCupid-p-1080.png 1080w, images/SWEET_ShibaCupid-p-1600.png 1600w, images/SWEET_ShibaCupid-p-2000.png 2000w, images/SWEET_ShibaCupid.png 2258w",
    id: niceCandyMachineId
  }
  const naughty: ThemeProps = {
    name: 'Naughty',
    description: "Show them how they make you feel down south",
    imgSrc: "images/NAUGHTY_Ahegao.png",
    imgSrcSet: "images/NAUGHTY_Ahegao-p-500.png 500w, images/NAUGHTY_Ahegao-p-800.png 800w, images/NAUGHTY_Ahegao-p-1080.png 1080w, images/NAUGHTY_Ahegao-p-1600.png 1600w, images/NAUGHTY_Ahegao-p-2000.png 2000w, images/NAUGHTY_Ahegao.png 2450w",
    id: naughtyCandyMachineId
  }
  const savage: ThemeProps = {
    name: 'Savage',
    description: "Roast them because you care about them",
    imgSrc: "images/SAVAGE_AnimeWaifu.png",
    imgSrcSet: "images/SAVAGE_AnimeWaifu-p-500.png 500w, images/SAVAGE_AnimeWaifu-p-800.png 800w, images/SAVAGE_AnimeWaifu-p-1080.png 1080w, images/SAVAGE_AnimeWaifu-p-1600.png 1600w, images/SAVAGE_AnimeWaifu-p-2000.png 2000w, images/SAVAGE_AnimeWaifu.png 2858w",
    id: savageCandyMachineId
  }
  const collections: ThemeProps[] = [nice, naughty, savage]

  const mintInfo: MintProps = {
    connection: connection,
    startDate: startDateSeed,
    txTimeout: txTimeoutInMilliseconds,
    rpcHost: rpcHost
  }


  // const d: Date = new Date('February 14, 2022 00:00:00') 
  // d.setDate()

  
  return (
    <ThemeProvider theme={theme}>
      {/* <MintSelection collection={collections} info={mintInfo}></MintSelection> */}
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletDialogProvider>
            {/* DATE {d} */}
            <MintSelection collection={collections} info={mintInfo}></MintSelection>
            {/* {d.getDate()}
            <MintCountdown date={d}>
              
            </MintCountdown> */}
            {/* <Home
              niceCandyMachineId={niceCandyMachineId}
              naughtyCandyMachineId={naughtyCandyMachineId}
              savageCandyMachineId={savageCandyMachineId}
              connection={connection}
              startDate={startDateSeed}
              txTimeout={txTimeoutInMilliseconds}
              rpcHost={rpcHost}
            /> */}
          </WalletDialogProvider>
        </WalletProvider>
      </ConnectionProvider>

        </ThemeProvider>
        );
};

        export default App;
