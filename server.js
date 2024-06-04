require('dotenv').config();
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const path = require('path');
const socketio = require('socket.io');
const http = require("http");

const sequelize = require('./config/connection');
const { User, Message } = require('./models');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'Sessions'
});

app.engine('handlebars', exphbs());
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

app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', authRoutes);
app.use('/api/chat', chatApiRoutes); // Use renamed identifier
app.use('/api/users', userRoutes);
app.use('/chat', chatRoutes); // Add this new route

app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

app.get('/', (req,res) => {
  res.render('home');
});

io.on('connection', (socket) => {
  console.log('New client connected');

  // Welcome current user
  socket.emit('message', 'Welcome to SportsChat!');

  // Broadcast when a user connects
  socket.broadcast.emit('message', 'A user has joined the chat');

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });

    // Listen for ChatMessage
    socket.on('chatMessage', msg => {
      io.emit('message', msg);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



