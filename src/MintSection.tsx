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


// export const MintSection: React.FC<{ collections: CollectionProps[], props: MintProps }> = ({ collections, props }) => {

//     return (

//     )
// };