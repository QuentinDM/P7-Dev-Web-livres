const Book = require('../models/book');
const fs = require('fs');//interagir avec le système de fichiers du serveur.

//GET tout les livres 
exports.allBooks = async (req, res) => {
  try {
    const books = await Book.find();// Vous devez attendre que la promesse soit résolue avant de renvoyer les livres au client. En utilisant async/await
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
        }).then((book) => {res.status(200).json(book) })
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
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.rateBook = async (req, res) => {
  await Book.findOne({ _id: req.params.id })  //recherche via le paramètre id
  .then(book => {
    const currentUserId = req.auth.userId; 
    const existingRating = book.ratings.find(rating => rating.userId === currentUserId);
    if (existingRating) {
      return res.status(400).json({ error: 'Note déjà ajoutée auparavant.' });
    }
    //envoie de la note du livre 
    book.ratings.push({
      userId: req.auth.userId,
      grade: req.body.rating
    });
    //calcul des moyennes de rating 
    const totalRatings = book.ratings.reduce((total, rating) => total + rating.grade, 0); //méthode réduce pour parcourir
    const averageRating = totalRatings / book.ratings.length;  //obtention de la moyenne 
    book.averageRating = averageRating; //moyenne calculé et ajouté à averageRating

    book.save()
      .then(() => {
        res.status(200).json(book);
      })
      .catch(error => {
        res.status(400).json({ error: error.message });
      });
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
};


exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {//La méthode unlink() du package  fs  vous permet de supprimer un fichier du système de fichiers.
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