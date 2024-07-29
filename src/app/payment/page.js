'use client'
import React from 'react';
import Payment from '@/components/dashboard/paymentPage/checkout';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@material-ui/core';

function App({searchParams}) {
    // const theme = useTheme();
  
    
    return (
        <div className="App">
               
            <Payment searchParams={searchParams} />
           
        </div>
    );
}

export default App;
