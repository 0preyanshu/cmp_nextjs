import React from 'react';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import ForbiddenIllustration from '@/components/core/illustration403.js';

const RootStyle = styled('div')(({ theme }) => ({
  height: '80%',
  display: 'flex',
//   marginTop: -100+"px",
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
//   padding: theme.spacing(8, 2),
padding: 0,

  borderRadius: 0,
}));

function PrivilegeForbidden({ action }) {
//   const { loading } = usePrivileges();
const loading = false;
  return (
    // <Container sx={{ border: 2, borderColor: 'primary.main', px: 3, py: 5, borderRadius: 2 }}>
    <>
      {loading && (
        <CircularProgress
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      )}
      {!loading && (
        <RootStyle>
          <>
            <Box width={'50%'} mx={'auto'}>
              <ForbiddenIllustration />
            </Box>
            <Typography variant="h4" textAlign={'center'} sx={{ mt: 2 }}>
              Oops! It seems you're forbidden of action:{' '}
            </Typography>
            <Typography variant="h4" color={'primary.main'}>
              {action}
            </Typography>
          </>
        </RootStyle>
      )}
    </>
  );
}

export default PrivilegeForbidden;