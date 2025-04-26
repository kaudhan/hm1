import React from 'react';
import { Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HandymanProfileSummary from './HandymanProfileSummary';

const HandymanCard = ({ handyman }) => {
  const navigate = useNavigate();

  // Ensure handyman object exists
  if (!handyman) {
    return null;
  }

  return (
    <Card sx={{ 
      maxWidth: 345, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 3
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <HandymanProfileSummary handyman={handyman} />
        
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(`/handyman/${handyman.id}`)}
          disabled={!handyman.isAvailable}
          sx={{
            backgroundColor: handyman.isAvailable ? '#1976d2' : '#9e9e9e',
            '&:hover': {
              backgroundColor: handyman.isAvailable ? '#1565c0' : '#757575'
            }
          }}
        >
          {handyman.isAvailable ? 'Book Now' : 'Not Available'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HandymanCard;