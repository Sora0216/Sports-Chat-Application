require('dotenv').config();
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const sequelize = require('./config/connection');
const { User, Message } = require('./models');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'Sessions'
});
const hbs = exphbs.create({
  helpers: {
    ifCond: function (v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
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
const chatApiRoutes = require('./routes/api/chatRoutes');
const userRoutes = require('./routes/api/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
app.use('/auth', authRoutes);
app.use('/api/chat', chatApiRoutes);
app.use('/api/users', userRoutes);
app.use('/chat', chatRoutes);
app.get('/', (req, res) => {
  res.render('login', { error: req.flash('error') });
});
app.get('/chat', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  res.render('chat', { username: req.session.username });
});
io.on('connection', async (socket) => {
  console.log('New WebSocket connection');
  socket.on('joinRoom', async ({ username, room }) => {
    socket.join(room);
    console.log(`${username} has joined room: ${room}`);
    try {
      const messages = await Message.findAll({
        where: { room },
        include: [{ model: User, attributes: ['username'] }],
        order: [['createdAt', 'ASC']]
      });
      socket.emit('previousMessages', messages);
    } catch (error) {
      console.error('Error retrieving messages:', error);
    }
  });
  
  socket.on('chatMessage', async (msg) => {
    try {
      const user = await User.findOne({ where: { username: msg.username } });
      if (user) {
        const newMessage = await Message.create({
          content: msg.message,
          userId: user.id,
          room: msg.room 
        });
        io.to(msg.room).emit('message', { username: user.username, message: newMessage.content });
      }
    } catch (error) {
      console.error('Error handling chat message:', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

