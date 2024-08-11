const sharp = require('sharp');// redimension d'images
const fs = require('fs');//interagir avec le système de fichiers du serveur.


const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  sharp(req.file.path)
  .resize(250, 400) 
  .webp({ quality: 80 })
  .toFile('images/' + req.file.filename.replace(/\.(jpg|jpeg|png)$/, '.webp'))
  .then(() => {
    req.file.filename = req.file.filename.replace(/\.(jpg|jpeg|png)$/, '.webp');

    
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error('Erreur supprssion du fichier original:', err);
      }
      next();
    });
  })
  .catch((error) => {
    console.error('Image erreur:', error);
    next();
  });
};

module.exports = resizeImage;