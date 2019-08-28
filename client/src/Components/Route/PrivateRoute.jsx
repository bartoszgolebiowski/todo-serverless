import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {isLogin} from '../../Utils/Login'


const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} component={props => (
            isLogin() ?
                <Component {...props} />
                : <Redirect to="/login"/>
        )}/>
    );
};

export default PrivateRoute;