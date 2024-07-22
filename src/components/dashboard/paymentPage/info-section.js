'use client'
import { Typography, Button, Stack } from '@mui/material';
import { useEffect } from 'react';
import Styles from './styles/infosection.module.scss';

export default function InfoSection({ setActiveSection, data }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('Sending email for order ID:', data?.orderId);
    }, 60000);

    return () => clearTimeout(timeout);
  }, [data?.orderId]);

  return (
    <div className={Styles.container}>
      <div className={Styles.wrapper}>
        <div className={Styles.card}>
          <Typography variant="body1">{data.for}</Typography>
          <div className={Styles.number}>{data.attendees}</div>
        </div>
        <Typography variant="body1">{data.first_name} {data.last_name}</Typography>
        <Typography variant="body1">{data.email}</Typography>
        <Typography variant="body1">{data.number}</Typography>
      </div>
      <Button variant="outlined" onClick={() => setActiveSection(0)}>
        Edit
      </Button>
    </div>
  );
}
