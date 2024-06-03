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

sessionStore.sync();

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/api/chatRoutes');
const userRoutes = require('./routes/api/userRoutes');

app.use('/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

app.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });

  
    req.flash('success', 'Thank you for signing up!');

    res.redirect('/auth/login');
  } catch (error) {
    res.status(500).send('Error registering new user.');
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      res.redirect('/chat');
    } else {
      req.flash('error', 'Invalid credentials.');
      res.redirect('/auth/login');
    }
  } catch (error) {
    res.status(500).send('Error logging in.');
  }
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy();
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

// turn on connection to db and server
const PORT = process.env.PORT || 3000;
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});




//const PORT = process.env.PORT || 3000;
//server.listen(PORT, () => {
  //console.log(`Server running on port ${PORT}`);
//});

