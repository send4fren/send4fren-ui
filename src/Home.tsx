import { useEffect, useMemo, useState, useCallback } from 'react';
import * as anchor from '@project-serum/anchor';

import { CollectionProps, MintProps, PhantomProps, MintSection, ConnectButton } from './MintSelection';
import styled from 'styled-components';
import { Container, Select, Snackbar, FormControl, InputLabel, MenuItem } from '@material-ui/core';

import { toDate, formatNumber } from './utils';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
import { CoolCountdown, MintCountdown } from './MintCountdown';
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  getCandyMachineState,
  mintOneToken,
} from './candy-machine';
import { AlertState } from './utils';
import { Header } from './Header';
import { MintButton } from './MintButton';
import { GatewayProvider } from '@civic/solana-gateway-react';
import { Grid } from '@material-ui/core';
// import { DimensionedExample } from './Confetti';

// import Fireworks from '@react-canvas-confetti'
// const ConnectButton = styled(WalletDialogButton)`
//   width: 100%;
//   height: 60px;
//   margin-top: 10px;
//   margin-bottom: 5px;
//   background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
//   color: white;
//   font-size: 16px;
//   font-weight: bold;
// `;



const MintContainer = styled.div``; // add your owns styles here


// export interface HomeProps {

// }

export const Home: React.FC<{ basedOnIdx: number, collections: CollectionProps[], props: MintProps }> = ({ basedOnIdx, collections, props }) => {
  const twitter = "https://twitter.com/Send4Fren"
  const discord = "https://discord.gg/hW4BmVdQ"
  const instagram = "https://www.instagram.com/send4fren/"

  const [isUserMinting, setIsUserMinting] = useState(false);
  const id = collections[0].themes[basedOnIdx].id
  const rpcUrl = props.rpcHost;
  const wallet = useWallet();
  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();

  const [mintText, setMintText] = useState<string>("Learn more");


  const refreshCandyMachineState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }
    if (id) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          id,
          props.connection,
        );
        setCandyMachine(cndy);
      } catch (e) {
        console.log('There was a problem fetching Candy Machine state');
        console.log(e);
      }
    }
    // await setMachine(theme.id, setCandyMachine0, anchorWallet)
    // await setMachine(theme.collection[basedOnIdx].id, setCandyMachine1, anchorWallet)
    // await setMachine(theme.collection[2].id, setCandyMachine2, anchorWallet)
  }, [
    anchorWallet,
    id,
    // props.collection[basedOnIdx].id,
    // props.collection[2].id,
    props.connection
  ]);

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    id,
    props.connection,
    refreshCandyMachineState,
  ]);

  const phantom: PhantomProps = {
    isUserMinting: isUserMinting,
    setIsUserMinting: setIsUserMinting,
    rpcUrl: rpcUrl,
    wallet: wallet,
    anchorWallet: anchorWallet
  }

  const selectCollections = collections.map(col =>
    (<option value="valentines">{col.title}</option>)
  )



  return (
    <div>
      <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease"
        role="banner" className="navbar w-nav">
        <div className="container-3 w-container">
          <a href="/" className="brand-2 w-nav-brand"><img src="images/Frame-15.svg" loading="lazy" alt="" /></a>
          <a href="/" className="brand w-nav-brand">
            <h3 className="s4f_h3 s4f_logo_title">send 4 fren</h3>
          </a>
          <nav role="navigation" className="nav-menu w-nav-menu">
            <a href="/" aria-current="page" className="s4f_nav_link w-nav-link w--current">Home</a>
            <a href="about#about" className="s4f_nav_link w-nav-link"><span>About</span></a>
            <a href="instruction#instruction" className="s4f_nav_link w-nav-link">Instructions</a>
            {/* {!wallet.connected ? (<a> <Container><ConnectButton>Connect wallet</ConnectButton></Container></a>) : (<a href="#mint-start" className="s4f_mint_button s4f_nav_version w-nav-link">mint now</a>)} */}
            <a href="#mint-start" className="s4f_mint_button s4f_nav_version w-nav-link">MINT</a>
            <div className="s4f_socials_array s4f_menu w-row">
              <div className="s4f_socials w-col w-col-4">
                <a href={twitter} target="_blank" >
                  <img src="images/twitter.png" loading="lazy" alt="" />
                </a>
              </div>
              <div className="s4f_socials w-col w-col-4" >
                <a href={discord} target="_blank">
                  <img src="images/discord.png" loading="lazy" alt="" />
                </a>
              </div>
              <div className="s4f_socials w-col w-col-4">
                <a href={instagram} target="_blank">
                  <img src="images/instagram.png" loading="lazy" alt="" />
                </a>
              </div>
            </div>
          </nav >
          <div className="menu-button w-nav-button">
            <div className="w-icon-nav-menu"></div>
          </div>
        </div>
      </div>
      <div className="section wf-section">
        <div className="container w-container">
          <div className="s4f_hero w-row">
            <div className="column-2 w-col w-col-6 w-col-small-6"><img src="images/NFT_Trial.png" loading="lazy"
              sizes="(max-width: 479px) 100vw, (max-width: 767px) 67vw, (max-width: 991px) 461.75762939453125px, 60vw"
              height=""
              srcSet="images/NFT_Trial-p-500.png 500w, images/NFT_Trial-p-800.png 800w, images/NFT_Trial-p-1080.png 1080w, images/NFT_Trial.png 1600w"
              alt="" className="image" /></div>
            <div className="column w-col w-col-6 w-col-small-6">
              <h1 className="s4f_h1"><strong>Send sumthin 4 a fren or sumthin 4 urself, u lonely fuk.</strong></h1>
              <h1 className="s4f_h2" style={{ marginBottom: "20px" }}>Save a tree from dying and send a S4F card instead</h1>
              <div style={{ width: "100%", borderRadius: "25px", background: "rgba(28,12,57,0.5)" }}>
                <h3 className="s4f_h3" style={{ marginTop: "20px", opacity: "100%" }}>Valentine&#x27;s Day Set</h3>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                  <CoolCountdown date={new Date('08 Feb 2022 00:00:00 UTC+11')} style={{ justifyContent: 'flex-end' }}
                    status={'OUT NOW'} setMintText={setMintText} />
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                  <a href="#mint-start" className="s4f_hero_button w-button">{mintText}</a>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="section-3 wf-section">
        <div className="div-block-9">
          <div className="s4f_socials_array w-row">
            <div className="s4f_socials w-col w-col-4">
              <a href={twitter} target="_blank">

                <img src="images/twitter.png" loading="lazy" alt="" />
              </a>
            </div>
            <div className="s4f_socials w-col w-col-4">
              <a href={discord} target="_blank">
                <img src="images/discord.png" loading="lazy" alt="" />
              </a>
            </div>
            <div className="s4f_socials w-col w-col-4">
              <a href={instagram} target="_blank"><img
                src="images/instagram.png" loading="lazy" alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-container">
        <h3 className="s4f_h3">
          More than just your typical NFT when you buy S4F</h3>
        <div className="s4f_par" >
          Our mission is to connect the NFT community together with a fun yet affordable avenue of NFT gift giving!
          <br /><br />Each card has been custom-made to suit the year's feel and emotion within the crypto community.
        </div>
        <div style={{ height: "20px" }} />
        <MintSection allCollections={collections} info={props} phantom={phantom}></MintSection>
        <div style={{ height: "50vh" }} />
      </div>
    </div>
  )
};


export default Home;
