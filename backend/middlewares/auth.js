const jwt = require('jsonwebtoken');//gére l'authentification et l'autorisation de manière sécurisée et vérifie la validité du token JWT dans les requêtes.
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];//nous recuperons notre token, on split la chaine de caractere en un tableau autour de l,espace qui se trouve entre le mot Bearer et le token, puis nous voulons bien recuperer le token avec [1].
       // Vérifie que le token est valide et le décode 
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       //Récupère l'ID utilisateur du token décodé
       const userId = decodedToken.userId;
       //Cela permet aux autres middlewares ou routes d'accéder aux informations d'authentification.
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};
