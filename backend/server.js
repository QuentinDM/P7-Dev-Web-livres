//Importation des modules nécessaires :
const http = require('http');//http: Module natif de Node.js pour créer des serveurs HTTP.

const app = require('./app');//app: Application définie dans un autre fichier (./app), une application Express.


// Fonction pour normaliser le port à partir d'une valeur donnée.
const normalizePort = val => {
  const port = parseInt(val, 10); // Convertit la valeur en nombre entier.

  if (isNaN(port)) { // Vérifie si la conversion a échoué.
    return val; // Retourne la valeur d'origine si ce n'est pas un nombre.
  }
  if (port >= 0) { // Vérifie si le port est un nombre valide et non négatif.
    return port; // Retourne le port si c'est un nombre valide.
  }
  return false; // Retourne false si le port est invalide.
};

// Détermine le port à utiliser, soit à partir d'une variable d'environnement, soit en utilisant 4000 comme valeur par défaut.
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port); // Configure l'application Express pour écouter sur le port spécifié.

// Fonction pour gérer les erreurs lors du démarrage du serveur.
const errorHandler = error => {
  if (error.syscall !== 'listen') { // Vérifie si l'erreur n'est pas liée à l'écoute.
    throw error; // Lance l'erreur si ce n'est pas une erreur d'écoute.
  }
  const address = server.address(); // Récupère l'adresse à laquelle le serveur écoute.
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // Crée une chaîne de caractères pour afficher l'adresse ou le port.
  switch (error.code) { // Vérifie le code d'erreur pour déterminer le type d'erreur.
    case 'EACCES': // Erreur de permissions (privilèges élevés requis).
      console.error(bind + ' requires elevated privileges.'); // Affiche un message d'erreur.
      process.exit(1); // Termine le processus avec un code d'erreur.
      break;
    case 'EADDRINUSE': // Erreur lorsque le port est déjà utilisé.
      console.error(bind + ' is already in use.'); // Affiche un message d'erreur.
      process.exit(1); // Termine le processus avec un code d'erreur.
      break;
    default:
      throw error; // Lance toute autre erreur non prévue.
  }
};

// Crée un serveur HTTP en utilisant l'application Express.
const server = http.createServer(app);

// Ajoute un gestionnaire d'événements pour les erreurs du serveur.
server.on('error', errorHandler);

// Ajoute un gestionnaire d'événements pour l'événement 'listening' lorsque le serveur commence à écouter les requêtes.
server.on('listening', () => {
  const address = server.address(); // Récupère l'adresse à laquelle le serveur écoute.
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Crée une chaîne de caractères pour afficher l'adresse ou le port.
  console.log('Listening  ' + bind); // Affiche un message indiquant que le serveur est en écoute.
});

// Démarre le serveur et commence à écouter les requêtes sur le port spécifié.
server.listen(port);
  