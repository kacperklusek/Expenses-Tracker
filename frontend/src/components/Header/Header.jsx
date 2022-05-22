import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Container, Tooltip, MenuItem, Button, Menu} from '@material-ui/core';
import { Menu as MenuIcon, Adb as AdbIcon } from '@material-ui/icons';
import Avatar from '@material-ui/core/Avatar';

import useStyles from "./styles"
import { useContext } from 'react';
import { ExpenseTrackerContext } from '../../context/context';

const ResponsiveAppBar = (props) => {
  const classes = useStyles()
  const {settings, pages, page, setPage} = props

  const {user, logout} = useContext(ExpenseTrackerContext)

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }

  const stringAvatar = (usr) => {
    return {
      sx: {
        bgcolor: stringToColor(usr),
      },
      children: `${usr.name[0]}${usr.surname[0]}`,
    };
  }

  const handleLogout = () => {
    handleCloseNavMenu()
    logout()
  }

  return (
    <AppBar position="static" color='primary' >
      <Container maxWidth="xl">
        <Toolbar className={classes.appBar}>
          <Box sx={{display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', sm: 'none' },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={page} onClick={() => {
                  handleCloseNavMenu(); setPage(index)
                  }}>
                  <Typography textalign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={() => {handleCloseNavMenu(); setPage(index)}}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box className={classes.Avatar}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar {...stringAvatar(user)} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >

              <MenuItem key="logout" onClick={handleLogout}>
                <Typography textalign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
