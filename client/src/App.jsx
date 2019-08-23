import React from "react";
import {BrowserRouter, Switch} from 'react-router-dom';

import PrivateRoute from './Components/Route/PrivateRoute';
import PublicRoute from './Components/Route/PublicRoute'
import Home from './Containers/Home/Home.jsx'
import Todo from './Containers/Todo/Todo.jsx'
import Login from './Containers/Login/Login.jsx'
import Registration from './Containers/Login/Registration.jsx'

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <PublicRoute restricted={false} component={Home} path="/" exact/>
                    <PublicRoute restricted={true} component={Login} path="/login" exact/>
                    <PublicRoute restricted={true} component={Registration} path="/registration" exact/>
                    <PrivateRoute component={Todo} path="/todos" exact/>
                </Switch>
            </BrowserRouter>
        </div>
    )
};

export default App;
