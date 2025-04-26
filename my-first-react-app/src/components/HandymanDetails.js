import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Paper, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebase';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import HandymanProfile from './HandymanProfile';

const HandymanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [handyman, setHandyman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    dateTime: null,
    description: '',
    address: ''
  });
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetchHandymanDetails();
  }, [id]);

  const fetchHandymanDetails = async () => {
    try {
      const docRef = doc(db, 'handymen', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Ensure availability object exists with proper structure
        const handymanData = {
          ...data,
          id: docSnap.id,
          availability: data.availability || {
            days: [],
            startTime: null,
            endTime: null
          }
        };
        setHandyman(handymanData);
      } else {
        setError('Handyman not found');
      }
    } catch (error) {
      console.error('Error fetching handyman details:', error);
      setError('Error loading handyman details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!auth.currentUser) {
      setBookingError('Please log in to book a handyman');
      return;
    }

    if (!bookingDetails.dateTime) {
      setBookingError('Please select a date and time');
      return;
    }

    if (!bookingDetails.description) {
      setBookingError('Please provide a description of the work needed');
      return;
    }

    if (!bookingDetails.address) {
      setBookingError('Please provide your address');
      return;
    }

    try {
      const bookingsRef = collection(db, 'bookings');
      await addDoc(bookingsRef, {
        handymanId: id,
        handymanName: handyman.name,
        customerId: auth.currentUser.uid,
        customerName: auth.currentUser.displayName || 'Anonymous',
        dateTime: bookingDetails.dateTime,
        description: bookingDetails.description,
        address: bookingDetails.address,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setBookingDialogOpen(false);
      navigate('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingError('Error creating booking. Please try again.');
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

  if (error || !handyman) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Handyman not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <HandymanProfile 
                mode="view"
                handymanData={handyman}
                readOnly={true}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Book This Handyman
              </Typography>
              
              {!handyman.isAvailable && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  This handyman is currently not available for bookings
                </Alert>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={() => setBookingDialogOpen(true)}
                disabled={!handyman.isAvailable}
                sx={{ mb: 2 }}
              >
                Request Booking
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/handymen')}
              >
                Back to Handymen
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book {handyman.name}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleBookingSubmit} sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Select Date and Time"
                value={bookingDetails.dateTime}
                onChange={(newValue) => setBookingDetails(prev => ({ ...prev, dateTime: newValue }))}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                minDateTime={new Date()}
              />
            </LocalizationProvider>

            <TextField
              label="Description of Work Needed"
              multiline
              rows={4}
              fullWidth
              value={bookingDetails.description}
              onChange={(e) => setBookingDetails(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Address"
              fullWidth
              value={bookingDetails.address}
              onChange={(e) => setBookingDetails(prev => ({ ...prev, address: e.target.value }))}
              sx={{ mb: 2 }}
            />

            {bookingError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {bookingError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBookingSubmit} variant="contained">
            Submit Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HandymanDetails;