import { useEffect, useMemo, useState, useCallback, SyntheticEvent, useRef } from 'react';
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
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
import { AlertState } from './utils';
import { Header } from './Header';
import { MintButton } from './MintButton';
import { GatewayProvider } from '@civic/solana-gateway-react';
import { toDate, formatNumber } from './utils';
import Typography from '@material-ui/core/Typography';
import { string } from 'prop-types';
import { LensTwoTone } from '@material-ui/icons';
import { StringLiteralLike } from 'typescript';

// Style for the connect button
export const ConnectButton = styled(WalletDialogButton)`
text-align: center;
    width: 100%;
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

export interface CollectionProps {
	themes: ThemeProps[];
	title: string;
	subtitle: string;
	description: string;
	imgSrc: string;
	imgSrcSet: string;
}

export interface PhantomProps {
	isUserMinting: boolean;
	setIsUserMinting: React.Dispatch<React.SetStateAction<boolean>>;
	rpcUrl: string;
	wallet: WalletContextState;
	anchorWallet: anchor.Wallet | undefined;

}
const DisplayMinted: React.FC<{ txId: string | undefined }> = (txId) => {
	const solanaTxLink = "https://explorer.solana.com/tx/" + txId

	const show = () => {
		if (txId !== undefined) {
			return (
				<div className="columns-6 w-row">
					<div className="s4f_minted_card w-col w-col-6"><img src="images/Valentines-Example.png" loading="lazy"
						sizes="100vw" srcSet="images/Valentines-Example-p-500.png 500w, images/Valentines-Example.png 520w" alt=""
						className="image-3" /></div>
					<div className="column-9 w-col w-col-6">
						<a href="#" className="s4f_sol_exp">{solanaTxLink}click here to see transaction on Solana Explorer!</a>
						<h1 className="s4f_h3">share on</h1>
						<div className="div-block-7">
							<a href="#" className="s4f_button twitter w-button">Twitter</a>
							<a href="#" className="s4f_button facebook w-button">Facebook</a>
							<a href="#" className="s4f_button messenger w-button">Messenger</a>
							<a href="#" className="s4f_button instagram w-button">Instagram</a>
						</div>
					</div>
				</div>
			)
		} else { (<div></div>) }
	}

	return (
		<div>{show()}</div>

	)
}

// REMOVING 
// The mint machine produces the box showing remaining, price and the mint button
// const MintMachine: React.FC<{ theme: ThemeProps, props: MintProps, phantom: PhantomProps }> = ({
//     theme, props, phantom
// }) => {
//     // Variables
//     // const [isUserMinting, setIsUserMinting] = useState(false);
//     const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
//     // const [candyMachine1, setCandyMachine1] = useState<CandyMachineAccount>()
//     // const [candyMachine2, setCandyMachine2] = useState<CandyMachineAccount>()

//     const [alertState, setAlertState] = useState<AlertState>({
//         open: false,
//         message: '',
//         severity: undefined,
//     });

//     // const rpcUrl = props.rpcHost;
//     // const wallet = useWallet();
//     // const anchorWallet = useMemo(() => {
//     //     if (
//     //         !wallet ||
//     //         !wallet.publicKey ||
//     //         !wallet.signAllTransactions ||
//     //         !wallet.signTransaction
//     //     ) {
//     //         return;
//     //     }

//     //     return {
//     //         publicKey: wallet.publicKey,
//     //         signAllTransactions: wallet.signAllTransactions,
//     //         signTransaction: wallet.signTransaction,
//     //     } as anchor.Wallet;
//     // }, [wallet]);
//     const refreshCandyMachineState = useCallback(async () => {
//         if (!phantom.anchorWallet) {
//             return;
//         }
//         if (theme.id) {
//             try {
//                 const cndy = await getCandyMachineState(
//                     phantom.anchorWallet,
//                     theme.id,
//                     props.connection,
//                 );
//                 setCandyMachine(cndy);
//             } catch (e) {
//                 console.log('There was a problem fetching Candy Machine state');
//                 console.log(e);
//             }
//         }
//         // await setMachine(theme.id, setCandyMachine0, anchorWallet)
//         // await setMachine(theme.collection[1].id, setCandyMachine1, anchorWallet)
//         // await setMachine(theme.collection[2].id, setCandyMachine2, anchorWallet)
//     }, [
//         phantom.anchorWallet,
//         theme.id,
//         // props.collection[1].id,
//         // props.collection[2].id,
//         props.connection
//     ]);

//     // props.connection.getTransaction()

//     const onMintCandyMachine = () => { return onMint(candyMachine) };
//     // const remaining = candyMachine0.state.itemsRemaining
//     // const price = getMintPrice(candyMachine0)

//     const [txId, setTxId] = useState<string>();

//     // Constants
//     const onMint = async (candyMachine: CandyMachineAccount | undefined) => {
//         try {
//             phantom.setIsUserMinting(true);
//             document.getElementById('#identity')?.click();
//             if (phantom.wallet.connected && candyMachine?.program && phantom.wallet.publicKey) {
//                 const mintTxId = (
//                     await mintOneToken(candyMachine, phantom.wallet.publicKey)
//                 )[0];
//                 setTxId(mintTxId);

//                 let status: any = { err: true };
//                 if (mintTxId) {
//                     status = await awaitTransactionSignatureConfirmation(
//                         mintTxId,
//                         props.txTimeout,
//                         props.connection,
//                         true,
//                     );
//                 }

//                 if (status && !status.err) {
//                     setAlertState({
//                         open: true,
//                         message: 'Congratulations! Mint succeeded!',
//                         severity: 'success',
//                     });
//                 } else {
//                     setAlertState({
//                         open: true,
//                         message: 'Mint failed! Please try again!',
//                         severity: 'error',
//                     });
//                 }
//             }
//         } catch (error: any) {
//             let message = error.msg || 'Minting failed! Please try again!';
//             if (!error.msg) {
//                 if (!error.message) {
//                     message = 'Transaction Timeout! Please try again.';
//                 } else if (error.message.indexOf('0x137')) {
//                     message = `SOLD OUT!`;
//                 } else if (error.message.indexOf('0x135')) {
//                     message = `Insufficient funds to mint. Please fund your wallet.`;
//                 }
//             } else {
//                 if (error.code === 311) {
//                     message = `SOLD OUT!`;
//                     window.location.reload();
//                 } else if (error.code === 312) {
//                     message = `Minting period hasn't started yet.`;
//                 }
//             }

//             setAlertState({
//                 open: true,
//                 message,
//                 severity: 'error',
//             });
//         } finally {
//             setIsUserMinting(false);
//         }
//     };

//     // For automatic refreshing
//     useEffect(() => {
//         refreshCandyMachineState();
//     }, [
//         anchorWallet,
//         theme.id,
//         props.connection,
//         refreshCandyMachineState,
//     ]);



//     const showMinted = () => {
//         if (txId) {
//             return (
//                 <div className="columns-6 w-row">
//                     <div className="s4f_minted_card w-col w-col-6"><img src="images/Valentines-Example.png" loading="lazy"
//                         sizes="100vw" srcSet="images/Valentines-Example-p-500.png 500w, images/Valentines-Example.png 520w" alt=""
//                         className="image-3" /></div>
//                     <div className="column-9 w-col w-col-6">
//                         <a href={"https://explorer.solana.com/tx/" + txId} className="s4f_sol_exp">click here to see transaction on Solana Explorer!</a>
//                         <h1 className="s4f_h3">share on</h1>
//                         <div className="div-block-7">
//                             <a href="#" className="s4f_button twitter w-button">Twitter</a>

//                             <a href="#" className="s4f_button facebook w-button">Facebook</a>
//                             <a href="#" className="s4f_button messenger w-button">Messenger</a>
//                             <a href="#" className="s4f_button instagram w-button">Instagram</a>
//                         </div>
//                     </div>
//                 </div>
//             )
//         }
//     }

//     return (

//         <Container>
//             {!wallet.connected ? (
//                 <ConnectButton>Connect Wallet</ConnectButton>
//             ) : (
//                 <>
//                     <Header candyMachine={candyMachine} />
//                     <MintContainer>
//                         {candyMachine?.state.isActive &&
//                             candyMachine?.state.gatekeeper &&
//                             wallet.publicKey &&
//                             wallet.signTransaction ? (
//                             <GatewayProvider
//                                 wallet={{
//                                     publicKey:
//                                         wallet.publicKey ||
//                                         new PublicKey(CANDY_MACHINE_PROGRAM),
//                                     //@ts-ignore
//                                     signTransaction: wallet.signTransaction,
//                                 }}
//                                 gatekeeperNetwork={
//                                     candyMachine?.state?.gatekeeper?.gatekeeperNetwork
//                                 }
//                                 clusterUrl={rpcUrl}
//                                 options={{ autoShowModal: false }}
//                             >
//                                 <MintButton
//                                     candyMachine={candyMachine}
//                                     isMinting={isUserMinting}
//                                     onMint={() => onMint(candyMachine)}
//                                 />
//                             </GatewayProvider>
//                         ) : (
//                             <MintButton
//                                 candyMachine={candyMachine}
//                                 isMinting={isUserMinting}
//                                 onMint={() => onMint(candyMachine)}
//                             />
//                         )}
//                         {showMinted()}

//                     </MintContainer>

//                 </>
//             )}

//             <Snackbar
//                 open={alertState.open}
//                 autoHideDuration={6000}
//                 onClose={() => setAlertState({ ...alertState, open: false })}
//             >
//                 <Alert
//                     onClose={() => setAlertState({ ...alertState, open: false })}
//                     severity={alertState.severity}
//                 >
//                     {alertState.message}
//                 </Alert>
//             </Snackbar>
//         </Container>
//     )

// };

// // Displays the screen where user can send to themselves or to friends.
// const MintAllocation: React.FC<{ theme: ThemeProps, props: MintProps }> = ({
//     theme, props
// }) => {
//     return (
//         <div className="div-block-5">
//             <h2 className="s4f_h3">for who?</h2>
//             <div data-current="Tab 2" data-easing="ease" data-duration-in="300" data-duration-out="100" className="s4f_tabs s4f_tabs_mint w-tabs">
//                 <div className="s4f_destination w-tab-menu">
//                     <a data-w-tab="Tab 1" className="s4f_destination s4f_theme_tab s4f_phone_tab w-inline-block w-tab-link">
//                         <div className="s4f_h3">send 4 fren</div>
//                     </a>
//                     <a data-w-tab="Tab 2" className="s4f_theme_tab s4f_destination s4f_phone_tab w-inline-block w-tab-link w--current">
//                         <div className="s4f_h3">send 4 me</div>
//                     </a>
//                 </div>
//                 <div className="tabs-content w-tab-content">
//                     <div data-w-tab="Tab 1" className="s4f_destination_mint w-tab-pane">
//                         <div className="columns-7 w-row">
//                             <div className="s4f_par">cannot send 4 fren yet :(</div>
//                             <MintMachine theme={theme} props={props}></MintMachine>
//                         </div>
//                     </div>
//                     <div data-w-tab="Tab 2" className="s4f_destination_mint w-tab-pane w--tab-active">
//                         <MintMachine theme={theme} props={props}></MintMachine>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// Mint selection takes in the collection and shows the 3 themes.
// After the theme has been selected, the minting box will show. 
// export const MintSelection: React.FC<{ collection: ThemeProps[], info: MintInfo }> = ({ collection, info }) => {
//     // Variable definitions
//     const [theme, setTheme] = useState(0)

//     // Returning what should be shown 
//     return (
//         < div className="s4f_mint wf-section" >
//             <div className="w-container">
//                 <h2 className="s4f_h3">choose your surprise</h2>
//                 <div className="div-block-5">
//                     <div data-current="Tab 1" data-easing="ease" data-duration-in="300" data-duration-out="100"
//                         className="s4f_tabs w-tabs">
//                         <div className="s4f_theme_options w-tab-menu">
//                             <a data-w-tab="Tab 1" className="s4f_theme_tab w-inline-block w-tab-link w--current" onClick={async () => { setTheme(0) }}><img
//                                 src={collection[0].imgSrc} loading="lazy" width="66" sizes="(max-width: 479px) 76vw, 66px"
//                                 srcSet={collection[0].imgSrcSet}
//                                 alt="" className="image-13" />
//                                 <div className="s4f_h3">{collection[0].name}</div>
//                                 <p className="s4f_par s4f_theme_description">{collection[0].description}</p>
//                             </a>
//                             <a data-w-tab="Tab 2" className="s4f_theme_tab w-inline-block w-tab-link" onClick={async () => { setTheme(1) }}><img src={collection[1].imgSrc}
//                                 loading="lazy" width="62" sizes="(max-width: 479px) 76vw, 62px"
//                                 srcSet={collection[1].imgSrcSet}
//                                 alt="" className="image-12" />
//                                 <div className="s4f_h3">{collection[1].name}</div>
//                                 <p className="s4f_par s4f_theme_description">{collection[1].description}</p>
//                             </a>
//                             <a data-w-tab="Tab 3" className="s4f_theme_tab w-inline-block w-tab-link" onClick={async () => { setTheme(2) }}><img
//                                 src={collection[2].imgSrc} loading="lazy" width="71" sizes="(max-width: 479px) 76vw, 71px"
//                                 srcSet={collection[2].imgSrcSet}
//                                 alt="" className="image-14" />
//                                 <div className="s4f_h3">{collection[2].name}</div>
//                                 <p className="s4f_par s4f_theme_description">{collection[2].description}</p>
//                             </a>
//                         </div>
//                         <div className="w-tab-content">
//                             <div data-w-tab="Tab 1" className="w-tab-pane w--tab-active">
//                                 <MintAllocation theme={collection[0]} props={info}></MintAllocation>
//                             </div>
//                             <div data-w-tab="Tab 2" className="w-tab-pane">
//                                 <MintAllocation theme={collection[1]} props={info}></MintAllocation>
//                             </div>
//                             <div data-w-tab="Tab 3" className="w-tab-pane">
//                                 <MintAllocation theme={collection[2]} props={info}></MintAllocation>
//                             </div>
//                         </div>
//                     </div>


//                 </div>
//             </div>
//         </div>




//     );
// };



interface CandyProps {
	candyMachine: CandyMachineAccount | undefined,
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
}

export const DisplayCandyMachine = (candyMachine: CandyMachineAccount | undefined, mutual: CandyMutualProps, info: MintProps) => {
	return (
		<Container>
			{!mutual.wallet.connected ? (
				<ConnectButton>Connect wallet</ConnectButton>
			) : (
				<>
					<Header candyMachine={candyMachine} />
					<MintContainer>
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
									onMint={() => OnMint(candyMachine, mutual, info)}
								/>
							</GatewayProvider>
						) : (
							<MintButton
								candyMachine={candyMachine}
								isMinting={mutual.isUserMinting}
								onMint={() => OnMint(candyMachine, mutual, info)}
							/>
						)}
						<MintFinish txId={mutual?.txId}/>

					</MintContainer>
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
const OnMint = async (candyMachine: CandyMachineAccount | undefined, mutual: CandyMutualProps, info: MintProps) => {
	try {
		mutual.setIsUserMinting(true);
		document.getElementById('#identity')?.click();
		if (mutual.wallet.connected && candyMachine?.program && mutual.wallet.publicKey) {
			const mintTxId = (
				await mintOneToken(candyMachine, mutual.wallet.publicKey)
			)[0];
			mutual.setTxId(mintTxId);

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
	]);

	return candyMachine
}

export const MintSection: React.FC<{ allCollections: CollectionProps[], info: MintInfo, phantom: PhantomProps }> = ({ allCollections, info, phantom }) => {

	const idxRef = 0
	const [selectedCollection, setSelectedCollection] = useState<number>(0);
	const [selectedCandyMachine, setSelectedCandyMachine] = useState<CandyMachineAccount | undefined>()
	const [txId, setTxId] = useState<string>();
	const [theme, setTheme] = useState<number>();

	// Wallet
	// const [isUserMinting, setIsUserMinting] = useState(false);
	// const rpcUrl = info.rpcHost;
	// const wallet = useWallet();
	// const anchorWallet = useMemo(() => {
	//     if (
	//         !wallet ||
	//         !wallet.publicKey ||
	//         !wallet.signAllTransactions ||
	//         !wallet.signTransaction
	//     ) {
	//         return;
	//     }
	//     return {
	//         publicKey: wallet.publicKey,
	//         signAllTransactions: wallet.signAllTransactions,
	//         signTransaction: wallet.signTransaction,
	//     } as anchor.Wallet;
	// }, [wallet]);
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
		setTxId: setTxId
	}
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
		(<option value={index}>{col.title}</option>)
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
							<h3 className="s4f_h3 subheading">{(candyMachine?.state?.isActive || candyMachine?.state?.isPresale) ? (subtitle) : ("not out yet :(")}</h3>
							<p className="s4f_par">{(candyMachine?.state?.isActive || candyMachine?.state?.isPresale) ? (description) : ("But I like that ur keen. Follow us on socials!")}</p>
						</div>
					</div>
					<div className="column-10 w-col w-col-6 w-col-small-6"><img src={(candyMachine?.state?.isActive || candyMachine?.state?.isPresale) ? (image) : ("images/blankCard.svg")} loading="lazy"
						sizes="(max-width: 479px) 100vw, (max-width: 767px) 32vw, (max-width: 991px) 247.796875px, 322px"
						alt=""
						className="image-2" /></div>
				</div>

			</div>

		</section>
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
		src="images/blankCard.svg" loading="lazy" width="66" sizes="(max-width: 479px) 76vw, 66px"
		alt="" className="image-13" />
		<div className="s4f_h3">Theme</div>
		<p className="s4f_par s4f_theme_description">Not yet available!</p></div>)

	const showTheme = (index: number) => {
		return (<div>
			<img
				src={allThemes[index].imgSrc} loading="lazy" width="66" sizes="(max-width: 479px) 76vw, 66px"
				srcSet={allThemes[index].imgSrcSet}
				alt="" className="image-13" />
			<div className="s4f_h3">{allThemes[index].name}</div>
			<p className="s4f_par s4f_theme_description">{allThemes[index].description}</p> </div>)
	}
	return (
		<div>

			{true ?
				(< div className="s4f_mint wf-section" >
					<div className="w-container">
						<h2 className="s4f_h3">choose your surprise</h2>
						<div className="div-block-5">
							<div data-current="Tab 1" data-easing="ease" data-duration-in="300" data-duration-out="100"
								className="s4f_tabs w-tabs">
								<div className="s4f_theme_options w-tab-menu">
									<a data-w-tab="Tab 1" className="s4f_theme_tab w-inline-block w-tab-link w--current">
										{allCandyMachines[idxRef]?.state?.isActive ? (showTheme(0)) : (noTheme)}
									</a>
									<a data-w-tab="Tab 2" className="s4f_theme_tab w-inline-block w-tab-link" >
										{allCandyMachines[idxRef]?.state?.isActive ? (showTheme(1)) : (noTheme)}
									</a>
									<a data-w-tab="Tab 3" className="s4f_theme_tab w-inline-block w-tab-link">
										{allCandyMachines[idxRef]?.state?.isActive ? (showTheme(2)) : (noTheme)}
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

		</div>)
	// }
	// return (<div></div>)
}

// Display the recipient options and allow user to select the option 
export const MintRecipient: React.FC<{ candyMachine: CandyMachineAccount | undefined, mutual: CandyMutualProps, info: MintProps }> = (
	{ candyMachine, mutual, info }
) => {
	return (
		<div className="div-block-5" id="process-mint">
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
							{DisplayCandyMachine(candyMachine, mutual, info)}
						</div>
					</div>
					<div data-w-tab="Tab 2" className="s4f_destination_mint w-tab-pane w--tab-active">
						{DisplayCandyMachine(candyMachine, mutual, info)}
					</div>
				</div>
			</div>
		</div>
	)
}

const MintFinish: React.FC<{ txId: string | undefined}> = ({txId}) => {

	return (
		<div>
			{
				txId ?
					(
						<div className="columns-6 w-row" >
							<div className="s4f_minted_card w-col w-col-6"><img src="images/Valentines-Example.png" loading="lazy"
								sizes="100vw" srcSet="images/Valentines-Example-p-500.png 500w, images/Valentines-Example.png 520w" alt=""
								className="image-3" /></div>
							<div className="column-9 w-col w-col-6">
								<a href={"https://explorer.solana.com/tx/" + txId} target="_blank" className="s4f_sol_exp">click here to see transaction on Solana Explorer!</a>
								<h1 className="s4f_h3">share on</h1>
								<div className="div-block-7">
									<a href="#" className="s4f_button twitter w-button">Twitter</a>

									<a href="#" className="s4f_button facebook w-button">Facebook</a>
									<a href="#" className="s4f_button messenger w-button">Messenger</a>
									<a href="#" className="s4f_button instagram w-button">Instagram</a>
								</div>
							</div>
						</div >
					) : (<div />)}

			)
		</div>)

}



export default MintSection