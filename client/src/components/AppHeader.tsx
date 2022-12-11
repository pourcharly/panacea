import { AccountCircle } from '@mui/icons-material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useApp } from '../contexts';
import { AppAction } from '../enums';
import { theme } from '../theme';
import UserStatus from './UserStatus';

export function AppHeader () {
  const { dispatch } = useApp();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const closeWallet = useCallback(() => {
    dispatch({ type: AppAction.CloseWallet });
    setAnchorEl(null);
  }, [dispatch]);

  return (
  <AppBar position="fixed">
      <Toolbar className="flex-row-between">
        
          <div className="logo-grid">
            <MedicalServicesIcon sx={{ fontSize: '28px' }} />

            <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }} align="left">
              Ordochain
            </Typography>

            <Typography variant="subtitle2" component="span" sx={{ flexGrow: 1 }} align="right" color={theme.palette.secondary.light}>
              Votre wallet médical
            </Typography>
          </div>

          <div style={{marginLeft: 'auto'}}>
            <UserStatus />
          </div>
          <div>
            <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={openMenu}
                >
                  <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
            >
              <MenuItem onClick={closeWallet}>Fermer votre wallet</MenuItem>
            </Menu>
          </div>
      </Toolbar>
  </AppBar>
  );
}