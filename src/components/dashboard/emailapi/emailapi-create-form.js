'use client';

import * as React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


import {  Container, Tab } from '@mui/material';
import { useState } from 'react';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import Image from './Image';
import { SmtpForm } from './SmtpForm';
import { SendGrid } from './SendGrid';


export function EmailApiForm() {
  
  const [value, setValue2] = useState('1');

const handleChange = (event, newValue) => {
  setValue2(newValue);
};



  return (
    
      <Container >
               <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="SMTP" value="1" />
                <Tab label="SendGrid" value="2" />
                {/* <Tab label="Item Three" value="3" /> */}
              </TabList>
            </Box>
            <TabPanel value="1">
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}>
                <Box sx={{ mt: 2, width: { sm: '100%', md: '60%' } }}>
                  {/* Send values recieved from store through props */}
                  <SmtpForm />
                </Box>
                <Box sx={{ width: { sm: '100%', md: '40%' }, my: 2, pl: { xs: 2 } }}>
                  <Typography variant="h6" sx={{ my: 1 }}>
                    How to Setup 'From Name' and 'From Email'?
                  </Typography>
                  <ol>
                    <li>How to Setup 'From Name' and 'From Email'?</li>
                    <li>Click on '+ Add New' button to add new 'From Name' and 'From Email' for notification email.</li>
                    <li>
                      Click on 'Pencil icon' button to edit existing 'From Name' and 'From Email' for notification
                      email.
                    </li>
                  </ol>
                  <Typography variant="h6" sx={{ my: 1 }}>
                    How to Enable 'Less secure apps' within GMAIL?
                  </Typography>
                  <ol>
                    <li>Log into your GMAIL account.</li>
                    <li>Navigate to the 'Less secure apps' page.</li>
                    <Image src="/assets/lesssecureapps.png" sx={{ width: 400, height: 300 }} />
                    <li>Toggle to turn this feature 'ON'.</li>
                    <li>Wait at least 1 hour for Google to update this setting.</li>
                    <li>Test your mail application again. It should now send correctly via SMTP.</li>
                  </ol>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}>
                <Box sx={{ mt: 2, width: { sm: '100%', md: '60%' } }}>
                  {/* Send values recieved from store through props */}
                  <SendGrid></SendGrid>
                </Box>
                <Box sx={{ width: { sm: '100%', md: '40%' }, my: 2, pl: { xs: 2 } }}>
                  <Typography variant="h6" sx={{ my: 1 }}>
                    How to Setup 'From Name' and 'From Email'?
                  </Typography>
                  <ol>
                    <li>Navigate to the 'Email Senders' page.</li>
                    <li>Click on '+ Add New' button to add new 'From Name' and 'From Email' for notification email.</li>
                    <li>
                      Click on 'Pencil icon' button to edit existing 'From Name' and 'From Email' for notification
                      email.
                    </li>
                  </ol>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </TabContext>
      </Container>
   
  );
}
