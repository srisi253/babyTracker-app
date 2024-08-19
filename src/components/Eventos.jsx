import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Table, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Eventos = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const userId = localStorage.getItem('userId');
    const apikey = localStorage.getItem('token');

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

    useEffect(() => {
        fetchEvents();

        const intervalId = setInterval(fetchEvents, 1000);
        return () => clearInterval(intervalId);
    }, [apikey, userId]);

    const isToday = (someDate) => {
        const today = new Date();
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear();
    };

    const CalcularDataBiberones = () => {
        const biberonesEventosHoy = events.filter(event => event.idCategoria === 35 && isToday(new Date(event.fecha)));
        const BiberonEventos = events.filter(event => event.idCategoria === 35);

        const TotalBiberones = biberonesEventosHoy.length;

        let ultimoBiberonTiempo = null;
        if (TotalBiberones > 0) {
            ultimoBiberonTiempo = new Date(Math.max(...biberonesEventosHoy.map(event => new Date(event.fecha))));
        } else if (BiberonEventos.length > 0) {
            ultimoBiberonTiempo = new Date(Math.max(...BiberonEventos.map(event => new Date(event.fecha))));
        }

        return { total: TotalBiberones, lastTime: ultimoBiberonTiempo };
    };

    const CalcularPanalesData = () => {
        const diaperEventsToday = events.filter(event => event.idCategoria === 33 && isToday(new Date(event.fecha)));
        const diaperEvents = events.filter(event => event.idCategoria === 33);

        const TotalPanales = diaperEventsToday.length;

        let TiempoUltimoPanal = null;
        if (TotalPanales > 0) {
            TiempoUltimoPanal = new Date(Math.max(...diaperEventsToday.map(event => new Date(event.fecha))));
        } else if (diaperEvents.length > 0) {
            TiempoUltimoPanal = new Date(Math.max(...diaperEvents.map(event => new Date(event.fecha))));
        }

        return { total: TotalPanales, lastTime: TiempoUltimoPanal };
    };

    const { total: TotalBiberones, lastTime: ultimoBiberonTiempo } = CalcularDataBiberones();
    const { total: TotalPanales, lastTime: TiempoUltimoPanal } = CalcularPanalesData();

    const formatTimeElapsed = (date) => {
        if (!date) return "N/A";
        const now = new Date();
        const elapsed = now - date;
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours} horas y ${minutes} minutos`;
    };

    const paperStyle = {
        backgroundColor: 'rgba(245, 231, 188, 0.4)',
        borderRadius: '15px',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        marginTop: '64px',
    };

    return (
        <div>
            <div className="background"></div>
            <div className="overlay"></div>
            <div>
                <IconButton onClick={() => navigate('/dashboard')} style={{ position: 'absolute', top: '16px', left: '16px', color: 'white' }}>
                    <ArrowBackIcon />
                </IconButton>

                <Paper elevation={3} style={paperStyle}>
                    <Typography variant="h5" gutterBottom>
                        Biberones
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Total de biberones ingeridos en el día</TableCell>
                                    <TableCell>{TotalBiberones}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Tiempo transcurrido desde el último biberón</TableCell>
                                    <TableCell>{formatTimeElapsed(ultimoBiberonTiempo)}</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                </Paper>

                <Paper elevation={3} style={{ ...paperStyle, marginTop: '2rem' }}>
                    <Typography variant="h5" gutterBottom>
                        Pañales
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Total de pañales cambiados en el día</TableCell>
                                    <TableCell>{TotalPanales}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Tiempo transcurrido desde el último cambio</TableCell>
                                    <TableCell>{formatTimeElapsed(TiempoUltimoPanal)}</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </div>
    );
};

export default Eventos;
