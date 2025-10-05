import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{
      bgcolor: 'background.default',
      py: { xs: 2, md: 3 }
    }}>
      <Container maxWidth="lg">
        <TextField
          fullWidth
          placeholder="Haberlerde ara..."
          value={searchTerm}
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
