const express = require('express');//Cette ligne importe le module Express
const path = require('path');
const app = express();//Pour créer une application Express, appelez simplement la méthode  express() 
const mongoose = require('mongoose');

const bookRoutes = require('../backend/routes/book');
const userRoutes = require('../backend/routes/user');
// Remplacez <PASSWORD> par votre mot de passe MongoDB
const uri = 'mongodb+srv://QuentinDM:pAG5lBczbjbIpw4l@datamonvieuxgrimoire.rdvicur.mongodb.net/?retryWrites=true&w=majority&appName=DataMonVieuxGrimoire';

mongoose.connect(uri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Connexion à MongoDB échouée !', error));

app.use(express.json());//Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant :
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// puis on export cette Application 
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));//voir le cour https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb/6466669-modifiez-les-routes-pour-prendre-en-compte-les-fichiers
//app.use(/api/books)//route attendu par le frontend, qui sera la racine de notre route
module.exports = app;//pour que l'on puisse l'exporter dans les autres fichiers

