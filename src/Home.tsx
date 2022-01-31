import { useEffect, useMemo, useState, useCallback } from 'react';
import * as anchor from '@project-serum/anchor';

import { CollectionProps, MintProps } from './MintSelection';
import styled from 'styled-components';
import { Container, Select, Snackbar, FormControl, InputLabel, MenuItem } from '@material-ui/core';

import { toDate, formatNumber } from './utils';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
import { MintCountdown } from './MintCountdown';
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

const ConnectButton = styled(WalletDialogButton)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
`;


const MintContainer = styled.div``; // add your owns styles here


// export interface HomeProps {

// }

export const Home: React.FC<{ collections: CollectionProps[], props: MintProps }> = ({ collections, props }) => {
  const twitter = "https://twitter.com/Send4Fren"
  const discord = "https://discord.gg/hW4BmVdQ"
  const instagram = "https://www.instagram.com/send4fren/"

  // const [isUserMinting, setIsUserMinting] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  // const [candyMachine1, setCandyMachine1] = useState<CandyMachineAccount>()
  // const [candyMachine2, setCandyMachine2] = useState<CandyMachineAccount>()


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
  const refreshCandyMachineState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }
    if (collections[0].collection[0].id) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          collections[0].collection[0].id,
          props.connection,
        );
        setCandyMachine(cndy);
      } catch (e) {
        console.log('There was a problem fetching Candy Machine state');
        console.log(e);
      }
    }
    // await setMachine(theme.id, setCandyMachine0, anchorWallet)
    // await setMachine(theme.collection[1].id, setCandyMachine1, anchorWallet)
    // await setMachine(theme.collection[2].id, setCandyMachine2, anchorWallet)
  }, [
    anchorWallet,
    collections[0].collection[0].id,
    // props.collection[1].id,
    // props.collection[2].id,
    props.connection
  ]);

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    collections[0].collection[0].id,
    props.connection,
    refreshCandyMachineState,
  ]);

  const selectCollections = collections.map(col =>
    (<option value="valentines">{col.title}</option>)
  )
  return (
    <Container>
      <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease"
        role="banner" className="navbar w-nav">
        <div className="container-3 w-container">
          <a href="#" className="brand-2 w-nav-brand"><img src="images/Frame-15.svg" loading="lazy" alt="" /></a>
          <a href="#" className="brand w-nav-brand">
            <h3 className="s4f_h3 s4f_logo_title">send 4 fren</h3>
          </a>
          <nav role="navigation" className="nav-menu w-nav-menu">
            <a href="index.html" aria-current="page" className="s4f_nav_link w-nav-link w--current">Home</a>
            <a href="about.html" className="s4f_nav_link w-nav-link"><span>About</span></a>
            <a href="about.html" className="s4f_nav_link w-nav-link">Instructions</a>
            <a href="#mint-start" className="s4f_mint_button s4f_nav_version w-nav-link">mint now</a>
            <div className="s4f_socials_array s4f_menu w-row">
              <div className="s4f_socials w-col w-col-4">
                <a href={twitter} target="_blank">
                  <img src="images/Twitter-Icon.png" loading="lazy" alt="" />
                </a>
              </div>
              <div className="s4f_socials w-col w-col-4" >
                <a href={discord} target="_blank">
                  <img src="images/Discord-Icon.png" loading="lazy" alt="" />
                </a>
              </div>
              <div className="s4f_socials w-col w-col-4">
                <a href={instagram} target="_blank">
                  <img src="images/Instagram-Icon.png" loading="lazy" alt="" />
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
              <h1 className="s4f_h2">Save paper, make it last forever on the blockchain</h1>
            </div>
          </div>
          <div className="s4f_status w-row">
            <div className="s4f_banner_column w-col w-col-4">
              <h3 className="s4f_h3">Valentine&#x27;s Day Set</h3>
            </div>
            <div className="s4f_banner_column w-col w-col-4">
              <MintCountdown date={toDate(
                candyMachine?.state.goLiveDate
                  ? candyMachine?.state.goLiveDate
                  : candyMachine?.state.isPresale
                    ? new anchor.BN(new Date().getTime() / 1000)
                    : undefined,
              )}
                style={{ justifyContent: 'flex-end' }}
                status={
                  !candyMachine?.state?.isActive || candyMachine?.state?.isSoldOut
                    ? 'COMPLETED'
                    : candyMachine?.state.isPresale
                      ? 'PRESALE'
                      : 'LIVE'
                }/>
            </div>
            <div className="s4f_banner_column w-col w-col-4">
              <a href="#mint-start" className="s4f_hero_button w-button">start sending</a>
            </div>
          </div>
        </div>
      </div>
      <div className="section-3 wf-section">
        <div className="div-block-9">
          <div className="s4f_socials_array w-row">
            <div className="s4f_socials w-col w-col-4">
              <a href={twitter} target="_blank">
                <img src="images/Twitter-Icon.png" loading="lazy" alt="" />
              </a>
            </div>
            <div className="s4f_socials w-col w-col-4">
              <a href={discord} target="_blank">
                <img src="images/Discord-Icon.png" loading="lazy" alt="" />
              </a>
            </div>
            <div className="s4f_socials w-col w-col-4">
              <a href={instagram} target="_blank"><img
                src="images/Instagram-Icon.png" loading="lazy" alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <section id="mint-start" className="s4f_minting_start wf-section">
        <div className="w-container">
          <div className="columns-11 w-row">
            <div className="column-8 w-col w-col-6 w-col-small-6">
              <div className="form-block-2 w-form">
                <form id="email-form-3" name="email-form-3" data-name="Email Form 3" className="form-3" action=''><select id="CollectionField" name="CollectionField" data-name="CollectionField" className="select-field w-select">
                  {/* <option value="">choose a collection</option>
                  <option value="valentines">Valentine&#x27;s Day</option>
                  <option value="Second">Second choice</option>
                  <option value="Third">Third choice</option> */}
                  {selectCollections}
                </select></form>
                {/* <div className="w-form-done">
                  <div>Thank you! Your submission has been received!</div>
                </div>
                <div className="w-form-fail">
                  <div>Oops! Something went wrong while submitting the form.</div>
                </div> */}
              </div>
              <h3 className="s4f_h3 subheading">{collections[0].subtitle}</h3>
              <p className="s4f_par">{collections[0].description}</p>
            </div>
            <div className="column-10 w-col w-col-6 w-col-small-6"><img src={collections[0].imgSrc} loading="lazy"
              sizes="(max-width: 479px) 100vw, (max-width: 767px) 32vw, (max-width: 991px) 247.796875px, 322px"
              srcSet={collections[0].imgSrcSet} alt=""
              className="image-2" /></div>
          </div>
        </div>
      </section>
      {/* <div className="s4f_mint wf-section">
        {/* <div className="w-container">

          <div className="div-block-3">
            <div className="columns-6 w-row">
              <div className="s4f_minted_card w-col w-col-6"><img src="images/Valentines-Example.png" loading="lazy"
                sizes="100vw" srcSet="images/Valentines-Example-p-500.png 500w, images/Valentines-Example.png 520w" alt=""
                className="image-3" /></div>
              <div className="column-9 w-col w-col-6">
                <a href="#" className="s4f_sol_exp">click here to see transaction on Solana Explorer!</a>
                <h1 className="s4f_h3">share on</h1>
                <div className="div-block-7">
                  <a href="#" className="s4f_button twitter w-button">Twitter</a>
                  <a href="#" className="s4f_button facebook w-button">Facebook</a>
                  <a href="#" className="s4f_button messenger w-button">Messenger</a>
                  <a href="#" className="s4f_button instagram w-button">Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </div> */}

    </Container>
  )
};


export default Home;
