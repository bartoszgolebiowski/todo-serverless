import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import Home from './Components/Home.jsx'

const App = () => {
    return (
        <Router>
            <div>
                <Route exact path="/" component={Home}/>
                <Route path="/home" component={Home}/>
            </div>
        </Router>
    )
};

export default App;
