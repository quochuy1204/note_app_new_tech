import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import ActivationEmail from './auth/ActivationEmail'
import { useSelector } from 'react-redux'
import NotFound from '../utils/NotFound/NotFound'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import Profile from '../body/profile/Profile'
import EditUser from '../body/profile/EditUser'
import NoteHome from '../body/note/NoteHome'
import NoteHomeAdmin from '../body/note/NoteHomeAdmin'
import NoteEditAdmin from '../body/note/NoteEditAdmin'

function Body() {

    //get auth from state.auth
    const auth = useSelector(state => state.auth)

    //get isLogged from auth
    const { isLogged, isAdmin } = auth

    return (
        <section>
            <Switch>
                <Route path="/" component={NoteHome} exact />

                <Route path="/note_edit_page/:id" component={isAdmin ? NoteEditAdmin : NotFound} exact />

                <Route path="/note_page" component={isAdmin ? NoteHomeAdmin : NotFound} exact />

                <Route path="/login" component={isLogged ? NotFound : Login} exact />

                <Route path="/register" component={isLogged ? NotFound : Register} exact />

                <Route path="/forgot_password" component={isLogged ? NotFound : ForgotPassword} exact />

                <Route path="/users/reset/:token" component={isLogged ? NotFound : ResetPassword} exact />

                <Route path="/profile" component={isLogged ? Profile : NotFound} exact />

                <Route path="/user/activate/:activation_token" component={ActivationEmail} exact />

                <Route path="/edit_user/:id" component={isAdmin ? EditUser : NotFound} exact />
            </Switch>
        </section>
    )
}

export default Body