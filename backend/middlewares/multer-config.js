const multer = require('multer');

// Définition des types MIME pour les extensions de fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration de multer pour utiliser la mémoire RAM comme stockage
const storage = multer.memoryStorage();
//traite les fichiers immédiatement après téléchargement sans les sauvegarder temporairement sur le disque
// Export du middleware multer configuré pour gérer un seul fichier 'image'
module.exports = multer({ storage: storage }).single('image');


