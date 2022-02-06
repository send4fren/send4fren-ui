import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { CandyMachineAccount } from './candy-machine';
import { CircularProgress } from '@material-ui/core';
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react';
import { useEffect, useState } from 'react';

// export const CTAButton = styled(Button)`
//   width: 100%;
//   height: 60px;
//   margin-top: 10px;
//   margin-bottom: 5px;
//   background: linear-gradient(180deg, #604ae5 0%, #813eee 100%);
//   color: white;
//   font-size: 16px;
//   font-weight: bold;
// `; // add your own styles here

export const CTAButton = styled(Button)`
  margin-top: 10px;
  width: 100%;
  background-color: #f7891e;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 25px;
  box-shadow: 0px 6px 0 #c06d19;
  marginLeft: 20px;
  marginRight: 20px

  
`; // add your own styles here

// export const CTAButton = styled(Button)`
//   display: inline-block;
//   margin-top: 10px;
//   margin-bottom: 10px;
//   -webkit-box-pack: center;
//   -webkit-justify-content: center;
//   -ms-flex-pack: center;
//   justify-content: center;
//   -webkit-box-align: center;
//   -webkit-align-items: center;
//   -ms-flex-align: center;
//   align-items: center;
//   border-radius: 25px;
//   background-color: #f7891e;
//   box-shadow: 3px 3px 4px 0 #3a3a3a;
//   font-family: 'Varela Round', sans-serif;
//   font-size: 24px;
//   text-align: center;
// `; // add your own styles here

export const MintButton = ({
  onMint,
  candyMachine,
  isMinting,
}: {
  onMint: () => Promise<void>;
  candyMachine?: CandyMachineAccount;
  isMinting: boolean;
}) => {
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
      onMint();
      setClicked(false);
    }
  }, [gatewayStatus, clicked, setClicked, onMint]);

  const getMintButtonContent = () => {
    if (candyMachine?.state.isSoldOut) {
      return 'SOLD OUT';
    } else if (isMinting) {
      return <CircularProgress />;
    } else if (candyMachine?.state.isPresale) {
      return 'PRESALE MINT';
    }

    return 'mint now';
  };

  return (
    <CTAButton
      disabled={
        candyMachine?.state.isSoldOut ||
        isMinting ||
        !candyMachine?.state.isActive
      }
      onClick={async () => {
        setClicked(true);
        if (candyMachine?.state.isActive && candyMachine?.state.gatekeeper) {
          if (gatewayStatus === GatewayStatus.ACTIVE) {
            setClicked(true);
          } else {
            await requestGatewayToken();
          }
        } else {
          await onMint();
          setClicked(false);
        }
      }}
      variant="contained"
    >
      {getMintButtonContent()}
    </CTAButton>
  );
};
