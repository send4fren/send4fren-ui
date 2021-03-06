import { useEffect, useMemo, useState, useCallback, SyntheticEvent, useRef } from 'react';
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  getCandyMachineState,
  mintOneToken,
} from './candy-machine';
import * as anchor from '@project-serum/anchor';
import { programs } from "@metaplex/js"

import styled from 'styled-components';
import { Container, Link, Snackbar, CircularProgress, Box } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { PublicKey } from '@solana/web3.js';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
import { AlertState } from './utils';
import { Header } from './Header';
import { MintButton } from './MintButton';
import { GatewayProvider } from '@civic/solana-gateway-react';
import { CastConfetti } from './Confetti';
import { FormControl, Input, InputAdornment, FormHelperText, OutlinedInput } from '@material-ui/core';
import { DisplayDate } from './DisplayDate';
import Grid from '@material-ui/core/Grid';
// import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';
import {
  // EmailShareButton,
  FacebookShareButton,
  // HatenaShareButton,
  // InstapaperShareButton,
  // LineShareButton,
  // LinkedinShareButton,
  // LivejournalShareButton,
  // MailruShareButton,
  // OKShareButton,
  // PinterestShareButton,
  // PocketShareButton,
  RedditShareButton,
  // TelegramShareButton,
  // TumblrShareButton,
  TwitterShareButton,
  // ViberShareButton,
  // VKShareButton,
  // WhatsappShareButton,
  // WorkplaceShareButton
} from "react-share";

import {
  // EmailIcon,
  FacebookIcon,
  // FacebookMessengerIcon,
  // HatenaIcon,
  // InstapaperIcon,
  // LineIcon,
  // LinkedinIcon,
  // LivejournalIcon,
  // MailruIcon,
  // OKIcon,
  // PinterestIcon,
  // PocketIcon,
  RedditIcon,
  // TelegramIcon,
  // TumblrIcon,
  TwitterIcon,
  // ViberIcon,
  // VKIcon,
  // WeiboIcon,
  // WhatsappIcon,
  // WorkplaceIcon
} from "react-share";

// Style for the connect button
export const ConnectButton = styled(WalletDialogButton)`
text-align: center;
    width: 95%;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #f7891e;
  box-shadow: 3px 3px 4px 0 #3a3a3a;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 25px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  :hover {
    background: #eb7500;
    box-shadow: 0px 6px 0 #c06d19;
  }
  :active {
    background-color: #f7891e;
    box-shadow: 0 2px #442506;
    transform: translateY(2px);
  }
`;


// Minting information necessary to run the candy machine
// collection holds each individual candy machine
export interface MintProps {
  connection: anchor.web3.Connection;
  startDate: number;
  txTimeout: number;
  rpcHost: string;
}

type MintInfo = MintProps

// Holds the theme information. i.e. Nice, Naughty, Savage 
export interface ThemeProps {
  name: string,
  description: string
  imgSrc: string,
  id?: anchor.web3.PublicKey,
  startDate?: Date,
  endDate?: Date
}

export interface CollectionProps {
  themes: ThemeProps[];
  title: string;
  subtitle: string;
  description: string;
  imgSrc: string;
  startDate?: Date;
  endDate?: Date;

}

export interface PhantomProps {
  isUserMinting: boolean;
  setIsUserMinting: React.Dispatch<React.SetStateAction<boolean>>;
  rpcUrl: string;
  wallet: WalletContextState;
  anchorWallet: anchor.Wallet | undefined;

}

const facebookStyle = {
  backgroundColor: "#3b5998",

  // width: "100%",
  borderRadius: "35px",
  fontSize: "24px",
  marginTop: "5px",
  marginBottom: "5px",
  backgroundSize: "auto",
  backgroundPosition: "10px 0px",
  // padding: "5px",
  fontFamily: "'Varela Round', sans-serif",
  boxShadow: "3px 3px 4px 0 #3a3a3a",
  color: "white",
  // display: "flex",
  // alignItems: "center",
  // justifyContent: "center"
}

const twitterStyle = {
  backgroundColor: "#00acee",
  // width: "100%",
  borderRadius: "35px",
  fontSize: "24px",
  marginTop: "5px",
  marginBottom: "5px",
  backgroundSize: "auto",
  backgroundPosition: "10px 0px",
  // padding: "5px",
  fontFamily: "'Varela Round', sans-serif",
  boxShadow: "3px 3px 4px 0 #3a3a3a",
  color: "white",
  // display: "flex",
  // alignItems: "center",
  // justifyContent: "center"
  // alignItems: "center",
  // alignContent: "center",
  // margin: "auto"
}

const redditStyle = {
  backgroundColor: "#FF4301",
  // width: "100%",
  borderRadius: "35px",
  fontSize: "24px",
  marginTop: "5px",
  marginBottom: "5px",
  backgroundSize: "auto",
  backgroundPosition: "10px 0px",
  // padding: "5px",
  fontFamily: "'Varela Round', sans-serif",
  boxShadow: "3px 3px 4px 0 #3a3a3a",
  color: "white",
  // display: "flex",
  // alignItems: "center",
  // justifyContent: "center"
}

interface CandyMutualProps {
  // machine: CandyMachineAccount | undefined,
  // onMint: Promise<void>,
  isUserMinting: boolean,
  alertState: AlertState,
  setIsUserMinting: React.Dispatch<React.SetStateAction<boolean>>,
  setAlertState: React.Dispatch<React.SetStateAction<AlertState>>,
  rpcUrl: string,
  wallet: WalletContextState,
  anchorWallet: anchor.Wallet | undefined,
  txId: string | undefined,
  setTxId: React.Dispatch<React.SetStateAction<string | undefined>>
  recipTxId: string | undefined,
  setRecipTxId: React.Dispatch<React.SetStateAction<string | undefined>>
  mintSuccess: boolean,
  setMintSuccess: React.Dispatch<React.SetStateAction<boolean>>,
}

export const DisplayCandyMachine = (candyMachine: CandyMachineAccount | undefined, mutual: CandyMutualProps, info: MintProps, destination: string | undefined) => {
  // REMOVE LATER
  // mutual.setTxId("2cshdLj3QCMfnvp3ihaKCMq2o3L1Mr64jBTYP7N8Lr4JArBdSHLpFKRrLegj6pv6K2SLFjtM7fncr5LCVaopFMvN")




  // REMEMBER TO REMOVE
  // mutual.setTxId("2UWNiMFMHy1gmP7Yd2EmsFn812m6BDndcSv77Z8wcTzN9QCZFZybByzX9vTFVF7mBYo8e7PiwRJRqSqHCco1Jb7x")
  // mutual.setMintSuccess(true)


  return (
    <Container >
      {!mutual.wallet.connected ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ConnectButton>Connect wallet</ConnectButton>
        </div>

      ) : (
        <>
          <Header candyMachine={candyMachine} reloadWhen={mutual.isUserMinting} />
          <div style={{ width: "100%" }}>
            <div>
              {candyMachine?.state.isActive &&
                candyMachine?.state.gatekeeper &&
                mutual.wallet.publicKey &&
                mutual.wallet.signTransaction ? (
                <GatewayProvider
                  wallet={{
                    publicKey:
                      mutual.wallet.publicKey ||
                      new PublicKey(CANDY_MACHINE_PROGRAM),
                    //@ts-ignore
                    signTransaction: mutual.wallet.signTransaction,
                  }}
                  gatekeeperNetwork={
                    candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                  }
                  clusterUrl={mutual.rpcUrl}
                  options={{ autoShowModal: false }}
                >
                  <MintButton
                    candyMachine={candyMachine}
                    isMinting={mutual.isUserMinting}
                    onMint={() => OnMint(candyMachine, mutual, info, destination)}
                  />
                </GatewayProvider>
              ) : (
                <MintButton
                  candyMachine={candyMachine}
                  isMinting={mutual.isUserMinting}
                  onMint={() => OnMint(candyMachine, mutual, info, destination)}
                />
              )}
              <MintFinish recipTxId={mutual?.recipTxId} txId={mutual?.txId} connection={info.connection} mutual={mutual} />

            </div>
          </div>
        </>
      )}
      <Snackbar
        open={mutual.alertState.open}
        autoHideDuration={6000}
        onClose={() => mutual.setAlertState({ ...mutual.alertState, open: false })}
      >
        <Alert
          onClose={() => mutual.setAlertState({ ...mutual.alertState, open: false })}
          severity={mutual.alertState.severity}
        >
          {mutual.alertState.message}
        </Alert>
      </Snackbar>
    </Container>
  )
};

// What happens after the mint button has been pressed
const OnMint = async (candyMachine: CandyMachineAccount | undefined, mutual: CandyMutualProps, info: MintProps, destination: string | undefined) => {
  try {
    mutual.setIsUserMinting(true);
    document.getElementById('#identity')?.click();
    if (mutual.wallet.connected && candyMachine?.program && mutual.wallet.publicKey) {
      if (destination) { }
      // const destPubKey = new PublicKey(destination)
      const mintTxIds = (
        await mintOneToken(candyMachine, mutual.wallet.publicKey, (destination ? (new PublicKey(destination)) : (undefined)))
      );
      const mintTxId = mintTxIds[mintTxIds.length - 1];
      mutual.setTxId(mintTxId);
      mutual.setRecipTxId(mintTxIds[0]);

      let status: any = { err: true };
      if (mintTxId) {
        status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          info.txTimeout,
          info.connection,
          true,
        );
      }

      if (status && !status.err) {
        mutual.setMintSuccess(true)
        mutual.setAlertState({
          open: true,
          message: 'Congratulations! Mint succeeded!',
          severity: 'success',
        });
      } else {
        mutual.setAlertState({
          open: true,
          message: 'Mint failed! Please try again!',
          severity: 'error',
        });
      }
    }
  } catch (error: any) {
    let message = error.msg || 'Minting failed! Please try again!';
    if (!error.msg) {
      if (!error.message) {
        message = 'Transaction Timeout! Please try again.';
      } else if (error.message.indexOf('0x137')) {
        message = `SOLD OUT!`;
      } else if (error.message.indexOf('0x135')) {
        message = `Insufficient funds to mint. Please fund your wallet.`;
      }
    } else {
      if (error.code === 311) {
        message = `SOLD OUT!`;
        window.location.reload();
      } else if (error.code === 312) {
        message = `Minting period hasn't started yet.`;
      }
    }

    mutual.setAlertState({
      open: true,
      message,
      severity: 'error',
    });
  } finally {
    mutual.setIsUserMinting(false);
  }
};

// Returns [candyMachine, onMintCandyMachine, txId]
const CreateCandyMachine = (candyId: anchor.web3.PublicKey | undefined, mutual: CandyMutualProps, info: MintProps) => {
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const rpcUrl = info.rpcHost;
  const refreshCandyMachineState = useCallback(async () => {
    if (!mutual.anchorWallet) {
      return;
    }
    if (candyId) {
      try {
        const cndy = await getCandyMachineState(
          mutual.anchorWallet,
          candyId,
          info.connection,
        );
        setCandyMachine(cndy);
      } catch (e) {
        console.log('There was a problem fetching Candy Machine state');
        console.log(e);
      }
    }
  }, [
    mutual.anchorWallet,
    candyId,
    info.connection
  ]);

  // For automatic refreshing
  useEffect(() => {
    refreshCandyMachineState();
  }, [
    mutual.anchorWallet,
    candyId,
    info.connection,
    refreshCandyMachineState,
    mutual.setTxId,
    mutual.txId
  ]);

  return candyMachine
}

export const MintSection: React.FC<{ allCollections: CollectionProps[], info: MintInfo, phantom: PhantomProps }> = ({ allCollections, info, phantom }) => {

  const idxRef = 0
  const [selectedCollection, setSelectedCollection] = useState<number>(0);
  const [selectedCandyMachine, setSelectedCandyMachine] = useState<CandyMachineAccount | undefined>()
  const [txId, setTxId] = useState<string>();
  const [recipTxId, setRecipTxId] = useState<string>();
  const [theme, setTheme] = useState<number>();
  const [mintSuccess, setMintSuccess] = useState(false)

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });

  // Candy Machine
  const mutual: CandyMutualProps = {
    isUserMinting: phantom.isUserMinting,
    alertState: alertState,
    setIsUserMinting: phantom.setIsUserMinting,
    setAlertState: setAlertState,
    rpcUrl: phantom.rpcUrl,
    wallet: phantom.wallet,
    anchorWallet: phantom.anchorWallet,
    txId: txId,
    setTxId: setTxId,
    recipTxId: txId,
    setRecipTxId: setTxId,
    mintSuccess: mintSuccess,
    setMintSuccess: setMintSuccess
  }



  // const generateMachine = () => {
  //   return [
  //     CreateCandyMachine(allCollections[selectedCollection].themes[0].id, mutual, info),
  //     CreateCandyMachine(allCollections[selectedCollection].themes[1].id, mutual, info),
  //     CreateCandyMachine(allCollections[selectedCollection].themes[2].id, mutual, info)
  //   ]
  // }

  const machines = [
    CreateCandyMachine(allCollections[selectedCollection].themes[0].id, mutual, info),
    CreateCandyMachine(allCollections[selectedCollection].themes[1].id, mutual, info),
    CreateCandyMachine(allCollections[selectedCollection].themes[2].id, mutual, info)
  ]

  // Show Collection Section
  // Show Theme Selection 
  // Show Allocation section 
  // Show Post Mint 
  const [showThemes, setShowThemes] = useState(<div></div>)
  // const [available, setAvailable] = useState(false)

  return (
    <div>
      <MintCollection allCollections={allCollections} setter={setSelectedCollection} getter={selectedCollection} candyMachine={machines[idxRef]} />
      {showThemes}
      <MintTheme allCandyMachines={machines} allThemes={allCollections[selectedCollection].themes} mutual={mutual} info={info} idxRef={idxRef} />
    </div>
  );
}

// Display the collection and allow the user to select 
export const MintCollection: React.FC<{ allCollections: CollectionProps[], setter: React.Dispatch<React.SetStateAction<number>>, getter: number, candyMachine: CandyMachineAccount | undefined }> = (
  { allCollections, getter, setter, candyMachine }
) => {
  const [changed, setChanged] = useState(false)
  const [subtitle, setSubtitle] = useState<string>(allCollections[0].subtitle)
  const [description, setDescription] = useState<string>(allCollections[0].description)
  const [image, setImage] = useState<string>(allCollections[0].imgSrc)
  const showCollections = allCollections.map((col, index) =>
    (<option value={index} key={index}>{col.title}</option>)
  )
  useEffect(() => {
    if (changed) {
      console.log('Changed')
      setChanged(false)
    }
  }, [changed, setChanged])

  return (
    <section id="mint-start" className="s4f_minting_start wf-section">
      <div className="w-container">
        <div className="columns-11 w-row">
          <div className="column-8 w-col w-col-6 w-col-small-6">
            <div className="form-block-2 w-form">
              <form id="email-form-3" name="email-form-3" data-name="Email Form 3" className="form-3" action=''>
                <select onChange={(selected: React.ChangeEvent<HTMLSelectElement>,): void => {
                  const idx = parseInt(selected.target.value)
                  setter(parseInt(selected.target.value));
                  setSubtitle(allCollections[idx].subtitle);
                  setDescription(allCollections[idx].description);
                  setImage(allCollections[idx].imgSrc)
                }

                } id="CollectionField" name="CollectionField" data-name="CollectionField" className="select-field w-select">
                  {showCollections}
                </select></form>
            </div>
            <div>
              <h3 className="s4f_h3 subheading">{subtitle}</h3>
              <p className="s4f_par">{description}</p>
              <h4 className='s4f_h4'>Start Date</h4>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DisplayDate date={allCollections[getter].startDate} />
              </div>
              <h4 className='s4f_h4'>End Date</h4>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <DisplayDate date={allCollections[getter].endDate} />
              </div>


            </div>
          </div>
          <div className="column-10 w-col w-col-6 w-col-small-6"><img src={image} loading="lazy" alt="" className="image-2" />
            {/* sizes="(max-width: 479px) 100vw, (max-width: 767px) 32vw, (max-width: 991px) 247.796875px, 322px" */}
            <div style={{ display: 'flex', justifyContent: 'center', position: "absolute", top: "35%" }} >
            </div>
          </div>
        </div>

      </div>

    </section >
  )
}

// Display the themes and allow the user to select 
export const MintTheme: React.FC<{ allCandyMachines: (CandyMachineAccount | undefined)[], allThemes: ThemeProps[], mutual: CandyMutualProps, info: MintProps, idxRef: number }> = ({
  allCandyMachines, allThemes, mutual, info, idxRef
}) => {
  // const idxRef = 1
  const [recipient, setRecipient] = useState<number>(0)
  // if (allCandyMachines[1]?.state.isPresale) {
  const noTheme = (<div><img
    src="/images/blankCard.svg" loading="lazy" width="66" sizes="(max-width: 479px) 76vw, 66px"
    alt="" className="image-13" />
    <div className="s4f_h3">Theme</div>
    <p className="s4f_par s4f_theme_description">Not yet available!</p></div>)

  const showTheme = (index: number) => {
    return (<div >
      <img
        src={allThemes[index].imgSrc} loading="lazy" width="66" sizes="(max-width: 479px) 76vw, 66px"
        // srcSet={allThemes[index].imgSrcSet}
        alt="" className="image-13" />
      <div className="s4f_h3">{allThemes[index].name}</div>
      <p className="s4f_par s4f_theme_description">{allThemes[index].description}</p> </div>)
  }
  return (
    <div id="theme" style={{ marginTop: "50px" }}>

      {true ?
        (< div className="s4f_mint wf-section" >
          <div className="w-container">
            <h2 className="s4f_h3">choose your surprise</h2>
            <div className="div-block-5">
              <div data-current="Tab 1" data-easing="ease" data-duration-in="300" data-duration-out="100"
                className="s4f_tabs w-tabs">
                <div className="s4f_theme_options w-tab-menu">
                  <a data-w-tab="Tab 1" className="s4f_theme_tab w-inline-block w-tab-link w--current">
                    {showTheme(0)}
                  </a>
                  <a data-w-tab="Tab 2" className="s4f_theme_tab w-inline-block w-tab-link" >
                    {showTheme(1)}
                  </a>
                  <a data-w-tab="Tab 3" className="s4f_theme_tab w-inline-block w-tab-link">
                    {showTheme(2)}
                  </a>
                </div>
                <div className="w-tab-content">

                  <div data-w-tab="Tab 1" className="w-tab-pane w--tab-active">

                    <MintRecipient candyMachine={allCandyMachines[0]} mutual={mutual} info={info} />

                  </div>
                  <div data-w-tab="Tab 2" className="w-tab-pane">
                    <MintRecipient candyMachine={allCandyMachines[1]} mutual={mutual} info={info} />
                  </div>
                  <div data-w-tab="Tab 3" className="w-tab-pane">
                    <MintRecipient candyMachine={allCandyMachines[2]} mutual={mutual} info={info} />
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>) : (<div />)}
      {/* <TwitterShareButton style={twitterStyle} url="https://tmqnfr7jra6kjkwkbw2b7sh7t4s6srdvhk3paibcn7vq37yh4jxa.arweave.net/myDSx-mIPKSqyg20H8j_nyXpRHU6tvAgIm_rDf8H4m4/?ext=png" title="yuh"
                    via='send4fren'
                    related={['send4fren']}
                    hashtags={['send4fren', 'nft', 'nftart', 'crypto', 'weeb', 'celebration', 'greetingcards', 'hallmark', 'solana', 'investing']}>
                    <TwitterIcon size={40} round={true} />
      </TwitterShareButton>
      <meta name="twitter:image" content="https://tmqnfr7jra6kjkwkbw2b7sh7t4s6srdvhk3paibcn7vq37yh4jxa.arweave.net/myDSx-mIPKSqyg20H8j_nyXpRHU6tvAgIm_rDf8H4m4/?ext=png"></meta>

      <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-show-count="false">Tweet
      
      </a>
      <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script> */}
      <meta name="twitter:image" content="https://tmqnfr7jra6kjkwkbw2b7sh7t4s6srdvhk3paibcn7vq37yh4jxa.arweave.net/myDSx-mIPKSqyg20H8j_nyXpRHU6tvAgIm_rDf8H4m4/?ext=png"></meta>

    </div>)
  // }
  // return (<div></div>)
}

// Display the recipient options and allow user to select the option 
export const MintRecipient: React.FC<{ candyMachine: CandyMachineAccount | undefined, mutual: CandyMutualProps, info: MintProps }> = (
  { candyMachine, mutual, info }
) => {
  const [recipientAddress, setRecipientAddress] = useState<string>()

  // const related = ['send4fren']
  return (
    <div className="div-block-5" id="process-mint">
      <h2 className="s4f_h3">for who?</h2>
      <div data-current="Tab 2" data-easing="ease" data-duration-in="300" data-duration-out="100" className="s4f_tabs s4f_tabs_mint w-tabs">
        <div className="s4f_destination w-tab-menu">
          <a data-w-tab="Tab 1" className="s4f_destination s4f_theme_tab s4f_phone_tab w-inline-block w-tab-link w--current">
            <div className="s4f_h3">send 4 fren</div>
          </a>
          <a data-w-tab="Tab 2" className="s4f_theme_tab s4f_destination s4f_phone_tab w-inline-block w-tab-link">
            <div className="s4f_h3">send 4 me</div>
          </a>
        </div>
        <div className="tabs-content w-tab-content">
          <div data-w-tab="Tab 1" className="s4f_destination_mint w-tab-pane">
            <div >
              <h2 className="s4f_h3">enter your frens address</h2>
              <Box component="form" style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", paddingBottom: "10px" }}>
                <FormControl style={{ width: "90%", textAlign: "center", background: "white", borderRadius: "25px", padding: "10px" }}>
                  <Input style={{ color: "black" }} placeholder="solana address" onChange={(
                    ev: React.ChangeEvent<HTMLInputElement>,
                  ): void => {
                    setRecipientAddress(ev.target.value)
                    // console.log(address)
                  }} />
                  {/* <MyFormHelperText /> */}
                </FormControl>
                {/* <TextField id="outlined-basic" label="your frens wallet address" variant="outlined" /> */}
                {/* <TextField id="filled-basic" label="your frens wallet address" style={{color: "white"}} inputProps={{disableUnderline: true}} /> */}
                {/* <TextField id="standard-basic" label="Standard" variant="standard" /> */}
              </Box>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", alignContent: "center" }}>
                {DisplayCandyMachine(candyMachine, mutual, info, recipientAddress)}
              </div>


            </div>
          </div>
          <div data-w-tab="Tab 2" className="s4f_destination_mint w-tab-pane w--tab-active">
            {DisplayCandyMachine(candyMachine, mutual, info, recipientAddress)}
          </div>
        </div>
      </div>
    </div>
  )
}

const MintFinish: React.FC<{ recipTxId: string | undefined, txId: string | undefined, connection: anchor.web3.Connection, mutual: CandyMutualProps }> = ({ recipTxId, txId, connection, mutual }) => {

  const [image, setImage] = useState<string>()
  const [found, setFound] = useState(false)
  const [isFinding, setIsFinding] = useState(false)
  const [loadText, setLoadText] = useState("finding photo on solana...")
  const [requested, setRequested] = useState(false)
  let [oldTxId, setOldTxId] = useState<string>()
  // if (txId) {
  // const getFileUrl = async () => {
  //   if (image) {
  //     return await fetch(image)
  //       .then((d) => {return d.blob() })
  //       .then((blob) => {
  //         return window.URL.createObjectURL(blob);
  //       })
  //   }

  // }
  // }
  // const [data, setData] = useState<(number | null | undefined)>();


  const getImageContent = () => {
    if (found) {
      return (<div style={{ display: 'flex', justifyContent: 'center' }}>
        <CastConfetti />
        {/* <a href={async (){await getFileUrl()}} download> */}
        <img src={image} loading="lazy" sizes="100vw" alt="" className="image-3" />
        {/* </a> */}
      </div>);
    } else if (isFinding) {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' , minHeight: "80vh"}}>
            <img src='images/emptyCard.svg' style={{ width: "90%" }} />
            <div style={{ display: 'flex', justifyContent: 'center', position: "absolute", top: "35%" }} >
              <h3 className="s4f_h3">pls wait! <br />{loadText}</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', position: "absolute", bottom: "40%" }} >
              <CircularProgress /></div>

          </div>
        </div>)
    }
    return;
  }

  const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

  const txInfo = (async () => {
    if (isFinding) {return}
    if (recipTxId && mutual.mintSuccess) {

      // Wait for a result 
      let result = await connection.getTransaction(recipTxId)
      setIsFinding(true)
      setFound(false)
      setRequested(true)
      while (!result) {
        try {
          await wait(1000)
          result = await connection.getTransaction(recipTxId)
        }
        catch (e) {
          console.log(e)
        }

      }
      console.log("Transaction found", result)
      setLoadText("found ur transaction baby")
      // Result found. look for the token
      if (result?.meta?.postTokenBalances) {
        let token = result.meta.postTokenBalances[0].mint
        console.log('Token found', token)
        setLoadText("found the photo! damn it looks good")
        // Look for NFT's inside wallet
        if (mutual.wallet?.publicKey) {
          // let tokenMetadata = await programs.metadata.Metadata.findDataByOwner(connection, mutual.wallet?.publicKey?.toString());

          let metadataPDA = await programs.metadata.Metadata.getPDA(new PublicKey(token));
          const tokenMetadata = await programs.metadata.Metadata.load(connection, metadataPDA);
          console.log("token Metadata", tokenMetadata)

          const photo = await fetch(tokenMetadata.data.data.uri).then(async (link) => {
            return await fetch(link.url).then((data) => {
              return data.json()
            })
          })
          setImage(photo.image)
          setFound(true)
          setRequested(false)
          setIsFinding(false)
          mutual.setMintSuccess(false)
          console.log("Image found", image)
          setLoadText("finding photo on solana...")
          setOldTxId(txId)
          // for (var nft of tokenMetadata) {
          //   // Locate the matching NFT of the one recently purchased
          //   if (nft.mint == token) {
          //     const image = await fetch(nft.data.uri).then(async (link) => {
          //       return await fetch(link.url).then((data) => {
          //         return data.json()
          //       })
          //     })
          //     setImage(image.image)
          //     setFound(true)
          //     mutual.setMintSuccess(false)
          //     console.log("Image found", image)
          //     setLoadText("finding photo on solana...")
          //     break
          //   }
          // }
        }
      }
    }
  })

  useEffect(() => {
    txInfo()
    // getImageContent()
  }, [txId, mutual.mintSuccess])

  const download = async () => {
    if (image) {
      await fetch(image, { method: 'GET', headers: { 'Content-Type': 'image/png' } })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 's4f_card.png');

          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link)
        })
    }

  }


  const quote = 'Speaking love in Web3 language'
  // const  image = 'https://iq4gqrdbgs7kn2uferjmodv2xclcrzeejgdfh6rccreujxpyorga.arweave.net/RDhoRGE0vqbqhSRSxw66uJYo5IRJhlP6IhRJRN34dEw/?ext=png'

  return (
    <div className="div-block-3">
      {
        txId ?
          (
            <div className="columns-11 w-row w-row" >
              <div className="s4f_minted_card w-col w-col-6" >
                {getImageContent()}
              </div>
              <div className="column-9 w-col w-col-6">

                {/* <button onClick={async () => txInfo()} >View</button> */}
                <a href={"https://explorer.solana.com/tx/" + txId} target="_blank" className="s4f_sol_exp" style={{textAlign: "center"}}>click here to see transaction on Solana Explorer!</a>
                <h1 className="s4f_h3">share on</h1>

                <Grid container direction="row" wrap="nowrap" style={{ width: "300px"}}>
                  {/* <Grid container direction="row" wrap="nowrap" > */}
                  <Grid container direction="row" wrap="nowrap">
                    <div>
                      <FacebookShareButton style={facebookStyle}
                        quote={quote}
                        hashtag='#send4fren'
                        url={image ? (image) : ''}>
                        <FacebookIcon size={60} round={true} />
                      </FacebookShareButton>
                    </div>
                  </Grid>
                  <Grid container direction="row" wrap="nowrap">
                    <div>
                      <TwitterShareButton style={twitterStyle} url={image ? (image) : ''} title={quote}
                        via='send4fren'
                        related={['send4fren']}
                        hashtags={['send4fren', 'nft', 'nftart', 'crypto', 'weeb', 'celebration', 'greetingcards', 'hallmark', 'solana', 'investing']}>
                        <TwitterIcon size={60} round={true} />
                      </TwitterShareButton>
                    </div>
                  </Grid>
                  <Grid container direction="row" wrap="nowrap">
                    <div>
                      <RedditShareButton style={redditStyle} title={quote} url={image ? (image) : ''}>
                        <RedditIcon size={60} round={true} />
                      </RedditShareButton>
                    </div>
                  </Grid>
                  <Grid container direction="row" wrap="nowrap">
                    <div>
                      <button className='download-button' onClick={async () => await download()}>
                        <img src='/images/download.png' style={{ width: "22px" }} />
                      </button>
                    </div>
                  </Grid>
                  {/* </Grid> */}
                </Grid>

                <div className="div-block-7">



                </div>



              </div>
            </div >

          ) : (<div />)
      }


    </div>)

}



export default MintSection