import React from 'react';
import { Alert, Box } from '@mui/material';

const ErrorState = ({ message }: { message: string }) => {
  return (
    <Box m={2}>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
};

export default ErrorState;