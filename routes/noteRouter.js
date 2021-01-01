const express = require('express')
const router = express.Router()
const noteCtrl = require('../controllers/noteCtrl')

router.post('/create', noteCtrl.createNote);

router.get('/get_all', noteCtrl.getAllNote)

router.patch('/update/:id', noteCtrl.updateNote)

router.delete('/delete/:id', noteCtrl.deleteNote)

router.get('/get/:id', noteCtrl.getNoteById)

module.exports = router