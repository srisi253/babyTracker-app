import { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Alert, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await axios.post("https://babytracker.develotion.com/login.php", {
        usuario: username,
        password: password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        localStorage.setItem("token", response.data.apiKey);
        localStorage.setItem("userId", response.data.id);
        const userid = localStorage.getItem("userId");
        console.log(userid);
        setError("");
        toast.success(`¡Bienvenido, ${username}!`);

        setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
      }
    } catch (err) {
      setError("Error en el inicio de sesión, por favor intenta nuevamente");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="background"></div>
      <div className="overlay"></div>
    <Container>
    <Paper elevation={3} style={{ backgroundColor: 'rgba(245, 231, 188, 0.4)', borderRadius: '15px', padding: '2rem', backdropFilter: 'blur(10px)'}}>
        <Toaster position="top-center" />
      <Typography variant="h4" gutterBottom>
        Iniciar Sesión
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Usuario"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Contraseña"
        variant="outlined"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        margin="normal"
        onClick={handleLogin}
      >
        Iniciar Sesión
      </Button>
      </Paper>
    </Container>
    </div>
  );
};

export default Login;
