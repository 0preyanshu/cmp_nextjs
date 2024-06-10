'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { Option } from '@/components/core/option';
import { toast } from '@/components/core/toaster';
// import { themeStretch } from '@/lib/theme';
import {  Container, Tab } from '@mui/material';
import { useState } from 'react';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import Image from './Image';
import { SmtpForm } from './SmtpForm';
import { SendGrid } from './SendGrid';



function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(new Error('Error converting file to base64'));
    };
  });
}

const schema = zod.object({
  avatar: zod.string().optional(),
  name: zod.string().min(1, 'Name is required').max(255),
  email: zod.string().email('Must be a valid email').min(1, 'Email is required').max(255),
  phone: zod.string().min(1, 'Phone is required').max(15),
  company: zod.string().max(255),
  billingAddress: zod.object({
    country: zod.string().min(1, 'Country is required').max(255),
    state: zod.string().min(1, 'State is required').max(255),
    city: zod.string().min(1, 'City is required').max(255),
    zipCode: zod.string().min(1, 'Zip code is required').max(255),
    line1: zod.string().min(1, 'Street line 1 is required').max(255),
    line2: zod.string().max(255).optional(),
  }),
  taxId: zod.string().max(255).optional(),
  timezone: zod.string().min(1, 'Timezone is required').max(255),
  language: zod.string().min(1, 'Language is required').max(255),
  currency: zod.string().min(1, 'Currency is required').max(255),
});



const defaultValues = {
  avatar: '',
  name: '',
  email: '',
  phone: '',
  company: '',
  billingAddress: { country: '', state: '', city: '', zipCode: '', line1: '', line2: '' },
  taxId: '',
  timezone: 'new_york',
  language: 'en',
  currency: 'USD',
};

export function CustomerCreateForm() {
  const router = useRouter();
  const [value, setValue2] = useState('1');

const handleChange = (event, newValue) => {
  setValue2(newValue);
};

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (_) => {
      try {
        // Make API request
        toast.success('Customer updated');
        router.push(paths.dashboard.coursecategories.list);
      } catch (err) {
        logger.error(err);
        toast.error('Something went wrong!');
      }
    },
    [router]
  );

  const avatarInputRef = React.useRef(null);
  const avatar = watch('avatar');

  const handleAvatarChange = React.useCallback(
    async (event) => {
      const file = event.target.files?.[0];

      if (file) {
        const url = await fileToBase64(file);
        setValue('avatar', url);
      }
    },
    [setValue]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container >
               <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Stripe" value="1" />
                <Tab label="Paypal" value="2" />
                {/* <Tab label="Item Three" value="3" /> */}
              </TabList>
            </Box>
            <TabPanel value="1">
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' },alignItems:"center", justifyContent:"center",width:"100%"}}>
                <Box sx={{ mt: 2, width: { sm: '100%', md: '100%' } }}>
                  {/* Send values recieved from store through props */}
                  <SmtpForm />
                </Box>
               
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' },alignItems:"center", justifyContent:"center",width:"100%"}}>
                <Box sx={{ mt: 2, width: { sm: '100%', md: '100%' } }}>
                  {/* Send values recieved from store through props */}
                  <SendGrid />
                </Box>
               
              </Box>
            </TabPanel>
            
           
          </TabContext>
      </Container>
    </form>
  );
}
