<<<<<<< HEAD
import React from 'react';
=======
import React, { useState } from 'react';
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Search } from '@mui/icons-material';

<<<<<<< HEAD
const SearchBar = ({ searchQuery, onSearchChange, placeholder = "Haberlerde ara..." }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSearchChange = (event) => {
    onSearchChange(event.target.value);
=======
const SearchBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
  };

  return (
    <Box sx={{
      bgcolor: 'background.default',
      py: { xs: 1, md: 3 }
    }}>
      <Container maxWidth="lg">
        <TextField
          fullWidth
<<<<<<< HEAD
          placeholder={placeholder}
          value={searchQuery}
=======
          placeholder="Haberlerde ara..."
          value={searchTerm}
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
          onChange={handleSearchChange}
          size={isMobile ? "medium" : "medium"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" fontSize={isMobile ? "medium" : "medium"} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: { xs: '100%', md: 600 },
            mx: 'auto',
            display: 'block',
            '& .MuiOutlinedInput-root': {
              fontSize: { xs: '0.9rem', md: '1rem' },
              height: { xs: 48, md: 56 }
            }
          }}
        />
      </Container>
    </Box>
  );
};

export default SearchBar;
