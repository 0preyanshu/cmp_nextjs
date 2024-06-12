'use client';

import * as React from 'react';

import Box from '@mui/material/Box';

import {  Container, Tab } from '@mui/material';
import { useState } from 'react';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { PaypalForm } from './paypal-form';
import { StripeForm } from './stripe-form';



export function PaymentApiForm() {

  const [value, setValue2] = useState('1');

const handleChange = (event, newValue) => {
  setValue2(newValue);
};




  return (
  
      <Container >
               <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Stripe" value="1" />
                <Tab label="Paypal" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' },alignItems:"center", justifyContent:"center",width:"100%"}}>
                <Box sx={{ mt: 2, width: { sm: '100%', md: '100%' } }}>
                  <PaypalForm/>
                </Box>
               
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' },alignItems:"center", justifyContent:"center",width:"100%"}}>
                <Box sx={{ mt: 2, width: { sm: '100%', md: '100%' } }}>
                  <StripeForm/>
                </Box>
               
              </Box>
            </TabPanel>
            
           
          </TabContext>
      </Container>

  );
}
