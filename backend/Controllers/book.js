const book = require('../models/book');

//GET tout les livres 
exports.allBooks = (req, res) => {
    try {
        const books = book.find();
        res.json(books);// Les livres sont envoyés au client sous forme de réponse JSON. Cela permet au front-end de recevoir les données dans un format facilement exploitable.
    } catch (error) {
        res.status(500).json({message: error.message})
    }
  };
  

//GET un seul livre
exports.getOneBook = (req, res) => {
    try {
        book.findOne({
            _userId: req.params.id
        }).then((book) => {res.status(200).json(book) })
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


//GET meilleure note moyenne des livres 
exports.averageRateBook = (req, res) => {
    try {
        const topBooks =  book.find()
        .sort({ averageRating: -1 }) // Trie les livres par averageRating décroissant
        .limit(3); // Limite à 3 résultats
        res.json(topBooks);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

//POST un nouveau livre
exports.createBook = (req, res) => {
    const newBook = new book({
      _userId: req.body.userId,
      title: req.body.title,
      author: req.body.author,
      imageUrl: req.body.imageUrl,
      year: req.body.year,
      genre: req.body.genre,
      rating: [],
      averageRating: 0
    });
    newBook.save().then(
      () => {
        res.status(201).json({
          message: 'Post saved successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };