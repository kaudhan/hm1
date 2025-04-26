import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  Grid, 
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const specialties = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Cleaning',
  'Gardening',
  'HVAC',
  'Appliance Repair',
  'Masonry',
  'Roofing'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const HandymanProfile = ({ 
  mode = 'view',
  handymanData: initialHandymanData = null,
  onSave = null,
  onCancel = null,
  readOnly = false
}) => {
  const [handymanData, setHandymanData] = useState(initialHandymanData || {
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'signup');

  useEffect(() => {
    if (mode === 'view' && !initialHandymanData) {
      fetchHandymanData();
    }
  }, [mode, initialHandymanData]);

  const fetchHandymanData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Please log in to view your profile');
        return;
      }

      const handymenRef = collection(db, 'handymen');
      const q = query(handymenRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        setHandymanData({
          ...data,
          id: doc.id,
          availability: data.availability || {
            days: [],
            startTime: null,
            endTime: null
          }
        });
      } else {
        setError('No handyman profile found');
      }
    } catch (error) {
      console.error('Error fetching handyman data:', error);
      setError('Error loading your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!handymanData.name || !handymanData.experience || !handymanData.hourlyRate) {
        throw new Error('Please fill in all required fields');
      }

      if (onSave) {
        await onSave(handymanData);
        setSuccess('Profile updated successfully!');
        if (mode === 'view') {
          setIsEditing(false);
        }
      } else {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Please log in to update your profile');
        }

        const handymanRef = doc(db, 'handymen', handymanData.id);
        await updateDoc(handymanRef, {
          name: handymanData.name,
          experience: parseInt(handymanData.experience),
          hourlyRate: parseFloat(handymanData.hourlyRate),
          skills: handymanData.skills,
          isAvailable: handymanData.isAvailable,
          availability: {
            days: handymanData.availability.days,
            startTime: handymanData.availability.startTime,
            endTime: handymanData.availability.endTime
          }
        });

        setSuccess('Profile updated successfully!');
        if (mode === 'view') {
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error('Error updating handyman data:', error);
      setError(error.message || 'Error updating your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (day) => {
    setHandymanData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter(d => d !== day)
          : [...prev.availability.days, day]
      }
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (!handymanData && mode === 'view') {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          {mode === 'signup' ? 'Create Your Profile' : 'Your Profile'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleUpdate} sx={{ mt: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Full Name"
                value={handymanData.name}
                onChange={(e) => setHandymanData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing || readOnly}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Years of Experience"
                type="number"
                value={handymanData.experience}
                onChange={(e) => setHandymanData(prev => ({ ...prev, experience: e.target.value }))}
                disabled={!isEditing || readOnly}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Hourly Rate ($)"
                type="number"
                value={handymanData.hourlyRate}
                onChange={(e) => setHandymanData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                disabled={!isEditing || readOnly}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Skills</InputLabel>
                <Select
                  multiple
                  value={handymanData.skills}
                  onChange={(e) => setHandymanData(prev => ({ ...prev, skills: e.target.value }))}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  disabled={!isEditing || readOnly}
                >
                  {specialties.map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Availability
              </Typography>
              <FormGroup>
                <Grid container spacing={1}>
                  {daysOfWeek.map((day) => (
                    <Grid item xs={6} key={day}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={handymanData.availability.days.includes(day)}
                            onChange={() => handleDayChange(day)}
                            disabled={!isEditing || readOnly}
                          />
                        }
                        label={day}
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Start Time"
                  value={handymanData.availability.startTime ? new Date(handymanData.availability.startTime) : null}
                  onChange={(newValue) => setHandymanData(prev => ({
                    ...prev,
                    availability: { ...prev.availability, startTime: newValue ? newValue.toISOString() : null }
                  }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  disabled={!isEditing || readOnly}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="End Time"
                  value={handymanData.availability.endTime ? new Date(handymanData.availability.endTime) : null}
                  onChange={(newValue) => setHandymanData(prev => ({
                    ...prev,
                    availability: { ...prev.availability, endTime: newValue ? newValue.toISOString() : null }
                  }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  disabled={!isEditing || readOnly}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={handymanData.isAvailable}
                    onChange={(e) => setHandymanData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    disabled={!isEditing || readOnly}
                  />
                }
                label="Currently Available for Work"
              />
            </Grid>
            <Grid item xs={12}>
              {isEditing ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  {onCancel && (
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              ) : mode === 'view' ? (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default HandymanProfile;