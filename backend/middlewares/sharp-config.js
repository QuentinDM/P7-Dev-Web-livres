const sharp = require('sharp'); // Bibliothèque pour le traitement d'images
const path = require('path'); // Bibliothèque pour manipuler les chemins de fichiers

const resizeImage = async (req, res, next) => {
  if (!req.file) {
    // Si aucun fichier n'est fourni, passe au middleware suivant
    return next();
  }

  // Extraction du nom du fichier sans extension
  const originalName = path.parse(req.file.originalname).name; //utile pour créer un nouveau nom de fichier unique pour la version optimisée de l'image.

  // Génération d'un nom de fichier unique pour la sortie WebP
  const filename = `${originalName}.webp`;
  const outputPath = path.join('images', filename);

  try {
    // Utilisation de sharp pour redimensionner et convertir l'image
    await sharp(req.file.buffer)//charge l'image depuis la mémoire
      .resize(250, 400) 
      .webp({ quality: 80 }) //compression de l'image
      .toFile(outputPath); // Enregistrement de l'image traitée sur le disque

    // Mise à jour des informations de fichier dans l'objet de requête
    req.file.filename = filename;
    req.file.path = outputPath;

    // Passe au middleware suivant après le traitement
    next();
  } catch (error) {
    // Gestion des erreurs pendant le traitement de l'image
    console.error('Erreur lors du redimensionnement de l\'image:', error);
    next(error); // Passe au middleware suivant avec l'erreur
  }
};

module.exports = resizeImage;