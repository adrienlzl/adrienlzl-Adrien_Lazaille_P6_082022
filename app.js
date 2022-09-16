const express = require('express');
const mongoose = require("mongoose");
const stuffRoutes = require('./routes/sauces.route');
const app = express();
const sauce = require('./models/sauces.model');
const userRoutes = require('./routes/user.route');
const path = require('path');
const helmet = require("helmet");
const cors = require('cors')
require('dotenv').config();

app.use(express.json());

app.use(cors());

app.use(helmet());
//app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    next();
});

app.use('/api/sauces', stuffRoutes);
app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
})



mongoose.connect('mongodb+srv://'+process.env.mongoose_connectName+process.env.mongoose_connectPassword+':'+process.env.mongoose_connectLink+'retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app;

