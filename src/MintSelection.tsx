import { useEffect, useMemo, useState, useCallback } from 'react';
import {
    awaitTransactionSignatureConfirmation,
    CandyMachineAccount,
    CANDY_MACHINE_PROGRAM,
    getCandyMachineState,
    mintOneToken,
} from './candy-machine';
import * as anchor from '@project-serum/anchor';

import styled from 'styled-components';
import { Container, Snackbar } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
import { AlertState } from './utils';
import { Header } from './Header';
import { MintButton } from './MintButton';
import { GatewayProvider } from '@civic/solana-gateway-react';
import { toDate, formatNumber } from './utils';

// Style for the connect button
const ConnectButton = styled(WalletDialogButton)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background-color: #f7891e;
  box-shadow: 3px 3px 4px 0 #3a3a3a;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 25px;
`;

// Style for the Mint button
const MintContainer = styled.div``; // add your owns styles here

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
    imgSrcSet: string,
    id?: anchor.web3.PublicKey
}

// The mint machine produces the box showing remaining, price and the mint button
const MintMachine: React.FC<{ theme: ThemeProps, props: MintProps }> = ({
    theme, props
}) => {
    // Variables
    const [isUserMinting, setIsUserMinting] = useState(false);
    const [candyMachine0, setCandyMachine0] = useState<CandyMachineAccount>();
    // const [candyMachine1, setCandyMachine1] = useState<CandyMachineAccount>()
    // const [candyMachine2, setCandyMachine2] = useState<CandyMachineAccount>()

    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: '',
        severity: undefined,
    });

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
        if (theme.id) {
            try {
                const cndy = await getCandyMachineState(
                    anchorWallet,
                    theme.id,
                    props.connection,
                );
                setCandyMachine0(cndy);
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
        theme.id,
        // props.collection[1].id,
        // props.collection[2].id,
        props.connection
    ]);

    const onMint0 = () => { return onMint(candyMachine0) };
    // const remaining = candyMachine0.state.itemsRemaining
    // const price = getMintPrice(candyMachine0)

    // Constants
    const onMint = async (candyMachine: CandyMachineAccount | undefined) => {
        try {
            setIsUserMinting(true);
            document.getElementById('#identity')?.click();
            if (wallet.connected && candyMachine?.program && wallet.publicKey) {
                const mintTxId = (
                    await mintOneToken(candyMachine, wallet.publicKey)
                )[0];

                let status: any = { err: true };
                if (mintTxId) {
                    status = await awaitTransactionSignatureConfirmation(
                        mintTxId,
                        props.txTimeout,
                        props.connection,
                        true,
                    );
                }

                if (status && !status.err) {
                    setAlertState({
                        open: true,
                        message: 'Congratulations! Mint succeeded!',
                        severity: 'success',
                    });
                } else {
                    setAlertState({
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

            setAlertState({
                open: true,
                message,
                severity: 'error',
            });
        } finally {
            setIsUserMinting(false);
        }
    };

    useEffect(() => {
        refreshCandyMachineState();
    }, [
        anchorWallet,
        theme.id,
        props.connection,
        refreshCandyMachineState,
    ]);

    // // Create an array of onMint functions for the number of candyMachines
    // let onMintArray = useState<CandyMachineAccount>()[]
    // for (let i = 0; i < props.collection.length; i++){

    // }


    return (

        <Container>
            <h2 className="s4f_h3">{theme.name}</h2>
            <Container maxWidth="xs" style={{ position: 'relative' }}>
                <Paper
                    style={{ padding: 24, backgroundColor: '#151A1F', borderRadius: 6 }}
                >
                    {!wallet.connected ? (
                        <ConnectButton>Connect Wallet</ConnectButton>
                    ) : (
                        <>
                            <Header candyMachine={candyMachine0} />
                            <MintContainer>
                                {candyMachine0?.state.isActive &&
                                    candyMachine0?.state.gatekeeper &&
                                    wallet.publicKey &&
                                    wallet.signTransaction ? (
                                    <GatewayProvider
                                        wallet={{
                                            publicKey:
                                                wallet.publicKey ||
                                                new PublicKey(CANDY_MACHINE_PROGRAM),
                                            //@ts-ignore
                                            signTransaction: wallet.signTransaction,
                                        }}
                                        gatekeeperNetwork={
                                            candyMachine0?.state?.gatekeeper?.gatekeeperNetwork
                                        }
                                        clusterUrl={rpcUrl}
                                        options={{ autoShowModal: false }}
                                    >
                                        <MintButton
                                            candyMachine={candyMachine0}
                                            isMinting={isUserMinting}
                                            onMint={onMint0}
                                        />
                                    </GatewayProvider>
                                ) : (
                                    <MintButton
                                        candyMachine={candyMachine0}
                                        isMinting={isUserMinting}
                                        onMint={onMint0}
                                    />
                                )}
                            </MintContainer>
                        </>
                    )}
                </Paper>
            </Container>

            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={() => setAlertState({ ...alertState, open: false })}
            >
                <Alert
                    onClose={() => setAlertState({ ...alertState, open: false })}
                    severity={alertState.severity}
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
        </Container>
    )

};

// Displays the screen where user can send to themselves or to friends.
const MintAllocation: React.FC<{ theme: ThemeProps, props: MintProps }> = ({
    theme, props
}) => {
    return (
        <div className="div-block-5">
            <h2 className="s4f_h3">for who?</h2>
            <div data-current="Tab 2" data-easing="ease" data-duration-in="300" data-duration-out="100" className="s4f_tabs s4f_tabs_mint w-tabs">
                <div className="s4f_destination w-tab-menu">
                    <a data-w-tab="Tab 1" className="s4f_destination s4f_theme_tab s4f_phone_tab w-inline-block w-tab-link">
                        <div className="s4f_h3">send 4 fren</div>
                    </a>
                    <a data-w-tab="Tab 2" className="s4f_theme_tab s4f_destination s4f_phone_tab w-inline-block w-tab-link w--current">
                        <div className="s4f_h3">send 4 me</div>
                    </a>
                </div>
                <div className="tabs-content w-tab-content">
                    <div data-w-tab="Tab 1" className="s4f_destination_mint w-tab-pane">
                        <div className="columns-7 w-row">
                            <div className="s4f_par">cannot send 4 fren yet :(</div>
                            <MintMachine theme={theme} props={props}></MintMachine>
                        </div>
                    </div>
                    <div data-w-tab="Tab 2" className="s4f_destination_mint w-tab-pane w--tab-active">
                        <MintMachine theme={theme} props={props}></MintMachine>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mint selection takes in the collection and shows the 3 themes.
// After the theme has been selected, the minting box will show. 
export const MintSelection: React.FC<{ collection: ThemeProps[], info: MintInfo }> = ({ collection, info }) => {
    // Variable definitions
    const [theme, setTheme] = useState(0)

    // Returning what should be shown 
    return (
        < div className="s4f_mint wf-section" >
            <div className="w-container">
                <h2 className="s4f_h3">choose your surprise</h2>
                <div className="div-block-5">
                    <div data-current="Tab 1" data-easing="ease" data-duration-in="300" data-duration-out="100"
                        className="s4f_tabs w-tabs">
                        <div className="s4f_theme_options w-tab-menu">
                            <a data-w-tab="Tab 1" className="s4f_theme_tab w-inline-block w-tab-link w--current" onClick={async () => { setTheme(0) }}><img
                                src={collection[0].imgSrc} loading="lazy" width="66" sizes="(max-width: 479px) 76vw, 66px"
                                srcSet={collection[0].imgSrcSet}
                                alt="" className="image-13" />
                                <div className="s4f_h3">{collection[0].name}</div>
                                <p className="s4f_par s4f_theme_description">{collection[0].description}</p>
                            </a>
                            <a data-w-tab="Tab 2" className="s4f_theme_tab w-inline-block w-tab-link" onClick={async () => { setTheme(1) }}><img src={collection[1].imgSrc}
                                loading="lazy" width="62" sizes="(max-width: 479px) 76vw, 62px"
                                srcSet={collection[1].imgSrcSet}
                                alt="" className="image-12" />
                                <div className="s4f_h3">{collection[1].name}</div>
                                <p className="s4f_par s4f_theme_description">{collection[1].description}</p>
                            </a>
                            <a data-w-tab="Tab 3" className="s4f_theme_tab w-inline-block w-tab-link" onClick={async () => { setTheme(2) }}><img
                                src={collection[2].imgSrc} loading="lazy" width="71" sizes="(max-width: 479px) 76vw, 71px"
                                srcSet={collection[2].imgSrcSet}
                                alt="" className="image-14" />
                                <div className="s4f_h3">{collection[2].name}</div>
                                <p className="s4f_par s4f_theme_description">{collection[2].description}</p>
                            </a>
                        </div>
                        <div className="w-tab-content">
                            <div data-w-tab="Tab 1" className="w-tab-pane w--tab-active">
                                <MintAllocation theme={collection[0]} props={info}></MintAllocation>
                            </div>
                            <div data-w-tab="Tab 2" className="w-tab-pane">
                                <MintAllocation theme={collection[1]} props={info}></MintAllocation>
                            </div>
                            <div data-w-tab="Tab 3" className="w-tab-pane">
                                <MintAllocation theme={collection[2]} props={info}></MintAllocation>
                            </div>
                        </div>
                    </div>

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
                </div>
            </div>
        </div>




    );
};

export default MintSelection