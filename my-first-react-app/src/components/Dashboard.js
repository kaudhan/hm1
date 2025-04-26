import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, TextField, MenuItem, Alert } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import HandymanCard from './HandymanCard';

const Dashboard = () => {
  const [handymen, setHandymen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHandymen = async () => {
      try {
        const handymenRef = collection(db, 'handymen');
        const q = query(handymenRef);
        const querySnapshot = await getDocs(q);
        
        const handymenData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setHandymen(handymenData);
      } catch (error) {
        console.error('Error fetching handymen:', error);
        setError('Failed to load handymen. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHandymen();
  }, []);

  const filteredHandymen = handymen.filter(handyman => {
    if (!handyman) return false;
    
    const matchesFilter = filter === 'all' || 
      (handyman.skills && handyman.skills.includes(filter));
    
    const matchesSearch = handyman.name && 
      (handyman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (handyman.skills && handyman.skills.some(skill => 
         skill.toLowerCase().includes(searchTerm.toLowerCase())
       )));
    
    return matchesFilter && matchesSearch;
  });

  const skills = ['all', 'plumbing', 'electrical', 'carpentry', 'painting', 'cleaning'];

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography>Loading handymen...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Handymen
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            select
            label="Filter by Skill"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {skills.map((skill) => (
              <MenuItem key={skill} value={skill}>
                {skill.charAt(0).toUpperCase() + skill.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
        </Box>

        {filteredHandymen.length === 0 ? (
          <Alert severity="info">No handymen found matching your criteria.</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredHandymen.map((handyman) => (
              <Grid item xs={12} sm={6} md={4} key={handyman.id}>
                <HandymanCard handyman={handyman} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;