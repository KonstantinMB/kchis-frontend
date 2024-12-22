import React, { useState } from "react";
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  Paper,
  Fade,
  Grow,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Download, Refresh } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'white',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(2),
  backgroundColor: '#2ecc71',
  color: 'white',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#27ae60',
    boxShadow: '0 6px 15px rgba(0, 255, 0, 0.2)',
  },
  '&:disabled': {
    backgroundColor: '#bdc3c7',
  },
}));

const App = () => {
  const backendUrl = "https://kchis-backend.onrender.com"; // Replace with your backend URL
  const [message, setMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);

  const downloadExcel = async () => {
    try {
      const response = await fetch(`${backendUrl}/download`);
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.error || "Възникна неизвестна грешка.");
        setErrorOpen(true);
      } else {
        // Process the response as a blob
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
  
        // Create a temporary download link
        const a = document.createElement("a");
        a.href = url;
        a.download = "kchis-data.xlsx"; // Set the downloaded file name
        document.body.appendChild(a); // Append to the document
        a.click(); // Trigger the download
        a.remove(); // Remove the link after triggering
  
        setMessage("Изтеглянето започна успешно!");
        setErrorOpen(true);
      }
    } catch (error) {
      setMessage("Възникна грешка при изтеглянето. Моля, опитайте отново.");
      setErrorOpen(true);
    }
  };
  

  const handleError = (errorMessage) => {
    setMessage(errorMessage);
    setErrorOpen(true);
  };

  const handleClose = () => {
    setErrorOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: '24px',
      }}
    >
      <Fade in timeout={1000}>
        <Container maxWidth="sm">
          <StyledPaper elevation={3}>
            <Box textAlign="center">
              <Grow in timeout={800}>
                <Typography 
                  variant="h3" 
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    mb: 4,
                  }}
                >
                  КЧИС Екстрактор
                </Typography>
              </Grow>

              <Fade in timeout={1200}>
                <Typography 
                  variant="body1" 
                  gutterBottom
                  sx={{ 
                    fontSize: '1rem',
                    color: '#666',
                    maxWidth: '600px',
                    margin: '0 auto',
                    mb: 4,
                  }}
                >
                  Този инструмент извлича данни за сделки ежедневно () и ви позволява да експортирате данните като Excel файл. Използвайте бутона по-долу, за да изтеглите последния файл.
                </Typography>
              </Fade>

              <Box 
                mt={4} 
                sx={{
                  display: 'flex',
                  gap: 3,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <StyledButton 
                  variant="contained"
                  onClick={downloadExcel}
                  startIcon={<Download />}
                >
                  Изтегли Excel
                </StyledButton>
              </Box>
            </Box>
          </StyledPaper>
        </Container>
      </Fade>

      {/* Snackbar for feedback */}
      <Snackbar 
        open={errorOpen} 
        autoHideDuration={6000} 
        onClose={handleClose} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
