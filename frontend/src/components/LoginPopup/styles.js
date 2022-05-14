import { Hidden, makeStyles } from "@material-ui/core";

export default makeStyles(() => ({
  popup: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.2)',
    
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerPopup: {
    position: 'relative',
    padding: '32px',
    width: '25%',
    // will it scale 
    minWidth: '300px',
    maxwidth: '640px',
    backgroundColor: '#FFF',
    borderRadius: "10px",
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: '20px',
  },
}))
