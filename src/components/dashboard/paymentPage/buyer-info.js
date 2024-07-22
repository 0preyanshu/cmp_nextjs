'use client';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Typography, TextField, Grid, Box, MenuItem, FormControl, InputLabel, Select, Switch, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Styles from './styles/buyer.module.scss';

export default function BuyerInformation({ control, errors, onSubmit, setData, isSubmitting }) {

  const handleChange = (name, value) => {
    setData(name, value);
  };

  return (
    <div>
      <div className={Styles.heading}>
        <Typography variant="h6">Buyer Information</Typography>
      </div>
      <form onSubmit={onSubmit}>
        <Box mt={5}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={6}>
              <Controller
                name="for"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Buying for</InputLabel>
                    <Select {...field} label="Buying for">
                      <MenuItem value="Myself">Myself</MenuItem>
                      <MenuItem value="SomeoneElse">Someone Else</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              {errors.for && <Typography color="error">{errors.for.message}</Typography>}
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <Controller
                name="attendees"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Attendees" type="number" />
                )}
              />
              {errors.attendees && <Typography color="error">{errors.attendees.message}</Typography>}
            </Grid> */}
            <Grid item xs={12} md={6}>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="First Name" />
                )}
              />
              {errors.first_name && <Typography color="error">{errors.first_name.message}</Typography>}
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Last Name" />
                )}
              />
              {errors.last_name && <Typography color="error">{errors.last_name.message}</Typography>}
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Email" type="email" />
                )}
              />
              {errors.email && <Typography color="error">{errors.email.message}</Typography>}
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="number"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Phone Number" />
                )}
              />
              {errors.number && <Typography color="error">{errors.number.message}</Typography>}
            </Grid>
            {/* <Grid item xs={12}>
              <Controller
                name="coupon"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Coupon Code" />
                )}
              />
              {errors.coupon && <Typography color="error">{errors.coupon.message}</Typography>}
            </Grid> */}
          </Grid>
          <div className={Styles.button}>
          <LoadingButton
            loading={isSubmitting}
            size="large"
            type="submit"
            variant="contained"
            sx={{ mt: 5, mb: 3 }}
          >
            Continue
          </LoadingButton>
        </div>
        </Box>
      </form>
    </div>
  );
}
