const mongoose = require('mongoose'); //simplifie les interactions entre une application Node.js et une base de données MongoDB. Une solution plus structurée pour gérer les documents MongoDB avec des modèles et des schémas.

const bookSchema = mongoose.Schema({
    userId : {type: String, required: true}, // identifiant MongoDB unique de l'utilisateur qui a créé le livre
    title : {type: String, required: true}, // titre du livre
    author : {type: String, required: true}, // auteur du livre
    imageUrl : {type: String, required: true}, // illustration/couverture du livre
    year: {type: Number, required: true},// année de publication du livre
    genre: {type: String, required: true}, // genre du livre
    ratings: [ // notes données à un livre
        {
            userId: { type: String, require: true },
            grade: { type: Number, require: true, min: 0, max: 5 },
        },
    ],
    averageRating : {type: Number, default: 0} // note moyenne du livre
    }
    );

//La méthode  model  transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model('Book', bookSchema);