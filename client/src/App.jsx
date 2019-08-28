import React from "react";
import {BrowserRouter, Router, Route} from 'react-router-dom';

import PrivateRoute from './Components/Route/PrivateRoute.jsx';
import PublicRoute from './Components/Route/PublicRoute.jsx'
import Home from './Containers/Home/Home.jsx'
import Todo from './Containers/Todo/Todo.jsx'
import Login from './Containers/Login/Login.jsx'
import Registration from './Containers/Login/Registration.jsx'
import Header from "./Components/Header/Header.jsx";
import {isLogin} from "./Utils/Login";

const App = () => {
    const isLoggedIn = isLogin();
    return (
        <BrowserRouter>
            <Header isLoggedIn={isLoggedIn}/>
            <PrivateRoute component={Home} path="/home"/>
            <PublicRoute restricted={true} component={Login} path="/login"/>
            <PublicRoute restricted={true} component={Registration} path="/registration"/>
            <PrivateRoute component={Todo} path="/todo"/>
        </BrowserRouter>
    )
};


export default App;
