require('dotenv').config();
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const path = require('path');
const socketIO = require('socket.io');

const sequelize = require('./config/connection');
const { User, Message } = require('./models');

const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);

const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'Sessions'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  })
);

app.use(flash());

sessionStore.sync();

const authRoutes = require('./routes/authRoutes');
const chatApiRoutes = require('./routes/api/chatRoutes'); // Use renamed identifier
const userRoutes = require('./routes/api/userRoutes');
const chatRoutes = require('./routes/chatRoutes'); // Add this new route

app.use('/auth', authRoutes);
app.use('/api/chat', chatApiRoutes); // Use renamed identifier
app.use('/api/users', userRoutes);
app.use('/chat', chatRoutes); // Add this new route

app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
