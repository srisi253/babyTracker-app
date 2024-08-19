import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Paper, Typography, Box, IconButton} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
);

const Graficos = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const userId = localStorage.getItem('userId');
    const apikey = localStorage.getItem('token');

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
            console.error('Error en el fetch categories', error);
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
            console.error('Error en el fetch events', error);
        }
    };

    useEffect(() => {
        
        fetchCategories();
        fetchEvents();

        
        const intervalId = setInterval(() => {
            fetchCategories();
            fetchEvents();
        }, 1000);

        
        return () => clearInterval(intervalId);
    }, [apikey, userId]);

    const TraerCategoriasCount = () => {
        const counts = categories.reduce((acc, category) => {
            const count = events.filter(event => event.idCategoria === category.id).length;
            if (count > 0) {
                acc.push({ label: category.tipo, count });
            }
            return acc;
        }, []);
        return counts;
    };

    const ComidasSemanaPasada = () => {
        const now = new Date();
        const Semana = Array.from({ length: 7 }, (_, i) => {
            const fechaActual = new Date();
            fechaActual.setDate(now.getDate() - i);
            return fechaActual;
        }).reverse();

        const mealsPerDay = Semana.map(date => {
            const day = date.toISOString().split('T')[0];
            const count = events.filter(event => event.idCategoria === 31 && event.fecha.startsWith(day)).length;
            return { date: day, count };
        });

        return mealsPerDay;
    };

    const CalcularSiguienteBiberon = () => {
        const BiberonEventos = events.filter(event => event.idCategoria === 35).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        if (BiberonEventos.length === 0) return null;

        const ultimoBiberonTiempo = new Date(BiberonEventos[0].fecha);
        const siguienteBiberonTiempo = new Date(ultimoBiberonTiempo.getTime() + 4 * 60 * 60 * 1000);

        return siguienteBiberonTiempo;
    };

    const categoriaCount = TraerCategoriasCount();
    const comidasSemanaPasada = ComidasSemanaPasada();
    const siguienteBiberonTiempo = CalcularSiguienteBiberon();
    const timeRemaining = siguienteBiberonTiempo ? (siguienteBiberonTiempo - new Date()) : 0;
    const adjustedTimeRemaining = Math.abs(timeRemaining);
    const timeRemainingText = siguienteBiberonTiempo
        ? `${Math.floor(adjustedTimeRemaining / (1000 * 60 * 60))} horas y ${Math.floor((adjustedTimeRemaining % (1000 * 60 * 60)) / (1000 * 60))} minutos`
        : "N/A";
    const timeRemainingColor = timeRemaining > 0 ? 'green' : 'red';

    const CategoriasData = {
        labels: categoriaCount.map(c => c.label),
        datasets: [{
            label: 'Cantidad de eventos',
            data: categoriaCount.map(c => c.count),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
    };

    const ComidasData = {
        labels: comidasSemanaPasada.map(m => m.date),
        datasets: [{
            label: 'Cantidad de comidas',
            data: comidasSemanaPasada.map(m => m.count),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }]
    };

    const paperStyle = {
        backgroundColor: 'rgba(245, 231, 188, 0.4)',
        borderRadius: '15px',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        marginTop: '64px'
    };

    return (
        <div>
        <div className="background"></div>
        <div className="overlay"></div>
        <IconButton onClick={() => navigate('/dashboard')} style={{ position: 'absolute', top: '16px', left: '16px' , color: 'white'}}>
                    <ArrowBackIcon />
                </IconButton>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                <Paper elevation={3} style={{ ...paperStyle, flex: '1 1 48%', marginRight: '1%' }}>
                <Typography variant="h5">Gráfico de cantidades por categoría</Typography>
                <Bar data={CategoriasData} />
            </Paper>
                <Paper elevation={3} style={{ ...paperStyle, flex: '1 1 48%', marginRight: '1%' }}>
                <Typography variant="h5">Gráfico de comidas de la última semana</Typography>
                <Line data={ComidasData} />
            </Paper>
        </Box>
        <Paper elevation={3} style={{ ...paperStyle,padding: '2rem', marginTop: '2rem' }}>
            <Typography variant="h5">Tiempo restante para el próximo biberón</Typography>
            <Typography variant="body1" style={{ color: timeRemainingColor }}>
                {timeRemainingText}
            </Typography>
        </Paper>
    </div>
);
};

export default Graficos;
