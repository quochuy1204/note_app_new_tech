import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './components/header/Header'
import Body from './components/body/Body'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { dispatchLogin, dispatchGetUser, fetchUser } from './redux/actions/authAction'
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  const dispatch = useDispatch()

  //get token from state.token
  const token = useSelector(state => state.token)

  //get auth from state.auth 
  const auth = useSelector(state => state.auth)

  //useEffect to send request to server to refresh token
  useEffect(() => {
    //get firstLogin boolen from localStorage.getItem
    const firstLogin = localStorage.getItem('firstLogin')

    if (firstLogin) {
      //function to send request to server to refresh token 
      const getToken = async () => {
        const res = await axios.post('/users/refresh_token', null)

        //use dispatch to call action
        dispatch({ type: 'GET_TOKEN', payload: res.data.access_Token })
      }
      getToken()
    }
  }, [auth.isLogged, dispatch])

  //useEffect to get user once token change
  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin())
        return fetchUser(token).then(res => {
          dispatch(dispatchGetUser(res))
        })
      }
      getUser()
    }
  }, [token, dispatch])

  return (
    <Router>
      <div className="App">
        <Header />
        <Body />
      </div>
    </Router>
  );
}

export default App;
