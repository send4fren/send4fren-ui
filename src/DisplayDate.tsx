

import { Paper } from '@material-ui/core';
import Countdown from 'react-countdown';
import { Theme, createStyles, makeStyles, styled} from '@material-ui/core/styles';
// import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

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
      fontSize: 30,
    },
    label: {
      paddingTop: "10px",
      fontSize: 20,
    }
  }),
);

const StyledPaper = styled(Paper)(() => ({
  display: "flex",
  textAlign: 'center',
  color: "white",
  height: 100,
  width: 100,
  padding: "10px",
  justifyContent: "center",
  alignContent: "center",
  background: "#471E92"
}));

interface DateProps {
    date: Date | undefined;
    style?: React.CSSProperties;
}

// Display the date in a nice way
export const DisplayDate: React.FC<DateProps> = ({date, style}) => {

  
    const classes = useStyles();
    if (!date) {return (<></>)};
    const day = date.getDate() 
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return (
        <div className={classes.root}>
            <StyledPaper elevation={0} style={style}>
                <span className={classes.item}>
                    {day < 10 ? `0${day}` : day}
                </span>
                <span className={classes.label}>day</span>
            </StyledPaper>
            <StyledPaper elevation={0} style={style}>
                <span className={classes.item}>
                    {month < 10 ? `0${month}` : month}
                </span>
                <span className={classes.label}>month</span>
            </StyledPaper >
            <StyledPaper elevation={0} style={style}>
                <span className={classes.item}>
                    {year}
                </span>
                <span className={classes.label}>year</span>
            </StyledPaper>
            {/* <div className="s4f_banner_column w-col w-col-4">
            <a href="#mint-start" className="s4f_hero_button w-button">{"learn more"}</a>
          </div> */}
        </div>
    )
}