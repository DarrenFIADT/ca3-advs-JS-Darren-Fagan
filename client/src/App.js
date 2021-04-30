import React from "react";
import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';

import Header from './components/Header';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Home from './components/Home';
import Footer from './components/Footer';

const AuthContext = React.createContext();

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN": {
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", JSON.stringify(action.payload.token));
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token
            };
        }
        case "LOGOUT": {
            localStorage.clear();
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null
            };
        }
        default: {
            return state;
        }
    }
};

function App() {

    const [state, dispatch] = React.useReducer(reducer, initialState);

    return (
        <AuthContext.Provider value={{
            state,
            dispatch
        }}>
            <Container>
                <Header />
                <Switch>
                    <Route exact path="/" component={Welcome} />
                    <Route path="/login" component={Login} />
                    <Route path="/articles" component={Home} />
                </Switch>
                <Footer />
            </Container>
        </AuthContext.Provider>
  );
}

export default App;

export { AuthContext };
