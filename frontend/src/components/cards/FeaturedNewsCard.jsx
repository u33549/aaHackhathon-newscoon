import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme
} from '@mui/material';
import { categoryColors } from '../../constants/index.jsx';

const FeaturedNewsCard = ({ news }) => {
  const theme = useTheme();
  const categoryColor = categoryColors[news.category?.toLowerCase()] || 'primary.main';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        borderLeft: `4px solid ${categoryColor}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[6]
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Category Chip */}
        <Chip
          label={news.category}
          size="small"
          sx={{
            bgcolor: categoryColor,
            color: 'white',
            fontWeight: 600,
            mb: 2
          }}
        />

        {/* Summary */}
        <Typography
          variant="body1"
          component="p"
          sx={{
            lineHeight: 1.6,
            color: 'text.primary'
          }}
        >
          {news.summary}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeaturedNewsCard;
