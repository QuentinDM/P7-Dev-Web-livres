const Book = require('../models/book');

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
exports.addBook = async (req, res) => {
  try {
    // Analyser les données du livre
    const bookData = JSON.parse(req.body.book);
    delete bookData._id;
    delete bookData._userId;
    // Créer un nouvel objet Book
    const newBook = new Book({
      ...bookData,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      ratings: [],
      averageRating: 0
    });
   
    // Sauvegarder le livre dans la base de données
    const savedBook = await newBook.save();
    // Répondre avec un message de succès
    res.status(201).json({ message: 'Book saved successfully!', book: savedBook });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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

exports.rateBook =  async (req, res) => {
  const { userId, rating } = req.body;

  if (rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5.' });
  }

  try {
      const book = await Book.findById(req.params.id);

      if (!book) {
          return res.status(404).json({ error: 'Livre non trouvé.' });
      }

      const existingRating = book.ratings.find(r => r.userId === userId);

      if (existingRating) {
          return res.status(400).json({ error: 'Vous avez déjà noté ce livre.' });
      }

      book.ratings.push({ userId, rating });
      book.averageRating = book.ratings.reduce((sum, r) => sum + r.rating, 0) / book.ratings.length;

      await book.save();
      res.json(book);
  } catch (error) {
      res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await Book.deleteOne({
      id: req.id
    }).then((book) => {res.status(200).json(book) })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}