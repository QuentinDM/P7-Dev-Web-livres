const Book = require('../models/book');//gère les opérations CRUD 
const fs = require('fs');//interagir avec le système de fichiers du serveur.

//GET tout les livres 
exports.allBooks = async (req, res) => {
  try {
    const books = await Book.find()
    .catch(error => res.status(400).json({ error }));// si le serveur ne comprend pas la requete
    res.json(books); // Les livres sont envoyés au client sous forme de réponse JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  
//GET un seul livre
exports.getOneBook = (req, res) => {
    try {
        Book.findOne({
            _id: req.params.id
        }).then((book) => {
          res.status(200).json(book) })
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

//GET meilleure note moyenne des livres 
exports.averageRateBook = async (req, res) => {
    try {
        const topBooks = await Book.find()
        .sort({ averageRating: -1 }) // Trie les livres par averageRating décroissant
        .limit(3); // Limite à 3 résultats
        res.json(topBooks);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

// POST un nouveau livre
exports.addBook = (req, res) => {
  // Analyser les données du livre
  const bookData = JSON.parse(req.body.book);
  delete bookData._id;
  delete bookData._userId;
  
  let rating = [];

  if (bookData.ratings[0].grade !== 0) {
      rating = bookData.ratings;
  };
  
  // Créer un nouvel objet Book
  const newBook = new Book({
    ...bookData,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    ratings: rating
  });
  // Sauvegarder le livre dans la base de données
  newBook.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'})) // enregistrement du livre dans la base de données
    .catch(error => res.status(400).json({ error }));
}; 

exports.modifyBook = (req, res) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;//éviter de changer son propriétaire et nous avons vérifié que le requérant est bien le propriétaire de l’objet.
  Book.findOne({_id: req.params.id})
      .then((book) => {
        if (!book) {
          return res.status(404).json({ message: 'Livre non trouvé' }); // Erreur 404 si le livre n'est pas trouvé
        }
          if (book.userId != req.auth.userId) {
              res.status(403).json({ message : 'Not authorized'});
          } else {
              // Suppression de l'ancienne image si une nouvelle image est téléchargée
              if (req.file) {
                const oldFilename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${oldFilename}`, (err) => {
                  if (err) console.error(`Erreur lors de la suppression de l'image : ${err.message}`);
                });
              }
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// POST ajouter une note à un livre
exports.rateBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' }); // Erreur 404 si le livre n'est pas trouvé
    }

    const currentUserId = req.auth.userId;
    const existingRating = book.ratings.find(rating => rating.userId === currentUserId);
    if (existingRating) {
      return res.status(400).json({ error: 'Note déjà ajoutée auparavant.' }); // Erreur 400 si l'utilisateur a déjà noté
    }

    // Ajouter la note du livre
    book.ratings.push({
      userId: req.auth.userId,
      grade: req.body.rating
    });

    // Calcul de la moyenne des notes
    const totalRatings = book.ratings.reduce((total, rating) => total + rating.grade, 0);
    const averageRating = Math.round(totalRatings / book.ratings.length); // Arrondi à une décimale
    book.averageRating = averageRating;

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' }); // Erreur 500 si problème serveur
  }
};


exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
        if (!book) {
          return res.status(404).json({ message: 'Livre non trouvé' }); // Erreur 404 si le livre n'est pas trouvé
        }
          if (book.userId != req.auth.userId) {
              res.status(403).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {//La méthode unlink() du package fs permet de supprimer un fichier du système de fichiers.
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};