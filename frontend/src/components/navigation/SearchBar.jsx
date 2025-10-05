import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  useTheme
} from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{
      bgcolor: 'background.default',
      py: 3
    }}>
      <Container maxWidth="lg">
        <TextField
          fullWidth
          placeholder="Haberlerde ara..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            display: 'block'
          }}
        />
      </Container>
    </Box>
  );
};

export default SearchBar;
