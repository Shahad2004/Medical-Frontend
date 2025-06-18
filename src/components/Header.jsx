import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import logoImg from './img12.png';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const pages = ['Home', 'About', 'Medicine'];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="fixed" sx={{ background: '#ffffff' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>

          {/* Mobile View */}
          {isMobile && (
            <>
              {/* Left: Hamburger menu */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  size="large"
                  aria-label="menu"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
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
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* Center: Logo */}
              <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <img src={logoImg} alt="Logo" style={{ height: 50 }} />
              </Box>

              {/* Right: Login button */}
              <Box sx={{ marginLeft: 'auto' }}>
                <Button
                  onClick={() => navigate('/')}
                  sx={{
                    width: '100px',
                    borderRadius: '20px',
                    color: '#fff',
                    backgroundColor: '#40A2E3',
                    '&:hover': {
                      backgroundColor: '#3595d1',
                    },
                  }}
                >
                  LOG IN
                </Button>
              </Box>
            </>
          )}

          {/* Desktop View */}
          {!isMobile && (
            <>
              {/* Left: Logo */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={logoImg}
                  alt="Logo"
                  style={{ width: '150px', height: '100px' }}
                />
              </Box>

              {/* Right: Pages + Login */}
              <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      color: '#4C6AAC',
                      display: 'block',
                      textTransform: 'capitalize',
                    }}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  onClick={() => navigate('/')}
                  sx={{
                    ml: 2,
                    width: '120px',
                    borderRadius: '20px',
                    color: '#fff',
                    backgroundColor: '#40A2E3',
                    '&:hover': {
                      backgroundColor: '#3595d1',
                    },
                  }}
                >
                  LOG IN
                </Button>
              </Box>
            </>
          )}

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
