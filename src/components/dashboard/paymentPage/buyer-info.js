'use client';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Typography, TextField, Grid, Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Styles from './styles/buyer.module.scss';

export default function BuyerInformation({ control, errors, onSubmit, setData, isSubmitting }) {

  const handleChange = (name, value) => {
    setData(name, value);
  };

  return (
    <div>
      <div className={Styles.heading}>
        Buyer Information
      </div>
      <form onSubmit={onSubmit}>
        <Box mt={5} sx={{ color: "black",p:2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="First Name" sx={{ color: "black" }} />
                )}
              />
              {errors.first_name && <Typography color="error">{errors.first_name.message}</Typography>}
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Last Name" sx={{ color: "black" }} />
                )}
              />
              {errors.last_name && <Typography color="error">{errors.last_name.message}</Typography>}
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Email" type="email" sx={{ color: "black" }} />
                )}
              />
              {errors.email && <Typography color="error">{errors.email.message}</Typography>}
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="number"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Phone Number" sx={{ color: "black" }} />
                )}
              />
              {errors.number && <Typography color="error">{errors.number.message}</Typography>}
            </Grid>
          </Grid>
          <div className={Styles.button}>
            <LoadingButton
              loading={isSubmitting}
              size="large"
              type="submit"
              variant="contained"
              sx={{ mt: 5, mb: 3, color: "white" }}
            >
              Continue
            </LoadingButton>
          </div>
        </Box>
      </form>
    </div>
  );
}
