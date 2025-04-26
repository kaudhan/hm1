import React from 'react';
import { Box, Typography, Chip, Rating } from '@mui/material';

const HandymanProfileSummary = ({ handyman }) => {
  // Ensure handyman object exists and has required properties
  if (!handyman) {
    return null;
  }

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAvailabilityText = () => {
    if (!handyman.availability) return 'Availability not set';
    
    const { days, startTime, endTime } = handyman.availability;
    if (!days || days.length === 0) return 'No specific days set';
    
    const formattedDays = days.join(', ');
    const timeRange = startTime && endTime 
      ? ` from ${formatTime(startTime)} to ${formatTime(endTime)}`
      : '';
    
    return `Available on ${formattedDays}${timeRange}`;
  };

  return (
    <Box>
      <Typography gutterBottom variant="h5" component="div">
        {handyman.name || 'Unnamed Handyman'}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {handyman.experience || 0} years of experience
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${handyman.hourlyRate || 0}/hour
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Availability:
        </Typography>
        <Typography variant="body2" color={handyman.isAvailable ? 'success.main' : 'error.main'}>
          {handyman.isAvailable ? 'Currently Available' : 'Not Available'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {getAvailabilityText()}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Skills:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {(handyman.skills || []).map((skill) => (
            <Chip 
              key={skill} 
              label={skill} 
              size="small"
              sx={{ 
                backgroundColor: '#f0f0f0',
                '&:hover': {
                  backgroundColor: '#e0e0e0'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Rating value={handyman.rating || 0} readOnly precision={0.5} />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          ({handyman.reviews || 0} reviews)
        </Typography>
      </Box>
    </Box>
  );
};

export default HandymanProfileSummary;