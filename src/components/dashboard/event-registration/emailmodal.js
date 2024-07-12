import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EmailModal = ({ open, onClose, participants }) => {
  const [emailContent, setEmailContent] = useState('');

  const handleChange = (value) => {
    setEmailContent(value);
  };

  // Extract participant emails and join them with a comma
  const participantEmails = participants.map(participant => participant.email).join(', ');

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...style }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3 }}>
          Joining Email Details
        </Typography>
        <Typography variant="h7" component="p" gutterBottom sx={{ color: 'text.secondary' }}>
          Participant Emails:
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          color="error"
          value={participantEmails}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mb: 2, color: 'text.secondary' }}
        />
        <Typography variant="h7" component="p" gutterBottom sx={{ color: 'text.secondary' }}>
          Email Subject:
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value="Welcome email template for CSM Instructor: Sourabh Jain"
          disabled
          sx={{ mb: 2, color: 'text.secondary' }}
        />
        <Typography variant="h7" component="p" gutterBottom sx={{ color: 'text.secondary' }}>
          Email Content:
        </Typography>
        <ReactQuill value={emailContent} onChange={handleChange} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="primary" onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onClose}>
            Send Email
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default EmailModal;
