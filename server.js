const express = require('express');
const cors = require('cors');
const path = require('path');
const hbs = require('express-handlebars');
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');
const socket = require('socket.io');

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  };

io.on('connection', (socket) => {
  console.log('New socket connected! ID:', socket.id);
  socket.on('disconnect', () => {
    console.log('Socket disconnected...', socket.id);
  });
});
  
app.use(cors(corsOptions));
app.engine('.hbs', hbs());
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, '/client/build')));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/concerts', concertsRoutes);
app.use('/api/seats', seatsRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
  });

app.use((req, res) => {
    res.status(404).json({ message: 'Not found...' });
});
