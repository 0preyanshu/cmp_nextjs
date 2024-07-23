'use client';
import { Typography, Button } from '@mui/material';
import { Controller } from 'react-hook-form';
import Styles from './styles/buyer.module.scss';

// ----------------------------------------------------------------------

export default function BasicInformation({ control, setData, formValues }) {
  const handleInputChange = (field, value) => {
    if (typeof field !== 'string') {
      console.error('field should be a string', field);
      return;
    }

    setData(field, value);
  };

  return (
    <div>
      <div className={Styles.heading}>
        <h3>Basic Information</h3>
      </div>
      <div className={Styles.details}>
        <div className={Styles.row}>
          <Typography>*Registration for:</Typography>
          <Controller
            name="for"
            control={control}
            render={({ field }) => (
              <>
                <Button
                  onClick={() => {
                    field.onChange('MY_SELF');
                    handleInputChange('for', 'MY_SELF');
                  }}
                  variant={formValues.for === 'MY_SELF' ? 'contained' : 'outlined'}
                >
                  My Self
                </Button>
                <Button
                  onClick={() => {
                    field.onChange('Someone Else');
                    handleInputChange('for', 'SOMEONE_ELSE');
                  }}
                  variant={formValues.for === 'SOMEONE_ELSE' ? 'contained' : 'outlined'}
                >
                  Someone Else
                </Button>
              </>
            )}
          />
        </div>
        <div className={Styles.row}>
          <Typography>*Number of Attendees:</Typography>
          <Controller
            name="attendees"
            control={control}
            render={({ field }) => (
              <div className={Styles.number}>
                <Button
                  className={Styles.increment}
                  onClick={() => {
                    const newValue = field.value === 1 ? 1 : field.value - 1;
                    field.onChange(newValue);
                    handleInputChange('attendees', newValue);
                  }}
                >
                  -
                </Button>
                <Button disabled className={Styles.count}>
                  {field.value}
                </Button>
                <Button
                  className={Styles.decrement}
                  onClick={() => {
                    const newValue = field.value + 1;
                    field.onChange(newValue);
                    handleInputChange('attendees', newValue);
                  }}
                >
                  +
                </Button>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
