import { makeStyles } from "@material-ui/core";
import { red, green } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  list: {
    maxHeight: '600px',
    overflow: 'auto',
  },
  tab: {
    width: "100px"
  },
  tabs: {
    overflow: 'auto'
  },
  divider: {
    margin: "20px 0"
  },
  button: {
    marginTop: "20px"
  },
  avatarIncome: {
    color: '#fff',
    backgroundColor: green[500],
  },
  avatarExpense: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
  },
  list: {
    maxHeight: '260px',
    overflow: 'auto',
  },
}));

