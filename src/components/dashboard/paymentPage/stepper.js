import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Styles from './payment.module.scss';

const steps = ['About You', 'Payment', 'Confirmation'];

export default function CustomizedStepper({ activeSection }) {
  return (
    <Box sx={{ width: '100%', margin: '20px 0' }}>
      <div className={Styles.desktop}>
        <Stepper activeStep={activeSection}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      <div className={Styles.mobile}>
        <div className={`${Styles.step} ${activeSection === 0 ? Styles.active : ''}`} />
        <div className={`${Styles.step} ${activeSection === 1 ? Styles.active : ''}`} />
        <div className={`${Styles.step} ${activeSection === 2 ? Styles.active : ''}`} />
      </div>
    </Box>
  );
}
