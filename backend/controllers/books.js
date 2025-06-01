const Book = require('../models/Book')
const fs = require('fs')

exports.createBooks = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id
    delete bookObject._userId
    const book = new Book ({
     ...bookObject,
     userId: req.auth.userId,
     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    book.save()
    .then(() => { res.status(201).json({message: 'livre enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const ref = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${ref}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'livre supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};
exports.modifyBook = (req, res, next)=>{ 

    if(req.file != null){
     Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const ref = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${ref}`, () => {
                    delete book.imageUrl
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
    }
    

    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body}
   
    delete bookObject._userId
    Book.findOne({_id: req.params.id}).then((book)=>{
        if (book.userId != req.auth.userId){
            res.status(401).json({message: 'non authrisé'})
        }else{
            Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
    }).catch(error=> res.status(400).json({error}))
}


exports.getAllBooks = (req, res, next) => {
    Book.find().then(books => res.status(200).json(books)).catch(error => res.status(400).json(error))  
    
   
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then((book) => {
        const ratings = book.ratings.map((rating)=> rating.grade)
        const averageRating = ratings.length > 0
       ? ratings.reduce((a, b) => a + b, 0) / ratings.length
       : null;

        book.averageRating = averageRating
        book.save()
        
        res.status(200).json(book)}
    )
    .catch(error => res.status(404).json(error))

        

}

exports.addBookRating = (req, res, next)=> {

    Book.findOne({ _id: req.params.id }).then((book) => {

        const userId = req.body.userId
        const grade = req.body.rating
        if (book.ratings.includes({ userId, grade })) {
            res.status(401).json({ message: "livre déja noté" })

        } else {
            book.ratings.push({ userId, grade })

            book.save()
            .then(() => { 
                Book.findOne({_id: req.params.id})
                .then((book) => {
                    const ratings = book.ratings.map((rating)=> rating.grade)
                    const averageRating = ratings.length > 0
                   ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                   : null;
            
                    book.averageRating = averageRating
                    book.save()
                    
                    res.status(200).json(book)}
                )})
                .catch(error => res.status(404).json(error))

            
        }




    }).catch(error => res.status(400).json({ error}))

  

}


exports.bestRating = (req,res, next) =>{
    Book.find().then((book)=>{
        const averageRatingListe = book.map((book)=> book.averageRating)
        const max = Math.max(...averageRatingListe);
        const secBest = averageRatingListe.filter(rating => rating != max)
        const secMax = Math.max(...secBest)
        const thirdBest = secBest.filter(rating => rating != secMax)
        const thirdMax = Math.max(...thirdBest)

        const bestBooks = book.filter(book => book.averageRating === max || book.averageRating === secMax || book.averageRating === thirdMax);
        const bestBooksDecr = bestBooks.sort((a,b)=> b.averageRating - a.averageRating)
        const bestBooksSliced = bestBooksDecr.slice(0,3)
        
        res.status(200).json(bestBooksSliced);

    }).catch((error)=> res.status(400).json({error}))

   
}