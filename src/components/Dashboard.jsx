import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box, TextField, Select, MenuItem, FormControl, InputLabel, Paper, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import Graficos from './Graficos'
import Eventos from './Eventos'


const Dashboard = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [details, setDetails] = useState('');
    const userId = localStorage.getItem('userId');
    const apikey = localStorage.getItem('token');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://babytracker.develotion.com/categorias.php', {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': apikey,
                        'iduser': userId
                    }
                });
                setCategories(response.data.categorias);
            } catch (error) {
                console.error('Error fetching categories', error);
                toast.error('Error al obtener las categorías');
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await axios.get(`https://babytracker.develotion.com/eventos.php?idUsuario=${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': apikey,
                        'iduser': userId
                    }
                });
                setEvents(response.data.eventos);
            } catch (error) {
                console.error('Error fetching events', error);
                toast.error('Error al obtener los eventos');
            }
        };

        fetchCategories();
        fetchEvents();
    }, [apikey, userId]);

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!category || !date || !details) {
            toast.error('Por favor, completa todos los campos antes de agregar el evento.');
            return;
        }

        if (selectedDate.isAfter(today, 'day')) {
            toast.error('La fecha ingresada no puede ser posterior a hoy.');
            return;
        }

        const selectedTime = dayjs(date);
        const now = dayjs();

        if(selectedTime.isAfter(now)){
            toast.error('La hora ingresada no puede ser posterior a la actual');
            return;
        }
        
        try {
            const response = await axios.post('https://babytracker.develotion.com/eventos.php', {
                idCategoria: category,
                idUsuario: userId,
                detalle: details,
                fecha: date || new Date().toISOString().slice(0, 19).replace('T', ' ')
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apikey,
                    'iduser': userId
                }
            });

            if (response.data) {
                toast.success('Evento agregado con éxito');
                setCategory('');
                setDate('');
                setDetails('');
                const updatedEventos = await axios.get(`https://babytracker.develotion.com/eventos.php?idUsuario=${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': apikey,
                        'iduser': userId
                    }
                });
                setEvents(updatedEventos.data.eventos);
            }
        } catch (error) {
            console.error('Error agregar evento', error);
            toast.error('Error al agregar el evento');
        }
    };

    const handleEliminarEvento = async (eventId) => {
        try {
            await axios.delete(`https://babytracker.develotion.com/eventos.php`, {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apikey,
                    'iduser': userId
                },
                params: {
                    idEvento: eventId
                }
            });
            toast.success('Evento eliminado con éxito');

            const updatedEventos = await axios.get(`https://babytracker.develotion.com/eventos.php?idUsuario=${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apikey,
                    'iduser': userId
                }
            });
            setEvents(updatedEventos.data.eventos);
        } catch (error) {
            console.error('Error deleting event', error);
            toast.error('Error al eliminar el evento');
        }
    };

    const selectedDate = dayjs(date);
    const today = dayjs().startOf('day');
    const tomorrow = dayjs().add(1, 'day').startOf('day');
    const eventsToday = events.filter(event => dayjs(event.fecha).isAfter(today) && dayjs(event.fecha).isBefore(tomorrow));
    const pastEvents = events.filter(event => dayjs(event.fecha).isBefore(today));

    return (
        <div>
            <div className="background"></div>
            <div className="overlay"></div>
            <Container>
                <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleLogOut}
                    >
                        Logout
                    </Button>
                </Box>
                <Paper elevation={3} style={{ backgroundColor: 'rgba(245, 231, 188, 0.4)', borderRadius: '15px', padding: '2rem', backdropFilter: 'blur(10px)', marginTop: '64px' }}>
                    <Typography variant="h5" gutterBottom>
                        Agregar Evento
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <FormControl variant="outlined" fullWidth margin="normal">
                            <InputLabel id="category-label">Categoría</InputLabel>
                            <Select
                                labelId="category-label"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                label="Categoría"
                                sx={{ color: 'black' }}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.tipo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Fecha y Hora"
                            type="datetime-local"
                            fullWidth
                            margin="normal"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Detalles"
                            fullWidth
                            margin="normal"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{ marginTop: 2 }}
                        >
                            Agregar Evento
                        </Button>
                    </form>
                </Paper>
                <Box sx={{ width: '100%', marginTop: '2rem' }}>
                    <Paper elevation={3} style={{ backgroundColor: 'rgba(245, 231, 188, 0.4)', borderRadius: '15px', padding: '2rem', backdropFilter: 'blur(10px)', marginTop: '64px' }}>
                        <Typography variant="h5" gutterBottom>
                            Eventos de Hoy
                        </Typography>
                        <List>
                            {eventsToday.map((event) => {
                                const categoryInfo = categories.find(cat => cat.id === event.idCategoria);
                                const iconUrl = categoryInfo ? `https://babytracker.develotion.com/imgs/${categoryInfo.imagen}.png` : '';

                                return (
                                    <ListItem key={event.id} divider>
                                        <ListItemIcon>
                                            <img src={iconUrl} alt={event.detalle} style={{ width: 40, height: 40 }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={event.detalle}
                                            secondary={`${event.fecha}`}
                                        />
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleEliminarEvento(event.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                </Box>
                <Box sx={{ width: '100%', marginTop: '2rem' }}>
                    <Paper elevation={3} style={{ backgroundColor: 'rgba(245, 231, 188, 0.4)', borderRadius: '15px', padding: '2rem', backdropFilter: 'blur(10px)', marginTop: '64px' }}>
                        <Typography variant="h5" gutterBottom>
                            Eventos Anteriores
                        </Typography>
                        <List>
                            {pastEvents.map((event) => {
                                const categoryInfo = categories.find(cat => cat.id === event.idCategoria);
                                const iconUrl = categoryInfo ? `https://babytracker.develotion.com/imgs/${categoryInfo.imagen}.png` : '';

                                return (
                                    <ListItem key={event.id} divider>
                                        <ListItemIcon>
                                            <img src={iconUrl} alt={event.detalle} style={{ width: 40, height: 40 }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={event.detalle}
                                            secondary={`${event.fecha}`}
                                        />
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleEliminarEvento(event.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                </Box>
                <Graficos/>
                <Eventos/>
            </Container>
            <Toaster />

        </div>
    );
};

export default Dashboard;
