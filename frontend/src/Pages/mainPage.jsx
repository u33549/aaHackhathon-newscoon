import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

function MainPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h2" component="h1" color="primary" gutterBottom>
                    Ana Sayfa
                </Typography>
                <Typography variant="h6" color="text.primary">
                    React Router ve Material-UI başarıyla kuruldu!
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" color="text.primary">
                        Bu proje Material-UI'nin dark teması ile yapılandırılmıştır.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default MainPage;