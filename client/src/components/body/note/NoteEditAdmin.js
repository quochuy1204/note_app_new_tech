import React, { useState, useEffect } from 'react'
import { Badge, Button, Form } from 'react-bootstrap'
import { useParams, useHistory } from 'react-router-dom'
import './notehome.css'
import axios from 'axios'
import swal from 'sweetalert'
import { isEmpty } from '../../utils/validation/Validation'

const initialState = {
    name: '',
    content: ''
}

function NoteEditAdmin() {
    //initial state for update function
    const [newNote, setNewNote] = useState(initialState)

    const { name, content } = newNote

    //assign useHistory function
    const history = useHistory()

    //get params of url 
    const params = useParams()

    //get id from params
    const noteId = params.id

    //initial state to get note by id
    const [note, setNote] = useState([])

    //function to get note by id
    const getNoteById = async (id) => {
        await axios.get(`/notes/get/${noteId}`).then(res => {
            setNote(res.data)
        })
    }

    //handle change function
    const handleChange = e => {
        const { name, value } = e.target
        setNewNote({ ...newNote, [name]: value })
    }

    //auto load note 
    useEffect(() => {
        getNoteById()
    }, [])

    //function to hanle update note
    const handleEditNote = async (id) => {
        if (isEmpty(name) || isEmpty(content)) {
            return swal({
                title: "Cannot update",
                text: "Please fill in all field !",
                icon: "warning"
            })
        }
        try {
            await axios.patch(`/notes/update/${noteId}`, {
                name, content
            })
            swal({
                title: "Updated",
                text: "Update successful",
                icon: "success"
            })
            history.push('/note_page')
        } catch (error) {
            return error.response.data.msg
        }
    }

    return (
        <div className='note_home_page'>
            <h2><Badge variant="secondary">{note.name} Information</Badge> </h2>
            <Form>
                <Form.Group controlId="formNameNote">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" defaultValue={note.name} disabled></Form.Control>
                </Form.Group>

                <Form.Group controlId="formContentNote">
                    <Form.Label>Content</Form.Label>
                    <Form.Control type="text" defaultValue={note.content} disabled></Form.Control>
                </Form.Group>
            </Form>

            <h2><Badge variant="secondary">Update</Badge></h2>
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
            <Button onClick={handleEditNote}>Submit</Button>
        </div>
    )
}

export default NoteEditAdmin