import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { TextField, Button, Container, Typography, MenuItem, Select, InputLabel, FormControl, Alert, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { fetchDepartments, fetchCities } from '../features/departaments/departamentsSlice';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const departments = useSelector(state => state.departments.departments);
    const citiesByDepartment = useSelector(state => state.departments.citiesByDepartment);
    const status = useSelector(state => state.departments.status);
    //const errorMsg = useSelector(state => state.departments.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDepartments());
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (department && !citiesByDepartment[department]) {
            dispatch(fetchCities(department));
        }
    }, [department, dispatch, citiesByDepartment]);

    const handleRegister = async () => {
        if (!username || !password || !department || !city) {
            setError('Por favor completa todos los campos');
            return;
        }

        try {
            const response = await axios.post('https://babytracker.develotion.com/usuarios.php', {
                usuario: username,
                password: password,
                idDepartamento: department,
                idCiudad: city
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                setSuccess(true);
                setError('');
                toast.success('Usuario registrado con éxito');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError('Error en el registro, por favor intenta nuevamente');
            console.error(err);
        }
    };

    const handleDepartmentChange = (event) => {
        setDepartment(event.target.value);
        setCity('');
    };

    return (
        <div>
            <div className="background"></div>
            <div className="overlay"></div>
            <Container>
                <Paper elevation={3} style={{ backgroundColor: 'rgba(245, 231, 188, 0.4)', borderRadius: '15px', padding: '2rem', backdropFilter: 'blur(10px)' }}>
                    <Typography variant="h4" gutterBottom>
                        Registro de Usuario
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">Usuario registrado con éxito</Alert>}
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
                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel>Departamento</InputLabel>
                        <Select
                            value={department}
                            onChange={handleDepartmentChange}
                            label="Departamento"
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept.id} value={dept.id}>
                                    {dept.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" fullWidth margin="normal" disabled={!department}>
                        <InputLabel>Ciudad</InputLabel>
                        <Select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            label="Ciudad"
                        >
                            {department && citiesByDepartment[department]?.map((c) => (
                                <MenuItem key={c.id} value={c.id}>
                                    {c.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        margin="normal"
                        onClick={handleRegister}
                    >
                        Registrar
                    </Button>
                </Paper>
            </Container>
        </div>
    );
}

export default Register;
