import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton
} from '@mui/material';
import {
  Dashboard,
  Article,
  People,
  Settings,
  Add,
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [stats] = useState({
    totalArticles: 142,
    totalUsers: 1250,
    todayViews: 8430,
    pendingArticles: 7
  });

  const [recentArticles] = useState([
    { id: 1, title: 'Teknoloji Dünyasında Son Gelişmeler', status: 'published', author: 'Admin', date: '2025-01-07' },
    { id: 2, title: 'Spor Haberleri Özeti', status: 'draft', author: 'Editor', date: '2025-01-07' },
    { id: 3, title: 'Ekonomik Göstergeler', status: 'pending', author: 'Writer', date: '2025-01-06' },
    { id: 4, title: 'Sağlık Sektörü Analizi', status: 'published', author: 'Admin', date: '2025-01-06' }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published': return 'Yayında';
      case 'draft': return 'Taslak';
      case 'pending': return 'Beklemede';
      default: return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Admin Paneli
      </Typography>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Article color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Toplam Makale
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalArticles}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Toplam Kullanıcı
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalUsers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Visibility color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Bugünkü Görüntüleme
                  </Typography>
                  <Typography variant="h5">
                    {stats.todayViews.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Dashboard color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Bekleyen Makale
                  </Typography>
                  <Typography variant="h5">
                    {stats.pendingArticles}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Son Makaleler Tablosu */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6">
            Son Makaleler
          </Typography>
          <Button variant="contained" startIcon={<Add />}>
            Yeni Makale
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Başlık</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Yazar</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Typography variant="body2">
                      {article.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(article.status)}
                      color={getStatusColor(article.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>{article.date}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="info">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
