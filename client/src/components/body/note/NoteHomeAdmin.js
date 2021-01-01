import React, { useState, useEffect } from 'react'
import { Table, Form, Button, Badge } from 'react-bootstrap'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './notehome.css'
import swal from 'sweetalert';
import { isEmpty } from '../../utils/validation/Validation'

function NoteHomeAdmin() {

    //initial state for handleCreateNote function
    const [newNote, setNewNote] = useState('')

    //get name and content from newNote
    const { name, content } = newNote

    //function to handle change
    const handleChange = e => {
        const { name, value } = e.target
        setNewNote({ ...newNote, [name]: value })
    }

    //initial state of note for getNote function
    const [notes, setNotes] = useState([])

    //function to get all note
    const getNote = async () => {
        await axios.get('/notes/get_all').then(res => {
            setNotes(res.data)
        })
    }

    //function to delete note
    const handleDeleteNote = async (id) => {
        swal({
            title: "Delete",
            text: "Are you sure ?",
            icon: "error",
            buttons: ["No", true]
        }).then(async willDelete => {
            if (willDelete) {
                await axios.delete(`/notes/delete/${id}`)
                swal({
                    title: "Deleted !",
                    text: "Deleted your note !",
                    icon: "success"
                })
                getNote()
            }
            else {
                getNote()
            }
        })
    }

    //function to handle create note 
    const handleCreateNote = async () => {
        if (isEmpty(name) || isEmpty(content)) {
            return swal({
                title: "Cannot create",
                text: "Please fill in all field !",
                icon: "warning"
            })
        }
        try {
            await axios.post('/notes/create', {
                name, content
            })
            swal({
                title: "Created",
                text: "Create successful",
                icon: "success"
            })
            getNote()
        } catch (error) {
            return error.response.data.msg
        }
    }

    //Effect funtion to auto load note list after load page
    useEffect(() => {
        getNote()
    }, [])

    return (
        <div className='note_home_page'>
            <h2><Badge variant="secondary">Note</Badge> </h2>
            <Table striped hover bordered size="sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Content</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        notes.map(note => (
                            <tr key={note._id}>
                                <td> {note.name} </td>
                                <td> {note.content} </td>
                                <td>
                                    <Link to={`/note_edit_page/${note._id}`}><i className="fas fa-edit" title="Edit"></i></Link>
                                    <i className="fas fa-trash" title="Remove" onClick={() => handleDeleteNote(note._id)}></i>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>

            <div className='note_create_page'>
                <h2><Badge variant="secondary">Create new note </Badge> </h2>
                <Form>
                    <Form.Group controlId="formNoteName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter your note name" name="name" value={name} onChange={handleChange}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formNoteContent">
                        <Form.Label>Content</Form.Label>
                        <Form.Control type="text" placeholder="content of your note....." name="content" value={content} onChange={handleChange}></Form.Control>
                    </Form.Group>
                </Form>
                <Button onClick={handleCreateNote}>Submit</Button>
            </div>
        </div>
    )
}

export default NoteHomeAdmin