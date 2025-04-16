import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <h1 className="text-4xl font-bold mb-6 text-center">Stock Market Sentiment Analysis</h1>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
