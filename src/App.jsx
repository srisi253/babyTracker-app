import { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { Container, Typography, LinearProgress, Box, Button } from '@mui/material';
import BabyIcon from '../public/baby-svgrepo-com.svg';

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const token = localStorage.getItem('token');
  const isAuthenticated = token && token !== 'undefined' && token !== 'null';
  console.log(token);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev === 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="background"></div>
      <div className="overlay"></div>
      <Container>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <img src={BabyIcon} alt="Baby Icon" style={{ width: 60, marginBottom: 2 }} />
            <LinearProgress variant="determinate" value={progress} sx={{ width: '100%', maxWidth: 600, marginBottom: 2, marginTop: 2 }} />
            <Typography variant="h6" align="center">Cargando...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Typography variant="h2" gutterBottom>
              Seguimiento de Bebé
            </Typography>
            {isAuthenticated ? (
              <Button component={Link} to="/dashboard" variant="contained" color="primary" sx={{ margin: 1 }}>
                Ir al Dashboard
              </Button>
            ) : (
              <>
                <Button component={Link} to="/login" variant="contained" color="primary" sx={{ margin: 1 }}>
                  Iniciar Sesión
                </Button>
                <Button component={Link} to="/register" variant="contained" color="secondary" sx={{ margin: 1 }}>
                  Registrarse
                </Button>
              </>
            )}
          </Box>
        )}
      </Container>
    </div>
  );
}

export default App;
