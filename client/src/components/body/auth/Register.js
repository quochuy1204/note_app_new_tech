import { React, useState } from 'react'
import { Link } from 'react-router-dom'
import { isEmail, isEmpty, isLength, isMatch } from '../../utils/validation/Validation'
import axios from 'axios'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'

//initialState
const initialState = {
    name: '',
    email: '',
    password: '',
    cf_password: '',
    err: '',
    success: ''
}

function Register() {
    //assign state and setState 
    const [user, setUser] = useState(initialState)

    //assign value name for user state
    const { name, email, password, cf_password, err, success } = user

    //function to handle change 
    const handleChangeInput = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value, err: '', success: '' })
    }

    //function to handle submition
    const handleSubmit = async e => {
        e.preventDefault()

        //check name and password filled or not 
        if (isEmpty(name) || isEmpty(password)) {
            return setUser({ ...user, err: "Please fill in all fields.", success: '' })
        }

        //check email valid or not 
        if (!isEmail(email)) {
            return setUser({ ...user, err: "Invalid email address.", success: '' })
        }

        //check password length
        if (isLength(password)) {
            return setUser({ ...user, err: "Password must be at least 8 characters.", success: '' })
        }

        //check password matching with cf_password or not 
        if (!isMatch(password, cf_password)) {
            return setUser({ ...user, err: "Password do not match.", success: '' })
        }

        try {
            const res = await axios.post('/users/register', {
                name, email, password
            })

            setUser({ ...user, err: '', success: res.data.msg })
        } catch (err) {
            err.response.data.msg && setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    }

    return (
        <div className="login_page">
            <h2>Register</h2>

            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" placeholder="Enter your name" id="name" value={name} name="name" onChange={handleChangeInput}></input>
                </div>

                <div>
                    <label htmlFor="email">Email address</label>
                    <input type="text" placeholder="Enter your email address" id="email" value={email} name="email" onChange={handleChangeInput}></input>
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Enter your password" id="password" value={password} name="password" onChange={handleChangeInput}></input>
                </div>

                <div>
                    <label htmlFor="cf_password">Confirm password</label>
                    <input type="password" placeholder="Confirm your password" id="cf_password" value={cf_password} name="cf_password" onChange={handleChangeInput}></input>
                </div>

                <div className="row">
                    <button type="submit">Register</button>
                </div>
            </form>
            <p>Already have an account ? <Link to="/login">Login</Link> </p>
        </div>
    )
}

export default Register

