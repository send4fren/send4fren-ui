import * as anchor from '@project-serum/anchor';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { MintCountdown } from './MintCountdown';
import { toDate, formatNumber } from './utils';
import { CandyMachineAccount } from './candy-machine';
import { Divider } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';

type HeaderProps = {
  candyMachine?: CandyMachineAccount;
  reloadWhen : boolean;
};

export const Header = ({ candyMachine, reloadWhen }: HeaderProps) => {

  const [remaining, setRemaining] = useState<number|undefined>()

  const wait = (ms:number) => new Promise(res => setTimeout(res, ms));

  const waitForItemChange = async () => {
    const current = candyMachine?.state.itemsRemaining
    while (candyMachine?.state.itemsRemaining == current) {
      wait(1000)
    }
  }

  // const refreshRemaining = useCallback(async () => {
  //   await waitForItemChange();
  //   setRemaining(candyMachine?.state.itemsRemaining)
  // }, [reloadWhen])

  // useEffect(() => {
  //   // refreshRemaining()
  //   // console.log(remaining)
  // }, [reloadWhen])
  
  // const doSetRemaining = () => {
  //   setRemaining(candyMachine?.state.itemsRemaining)
  //   return (<div></div>)
  // }

  return (
    <Grid container direction="row" justifyContent="center" wrap="nowrap">
      <Grid container direction="row" wrap="nowrap">
        {candyMachine && (
          <Grid container direction="row" wrap="nowrap">
            <Grid container direction="column" >
              <Typography variant="body2" color="textSecondary">
                Remaining
                
              </Typography>
              
              <Typography
                variant="h6"
                color="textPrimary"
                style={{
                  fontWeight: 'bold',
                }}
              > 
                {remaining ? (remaining) : (candyMachine.state.itemsRemaining)}
              </Typography>
            </Grid>
            
            <Grid container direction="column">
              <Typography variant="body2" color="textSecondary">
                Price
              </Typography>
              <Typography
                variant="h6"
                color="textPrimary"
                style={{ fontWeight: 'bold' }}
              >
                {getMintPrice(candyMachine)}
              </Typography>
            </Grid>
          </Grid>
        )}
        <MintCountdown
          date={toDate(
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
          }
        />
        
      </Grid>
    </Grid>
  );
};

const getMintPrice = (candyMachine: CandyMachineAccount): string => {
  const price = formatNumber.asNumber(
    candyMachine.state.isPresale && candyMachine.state.whitelistMintSettings?.discountPrice
      ? candyMachine.state.whitelistMintSettings?.discountPrice!
      : candyMachine.state.price!,
  );
  return `◎ ${price}`;
};
