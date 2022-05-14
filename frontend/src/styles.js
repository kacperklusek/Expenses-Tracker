import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  desktop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  mobile: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },

  },
  main: {
    [theme.breakpoints.up('md')]: {
      paddingBottom: '5%',
    },
  },
  last: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(3),
      paddingBottom: '200px',
    },
  },
  grid: {
    '& > *': {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },

    [theme.breakpoints.up('md')]: {
      display: "flex",
      flexDirection: "row",
    },
  },
}));