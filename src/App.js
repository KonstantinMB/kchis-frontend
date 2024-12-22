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
import { Download, OpenInNew } from '@mui/icons-material';
import Confetti from "react-confetti";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  fontWeight: 600,
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
  },
}));

const App = () => {
  const backendUrl = "https://kchis-backend.onrender.com"; // Replace with your backend URL
  const [confetti, setConfetti] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);

  const downloadExcel = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/download`);
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.error || "Възникна неизвестна грешка.");
        setErrorOpen(true);
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "properties.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);

        setMessage("Изтеглянето започна успешно!");
        setConfetti(true); // Trigger confetti
        setTimeout(() => setConfetti(false), 5000); // Stop confetti after 5 seconds
      }
    } catch (error) {
      setMessage("Възникна грешка при изтеглянето. Моля, опитайте отново.");
      setErrorOpen(true);
    } finally {
      setLoading(false);
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
        background: 'linear-gradient(135deg, #f6f8fc, #e9efff)',
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
                  Данни за Сделки в КЧИС
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
                  Excel файлът се актуализира ежедневно. Ако искате най-актуалните данни, винаги можете да го изтеглите, като натиснете бутона по-долу.
                </Typography>
              </Fade>

              <Box 
                mt={4} 
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <StyledButton 
                  variant="contained"
                  onClick={downloadExcel}
                  startIcon={<Download />}
                  sx={{
                    backgroundColor: '#2196f3',
                    color: 'white',
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={24} color="inherit" />
                      Изтегляне...
                    </Box>
                  ) : (
                    "Изтегли Excel"
                  )}
                </StyledButton>

                <StyledButton
                  variant="outlined"
                  startIcon={<OpenInNew />}
                  onClick={() => window.open("https://sales.bcpea.org/properties", "_blank")}
                  sx={{
                    borderColor: '#f50057',
                    color: '#f50057',
                  }}
                >
                  Посетете реалния сайт на КЧИС
                </StyledButton>
              </Box>
            </Box>
          </StyledPaper>
        </Container>
      </Fade>

      {/* Confetti Effect */}
      {confetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

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
