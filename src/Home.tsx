import { useEffect, useMemo, useState, useCallback } from 'react';
import * as anchor from '@project-serum/anchor';

import { ThemeProps } from './MintSelection';
import styled from 'styled-components';
import { Container, Snackbar } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
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


export interface HomeProps {
  niceCandyMachineId?: anchor.web3.PublicKey;
  naughtyCandyMachineId?: anchor.web3.PublicKey;
  savageCandyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  txTimeout: number;
  rpcHost: string;
}

// export interface HomeProps{
//   collection: ThemeProps[];
//   connection: anchor.web3.Connection;
//   startDate: number;
//   txTimeout: number;
//   rpcHost: string;
// }

const Home = (props: HomeProps) => {
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [niceCandyMachine, setNiceCandyMachine] = useState<CandyMachineAccount>();
  const [naughtyCandyMachine, setNaughtyCandyMachine] = useState<CandyMachineAccount>();
  const [savageCandyMachine, setSavageCandyMachine] = useState<CandyMachineAccount>();
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

    if (props.niceCandyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          props.niceCandyMachineId,
          props.connection,
        );
        setNiceCandyMachine(cndy);
      } catch (e) {
        console.log('There was a problem fetching Candy Machine state');
        console.log(e);
      }
    }
    if (props.naughtyCandyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          props.naughtyCandyMachineId,
          props.connection,
        );
        setNaughtyCandyMachine(cndy);
      } catch (e) {
        console.log('There was a problem fetching Candy Machine state');
        console.log(e);
      }
    }
    if (props.savageCandyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          props.savageCandyMachineId,
          props.connection,
        );
        setSavageCandyMachine(cndy);
      } catch (e) {
        console.log('There was a problem fetching Candy Machine state');
        console.log(e);
      }
    }
  }, [
    anchorWallet,
    props.niceCandyMachineId,
    props.naughtyCandyMachineId,
    props.savageCandyMachineId,
    props.connection
  ]);

  const onMintNice = () => {
    return onMint(niceCandyMachine);
  }
  const onMintNaughty = () => {
    return onMint(naughtyCandyMachine);
  }
  const onMintSavage = () => {
    return onMint(savageCandyMachine);
  }

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
    props.niceCandyMachineId,
    props.naughtyCandyMachineId,
    props.savageCandyMachineId,
    props.connection,
    refreshCandyMachineState,
  ]);

  return (
    <Container style={{ marginTop: 100 }}>
      <Container maxWidth="xs" style={{ position: 'relative' }}>
        <Paper
          style={{ padding: 24, backgroundColor: '#151A1F', borderRadius: 6 }}
        >
          {!wallet.connected ? (
            <ConnectButton>Connect Wallet</ConnectButton>
          ) : (
            <>

              Nice Candy Machine

              <Header candyMachine={niceCandyMachine} />
              <MintContainer>
                {niceCandyMachine?.state.isActive &&
                  niceCandyMachine?.state.gatekeeper &&
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
                      niceCandyMachine?.state?.gatekeeper?.gatekeeperNetwork
                    }
                    clusterUrl={rpcUrl}
                    options={{ autoShowModal: false }}
                  >
                    <MintButton
                      candyMachine={niceCandyMachine}
                      isMinting={isUserMinting}
                      onMint={onMintNice}
                    />
                  </GatewayProvider>
                ) : (
                  <MintButton
                    candyMachine={niceCandyMachine}
                    isMinting={isUserMinting}
                    onMint={onMintNice}
                  />
                )}
              </MintContainer>

              Naughty Candy Machine

              <Header candyMachine={naughtyCandyMachine} />
              <MintContainer>
                {naughtyCandyMachine?.state.isActive &&
                  naughtyCandyMachine?.state.gatekeeper &&
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
                      naughtyCandyMachine?.state?.gatekeeper?.gatekeeperNetwork
                    }
                    clusterUrl={rpcUrl}
                    options={{ autoShowModal: false }}
                  >
                    <MintButton
                      candyMachine={naughtyCandyMachine}
                      isMinting={isUserMinting}
                      onMint={onMintNaughty}
                    />
                  </GatewayProvider>
                ) : (
                  <MintButton
                    candyMachine={naughtyCandyMachine}
                    isMinting={isUserMinting}
                    onMint={onMintNaughty}
                  />
                )}
              </MintContainer>

              Savage Candy Machine

              <Header candyMachine={savageCandyMachine} />
              <MintContainer>
                {savageCandyMachine?.state.isActive &&
                  savageCandyMachine?.state.gatekeeper &&
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
                      savageCandyMachine?.state?.gatekeeper?.gatekeeperNetwork
                    }
                    clusterUrl={rpcUrl}
                    options={{ autoShowModal: false }}
                  >
                    <MintButton
                      candyMachine={savageCandyMachine}
                      isMinting={isUserMinting}
                      onMint={onMintSavage}
                    />
                  </GatewayProvider>
                ) : (
                  <MintButton
                    candyMachine={savageCandyMachine}
                    isMinting={isUserMinting}
                    onMint={onMintSavage}
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
  );
};




export default Home;
