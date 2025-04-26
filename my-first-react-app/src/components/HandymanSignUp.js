import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Alert } from '@mui/material';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import HandymanProfile from './HandymanProfile';

const HandymanSignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSave = async (handymanData) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Please log in to sign up as a handyman');
      }

      // Ensure all required fields are present
      if (!handymanData.name || !handymanData.experience || !handymanData.hourlyRate) {
        throw new Error('Please fill in all required fields');
      }

      const handymenRef = collection(db, 'handymen');
      const newHandyman = {
        ...handymanData,
        userId: user.uid,
        email: user.email,
        rating: 0,
        reviews: 0,
        createdAt: new Date(),
        isAvailable: handymanData.isAvailable || true,
        availability: {
          days: handymanData.availability?.days || [],
          startTime: handymanData.availability?.startTime || null,
          endTime: handymanData.availability?.endTime || null
        }
      };

      await addDoc(handymenRef, newHandyman);
      navigate('/handyman-profile');
    } catch (error) {
      console.error('Error saving handyman data:', error);
      setError(error.message || 'Error creating your profile. Please try again.');
      throw error;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Become a Handyman
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <HandymanProfile 
          mode="signup"
          onSave={handleSave}
          handymanData={{
            name: '',
            experience: '',
            hourlyRate: '',
            skills: [],
            isAvailable: true,
            availability: {
              days: [],
              startTime: null,
              endTime: null
            }
          }}
        />
      </Box>
    </Container>
  );
};

export default HandymanSignUp;