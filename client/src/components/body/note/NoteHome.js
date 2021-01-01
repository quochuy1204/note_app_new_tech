import React, { useState, useEffect } from 'react'
import { Table, Badge } from 'react-bootstrap'
import axios from 'axios'
import './notehome.css'

function NoteHome() {
    const [notes, setNote] = useState([])

    const getNote = async () => {
        await axios.get('/notes/get_all').then(res => {
            setNote(res.data)
        })
    }

    useEffect(() => {
        getNote()
    }, [])

    return (
        <div className='note_home_page'>
            <h2><Badge variant="secondary">Note</Badge></h2>
            <Table striped hover bordered size="sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Content</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        notes.map(note => (
                            <tr key={note._id}>
                                <td> {note.name} </td>
                                <td> {note.content} </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    )
}

export default NoteHome