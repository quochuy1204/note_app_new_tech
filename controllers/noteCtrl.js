const Notes = require('../models/noteModel')

const noteCrtl = {
    createNote: async (req, res) => {
        try {
            const note = req.body

            const { name, content } = note

            if (!name) {
                return res.status(400).json({ msg: "Please enter note name." });
            }

            if (!content) {
                return res.status(400).json({ msg: "Please enter note content." });
            }

            const Newnote = new Notes({
                name, content
            })

            await Newnote.save()

            res.json({ msg: "Created." });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getAllNote: async (req, res) => {
        try {
            const notes = await Notes.find()

            res.json(notes)

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    updateNote: async (req, res) => {
        try {
            const note = req.body

            const { name, content } = note

            console.log(note)

            const id = req.params.id

            await Notes.findByIdAndUpdate({ _id: id }, {
                name,
                content
            })

            res.json({ msg: "Updated." })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    deleteNote: async (req, res) => {
        try {
            const id = req.params.id

            await Notes.findByIdAndDelete({ _id: id })

            res.json({ msg: "Deleted." })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getNoteById: async (req, res) => {
        try {
            const id = req.params.id
            const note = await Notes.findById({ _id: id })
            res.json(note)
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}

module.exports = noteCrtl