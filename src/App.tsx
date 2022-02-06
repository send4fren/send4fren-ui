import './App.css';
import { useMemo, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import Home from './Home';
import {ThemeProps, MintProps, CollectionProps, MintSection, MintCollection} from './MintSelection'

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

  let startDate = (new Date('07 Feb 2022 00:00:00 UTC+11'))
  let endDate = (new Date('22 Feb 2022 00:00:00 UTC+11'))

  const nice: ThemeProps = {
    name: 'Nice',
    description: "Send them a sweet message they'll be thinking about all day",
    imgSrc: "images/SWEET_ShibaCupid.png",
    id: niceCandyMachineId, 
    startDate: startDate,
    endDate: endDate
  }
  const naughty: ThemeProps = {
    name: 'Naughty',
    description: "Show them how they make you feel down south",
    imgSrc: "images/NAUGHTY_Ahegao.png",
    id: naughtyCandyMachineId,
    startDate: startDate,
    endDate: endDate
  }
  const savage: ThemeProps = {
    name: 'Savage',
    description: "Roast them because you care about them",
    imgSrc: "images/SAVAGE_Monkey.png",
    id: savageCandyMachineId,
    startDate: startDate,
    endDate: endDate
  }
  const vdayCollection: CollectionProps = {
    themes: [nice, naughty, savage],
    title: "Valentine's Day",
    subtitle: "Spoil 'em",
    description: "1402 unique Valentine's day themed greeting cards with Nice, Naughty and Savage crypto memes to make hearts flutter, parts throbbing or blood boiling",
    imgSrc: "images/446.png",
    startDate: startDate,
    endDate: endDate

  }


  const a: ThemeProps = {
    name: 'Stupid',
    description: "Something stupid",
    imgSrc: "images/SWEET_ShibaCupid.png",
    id: niceCandyMachineId,
  }
  const b: ThemeProps = {
    name: 'Funny',
    description: "Something Retarded",
    imgSrc: "images/NAUGHTY_Ahegao.png",
    id: naughtyCandyMachineId
  }
  const c: ThemeProps = {
    name: 'Retarded',
    description: "Something Ass",
    imgSrc: "images/SAVAGE_AnimeWaifu.png",
    id: savageCandyMachineId
  }

  // const bdayCollection: CollectionProps = {
  //   themes: [a, b, c],
  //   title: "Birthday Day",
  //   subtitle: "Fuck them up",
  //   description: "1000 ways to make it go with a bang",
  //   imgSrc: "images/emptyCard.svg",
    

  // }

  const collections = [vdayCollection]

  const mintInfo: MintProps = {
    connection: connection,
    startDate: startDateSeed,
    txTimeout: txTimeoutInMilliseconds,
    rpcHost: rpcHost
  }
  
  return (
    <ThemeProvider theme={theme}>
      
      {/* <MintSelection collection={collections} info={mintInfo}></MintSelection> */}
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletDialogProvider>
            <Home basedOnIdx={0} collections={collections} props={mintInfo}>
              
            </Home>
            
            {/* <MintSelection collection={collections[0].collection} info={mintInfo}></MintSelection> */}
          </WalletDialogProvider>
        </WalletProvider>
      </ConnectionProvider>

        </ThemeProvider>
        );
};

        export default App;
