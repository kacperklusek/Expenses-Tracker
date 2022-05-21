import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  grid: {
    '& > *': {
      margin: theme.spacing(2),
    },
  },
}));