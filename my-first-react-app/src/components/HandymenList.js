import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, TextField, CircularProgress, Alert } from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import HandymanCard from './HandymanCard';

const HandymenList = () => {
  const [handymen, setHandymen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHandymen, setFilteredHandymen] = useState([]);

  useEffect(() => {
    fetchHandymen();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHandymen(handymen);
    } else {
      const filtered = handymen.filter(handyman => 
        handyman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (handyman.skills || []).some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredHandymen(filtered);
    }
  }, [searchTerm, handymen]);

  const fetchHandymen = async () => {
    try {
      const handymenRef = collection(db, 'handymen');
      const q = query(handymenRef, where('isAvailable', '==', true));
      const querySnapshot = await getDocs(q);
      
      const handymenData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          availability: data.availability || {
            days: [],
            startTime: null,
            endTime: null
          }
        };
      });
      
      setHandymen(handymenData);
      setFilteredHandymen(handymenData);
    } catch (error) {
      console.error('Error fetching handymen:', error);
      setError('Error loading handymen. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Handymen
        </Typography>
        
        <TextField
          fullWidth
          label="Search by name or skill"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4 }}
        />

        {filteredHandymen.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No handymen found matching your search criteria.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {filteredHandymen.map((handyman) => (
              <Grid item key={handyman.id} xs={12} sm={6} md={4}>
                <HandymanCard handyman={handyman} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default HandymenList;