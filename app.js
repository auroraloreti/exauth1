const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const pool = require('./db');
require('dotenv').config();
require('./config/passport')(passport);

const app = express();
app.use(express.json());


app.use(passport.initialize());


app.use('/auth', authRoutes);

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'This is a protected route!' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));