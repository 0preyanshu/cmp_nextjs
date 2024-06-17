'use client';

import * as React from 'react';

import Box from '@mui/material/Box';

import {  Container, Tab } from '@mui/material';
import { useState } from 'react';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { PreRequisiteEmails } from './prerequisite-email-form';
import { WelcomeEmails } from './welcome-email-form';



export function SystemEmailsForm() {

  const [value, setValue2] = useState('1');

const handleChange = (event, newValue) => {
  setValue2(newValue);
};

const emailTypeIds = {
  welcomeEmail: 1,
  preRequisiteEmail: 2,
  transferEmail: 3,
  orderEmail: 4,
  cancelEmail: 5,
  refundEmail: 6
}





  return (
  
      <Container>
               <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Prequisite" value="1" />
                <Tab label="Welcome" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' },alignItems:"center", justifyContent:"center",width:"100%"}}>
                <Box sx={{ mt: 2, width: { sm: '100%', md: '100%' } }}>
                  <PreRequisiteEmails emailTypeIds={emailTypeIds}/>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' },alignItems:"center", justifyContent:"center",width:"100%"}}>
                <Box sx={{ mt: 2, width: { sm: '100%', md: '100%' } }}>
                  <WelcomeEmails/>
                </Box>
               
              </Box>
            </TabPanel>
            
           
          </TabContext>
      </Container>

  );
}
