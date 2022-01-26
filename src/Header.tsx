import * as anchor from '@project-serum/anchor';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { MintCountdown } from './MintCountdown';
import { toDate, formatNumber } from './utils';
import { CandyMachineAccount } from './candy-machine';

import { useEffect } from 'react';

type HeaderProps = {
  candyMachine?: CandyMachineAccount;
  candyMachineName: String;
};

export const Header = (props: HeaderProps) => {

  const itemsRemainingId = "itemsRemaining"+props.candyMachineName;

  useEffect(() => {
    if (document.getElementById(itemsRemainingId)) {
      document.getElementById(itemsRemainingId)!.innerHTML = String(props.candyMachine?.state.itemsRemaining);
    }
  }, [
    props.candyMachine?.state.itemsRemaining
  ]);

  return (
    <Grid container direction="row" justifyContent="center" wrap="nowrap">
      <Grid container direction="row" wrap="nowrap">
        {props.candyMachine && (
          <Grid container direction="row" wrap="nowrap">
            <Grid container direction="column">
              <Typography variant="body2" color="textSecondary">
                Remaining
              </Typography>
              <Typography
                id={itemsRemainingId}
                variant="h6"
                color="textPrimary"
                style={{
                  fontWeight: 'bold',
                }}
              >
                {`${props.candyMachine?.state.itemsRemaining}`}
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
                {getMintPrice(props.candyMachine)}
              </Typography>
            </Grid>
          </Grid>
        )}
        <MintCountdown
          date={toDate(
            props.candyMachine?.state.goLiveDate
              ? props.candyMachine?.state.goLiveDate
              : props.candyMachine?.state.isPresale
              ? new anchor.BN(new Date().getTime() / 1000)
              : undefined,
          )}
          style={{ justifyContent: 'flex-end' }}
          status={
            !props.candyMachine?.state?.isActive || props.candyMachine?.state?.isSoldOut
              ? 'COMPLETED'
              : props.candyMachine?.state.isPresale
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
