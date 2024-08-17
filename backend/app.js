const express = require('express');//Cette ligne importe le module Express
const path = require('path');// Importation du module path pour manipuler les chemins de fichiers.
const app = express();//Pour créer une application Express, appelez simplement la méthode  express() 
const mongoose = require('mongoose');// permet de définir des schémas pour la BDD

const bookRoutes = require('../backend/routes/book');
const userRoutes = require('../backend/routes/user');

// URI de connexion à la base de données MongoDB.
const uri = 'mongodb+srv://QuentinDM:pAG5lBczbjbIpw4l@datamonvieuxgrimoire.rdvicur.mongodb.net/?retryWrites=true&w=majority&appName=DataMonVieuxGrimoire';

// Connexion à la base de données MongoDB en utilisant Mongoose.
mongoose.connect(uri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Connexion à MongoDB échouée !', error));

app.use(express.json());// Cela permet à Express de traiter les données JSON envoyées dans les requêtes HTTP.

// Middleware pour gérer les en-têtes CORS (Cross-Origin Resource Sharing).
app.use((req, res, next) => {
  // Permet les requêtes de toutes les origines.
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Définit les en-têtes autorisés dans les requêtes.
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Définit les méthodes HTTP autorisées.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Définition des routes pour les opérations sur les livres et les utilisateurs.
app.use('/api/books', bookRoutes); // Routes pour les livres accessibles à partir de /api/books.
app.use('/api/auth', userRoutes); // Routes pour l'authentification des utilisateurs accessibles à partir de /api/auth.

// Middleware pour servir les fichiers statiques (comme les images) depuis le dossier 'images'.
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'application Express pour pouvoir l'utiliser dans d'autres fichiers (comme le fichier server.js).
module.exports = app;

