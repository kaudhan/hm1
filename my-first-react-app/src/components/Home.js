import React from 'react';
import { Container, Box, Typography, Button, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Handyman Services
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Find skilled professionals for all your home maintenance needs
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Looking for a Handyman?
              </Typography>
              <Typography paragraph>
                Browse our list of skilled professionals and book their services for your home maintenance needs.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/handymen"
              >
                Find Handymen
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Are You a Handyman?
              </Typography>
              <Typography paragraph>
                Join our platform to connect with customers and grow your business.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/handyman-signup"
              >
                Sign Up as Handyman
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;