const express = require('express');//Cette ligne importe le module Express

const app = express();//Pour créer une application Express, appelez simplement la méthode  express() 
const mongoose = require('mongoose');

// Remplacez <PASSWORD> par votre mot de passe MongoDB
const uri = 'mongodb+srv://QuentinDM:pAG5lBczbjbIpw4l@datamonvieuxgrimoire.rdvicur.mongodb.net/?retryWrites=true&w=majority&appName=DataMonVieuxGrimoire';

mongoose.connect(uri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Connexion à MongoDB échouée !', error));

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'je suis une requete !' });
  next();
});

app.use((req, res, next) => {
  console.log('Réponse envoyée avec succès !');
});
//app.use(/api/books)//route attendu par le frontend, qui sera la racine de notre route
module.exports = app;//pour que l'on puisse l'exporter dans les autres fichiers

