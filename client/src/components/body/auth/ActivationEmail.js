import React, { useState, useEffect } from 'react'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function ActivationEmail() {
    //get activate_token from params with useParams method 
    const { activation_token } = useParams()

    //assign err and setErr
    const [err, setErr] = useState('')

    //assign success and setSuccess
    const [success, setSuccess] = useState('')

    //useEffect to auto update err and success state when activate_token change
    useEffect(() => {
        if (activation_token) {
            const activationEmail = async () => {
                try {
                    const res = await axios.post('/users/activation', { activation_token })
                    console.log("Test1")
                    setSuccess(res.data.msg)
                } catch (err) {
                    err.response.data.msg && setErr(err.response.data.msg)
                }
            }
            activationEmail()
        }
    }, [activation_token])
    return (
        <div className="activa_page">
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
        </div>
    )
}

export default ActivationEmail