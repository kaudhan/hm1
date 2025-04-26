import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import HandymanSignUp from './components/HandymanSignUp';
import HandymanProfile from './components/HandymanProfile';
import HandymanDetails from './components/HandymanDetails';
import HandymenList from './components/HandymenList';
import Bookings from './components/Bookings';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/handyman-signup" element={<HandymanSignUp />} />
              <Route path="/handymen" element={<HandymenList />} />
              <Route path="/handyman/:id" element={<HandymanDetails />} />
              <Route 
                path="/handyman-profile" 
                element={
                  <PrivateRoute>
                    <HandymanProfile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/bookings" 
                element={
                  <PrivateRoute>
                    <Bookings />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;