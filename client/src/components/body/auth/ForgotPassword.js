import React, { useState } from 'react'
import axios from 'axios'
import { isEmail } from '../../utils/validation/Validation'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'

//init state
const initialState = {
    email: '',
    err: '',
    success: ''
}
function ForgotPassword() {
    //set state and state
    const [data, setData] = useState(initialState)

    //assign email , err , success
    const { email, err, success } = data

    //function to handle change 
    const handleChangeInput = e => {
        const { name, value } = e.target
        setData({ ...data, [name]: value, err: '', success: '' })
    }

    //function to handle button on click
    const forgotPassword = async () => {
        if (!isEmail(email)) {
            return setData({ ...data, err: "Invalid email address.", success: '' })
        }

        try {
            const res = await axios.post('/users/forgot_password', { email })
            return setData({ ...data, err: '', success: res.data.msg })
        } catch (err) {
            err.response.data.msg && setData({ ...data, err: err.response.data.msg, success: '' })
        }
    }

    return (
        <div className="fg_pass">
            <h2>Forgot Your Password ?</h2>
            <div className="row">
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}

                <label htmlFor="email">Enter your email address</label>
                <input type="text" name="email" id="email" value={email} onChange={handleChangeInput} />
                <button onClick={forgotPassword}>Verify your email</button>
            </div>
        </div>
    )
}

export default ForgotPassword