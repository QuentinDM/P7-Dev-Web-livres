const express = require('express');
const auth = require('../middlewares/auth');
const bookControl = require('../Controllers/book');
const multer = require('../middlewares/multer-config')
const resizeImage = require("../middlewares/sharp-config");
const router = express.Router();
//qui gere la gestion des livres dans une application Express, utilisant divers middlewares
//Router GET
router.get('/',  bookControl.allBooks);//Renvoie un tableau de tous les livres de la base de
//données. 
router.get('/bestrating', bookControl.averageRateBook);//Renvoie un tableau des 3 livres de la base de
//données ayant la meilleure note moyenne

router.get('/:id', bookControl.getOneBook);//Renvoie le livre avec l’_id fourni.


//Router POST
router.post('/', auth, multer, resizeImage ,bookControl.addBook);
//ajouter un livre a la BDD

router.post('/:id/rating', auth, bookControl.rateBook);


//Router PUT
router.put('/:id', auth, multer, resizeImage, bookControl.modifyBook);
//Met à jour le livre avec l'_id fourni. 


//Router DELETE
router.delete('/:id', auth, bookControl.deleteBook);
//Supprime le livre avec l'_id fourni ainsi que l’image
//associée.

module.exports = router;