const express = require('express')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const sharp = require('../middleware/sharp-config')
const booksCrtl = require('../controllers/books')

const router = express.Router()


router.get('/bestrating', booksCrtl.bestRating)
router.get("/", booksCrtl.getAllBooks )
router.get('/:id', booksCrtl.getOneBook)
router.post('/',auth, multer, sharp, booksCrtl.createBooks)
router.delete('/:id', auth, booksCrtl.deleteBook)
router.put('/:id', auth, multer,sharp, booksCrtl.modifyBook)
router.post('/:id/rating', auth, booksCrtl.addBookRating)


module.exports =router