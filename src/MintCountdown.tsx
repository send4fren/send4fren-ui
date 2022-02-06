import { Paper } from '@material-ui/core';
import Countdown from 'react-countdown';
import { Theme, createStyles, makeStyles, styled } from '@material-ui/core/styles';
import { Opacity } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      padding: theme.spacing(0),
      '& > *': {
        margin: theme.spacing(0.5),
        marginRight: 0,
        width: theme.spacing(6),
        height: theme.spacing(6),
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        color: 'black',
        borderRadius: 5,
        fontSize: 10,
      },
    },
    done: {
      display: 'flex',
      margin: theme.spacing(1),
      marginRight: 0,
      padding: theme.spacing(1),
      flexDirection: 'column',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      color: 'black',
      borderRadius: 5,
      fontWeight: 'bold',
      fontSize: 18,
    },
    item: {
      fontWeight: 'bold',
      fontSize: 18,
    },
  }),
);

const coolStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      padding: theme.spacing(0),
      '& > *': {
        margin: theme.spacing(0.5),
        marginRight: 0,
        width: theme.spacing(6),
        height: theme.spacing(6),
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        color: 'black',
        borderRadius: 5,
        fontSize: 15,
      },
    },
    done: {
      display: 'flex',
      margin: theme.spacing(1),
      marginRight: 0,
      padding: theme.spacing(1),
      flexDirection: 'column',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      color: 'black',
      borderRadius: 5,
      fontWeight: 'bold',
      fontSize: 30,
    },
    item: {
      fontWeight: 'bold',
      fontSize: 30,
    },
    label: {
      marginTop: "20px",
    },
  }),
);

const StyledPaper = styled(Paper)(() => ({
  display: "flex",
  textAlign: 'center',
  color: "white",
  height: 150,
  width: 100,
  padding: "10px",
  justifyContent: "center",
  alignContent: "center",
  background: "#471E92",
  
}));

interface DateProps {
    date: Date | undefined;
    style?: React.CSSProperties;
}


interface MintCountdownProps {
  date: Date | undefined;
  style?: React.CSSProperties;
  status?: string;
  setMintText?: React.Dispatch<React.SetStateAction<string>>,
  onComplete?: () => void;
}

interface MintCountdownRender {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export const MintCountdown: React.FC<MintCountdownProps> = ({
  date,
  status,
  style,
  setMintText,
  onComplete,
}) => {
  const classes = useStyles();
  const renderCountdown = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: MintCountdownRender) => {
    hours += days * 24;
    if (completed) {
      if (setMintText) {
        setMintText("Mint now");
      }
      return status ? <span className={classes.done}>{status}</span> : null;
      // return (
      //   <div>
      //     <span className={classes.done}>{"OUT NOW"}</span>
      //     <a href="#mint-start" className="s4f_hero_button w-button">{"start sending"}</a>  
      //   </div>
      // )
    } else {
      return (
        <div className={classes.root} style={style}>
          <Paper elevation={0}>
            <span className={classes.item}>
              {hours < 10 ? `0${hours}` : hours}
            </span>
            <span>hrs</span>
          </Paper>
          <Paper elevation={0}>
            <span className={classes.item}>
              {minutes < 10 ? `0${minutes}` : minutes}
            </span>
            <span>mins</span>
          </Paper>
          <Paper elevation={0}>
            <span className={classes.item}>
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
            <span>secs</span>
          </Paper>
          {/* <div className="s4f_banner_column w-col w-col-4">
            <a href="#mint-start" className="s4f_hero_button w-button">{"learn more"}</a>
          </div> */}
        </div>
      );
    }
  };

  if (date) {
    return (
      <Countdown
        date={date}
        onComplete={onComplete}
        renderer={renderCountdown}
      />
    );
  } else {
    return null;
  }
};

export const CoolCountdown: React.FC<MintCountdownProps> = ({
  date,
  status,
  style,
  setMintText,
  onComplete,
}) => {
  const classes = coolStyles();
  const renderCountdown = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: MintCountdownRender) => {
    hours += days * 24;
    if (completed) {
      if (setMintText) {
        setMintText("Mint now");
      }
      return status ? <span className={classes.done}>{status}</span> : null;
      // return (
      //   <div>
      //     <span className={classes.done}>{"OUT NOW"}</span>
      //     <a href="#mint-start" className="s4f_hero_button w-button">{"start sending"}</a>  
      //   </div>
      // )
    } else {
      return (
        <div className={classes.root} style={style}>
          <StyledPaper elevation={0}>
            <span className={classes.item}>
              {hours < 10 ? `0${hours}` : hours}
            </span>
            <span className={classes.label}>hrs</span>
          </StyledPaper>
          <StyledPaper elevation={0}>
            <span className={classes.item}>
              {minutes < 10 ? `0${minutes}` : minutes}
            </span>
            <span className={classes.label}>mins</span>
          </StyledPaper>
          <StyledPaper elevation={0}>
            <span className={classes.item}>
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
            <span className={classes.label}>secs</span>
          </StyledPaper>
          {/* <div className="s4f_banner_column w-col w-col-4">
            <a href="#mint-start" className="s4f_hero_button w-button">{"learn more"}</a>
          </div> */}
        </div>
      );
    }
  };

  if (date) {
    return (
      <Countdown
        date={date}
        onComplete={onComplete}
        renderer={renderCountdown}
      />
    );
  } else {
    return null;
  }
};
