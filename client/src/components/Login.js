import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { AuthContext } from '../App';

const Login = () => {

    const authContext = React.useContext(AuthContext);

    let history = useHistory();

    const initialState = {
        username: "Lula_Graham",
        password: "secret",
        remember: false,
        isSubmitting: false,
        errorMessage: null
    };

    const [state, setState] = React.useState(initialState);

    const handleChange = (e) => {
        const target = e.target;
        const field = target.name;
        const value = (target.type === 'checkbox') ? target.checked : target.value;
        setState({
            ...state,
            [field]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setState({
            ...state,
            isSubmitting: true,
            errorMessage: null
        });

        const userDetails = {
            username: state.username,
            password: state.password
        };

        fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userDetails)
        })
        .then(res => res.json())
        .then(response => {
            if (!response.success) {
                setState({
                    ...state,
                    isSubmitting: false,
                    errorMessage: response.msg
                });
            }
            else {
                authContext.dispatch({
                    type: "LOGIN",
                    payload: {
                        user: response.user,
                        token: response.token
                    }
                });
                history.push("/articles");
            }
        })
        .catch(error => {
            setState({
                ...state,
                isSubmitting: false,
                errorMessage: error.message || error.statusText
            });
        });
    }

    if (authContext.state.isAuthenticated) {
        return <Redirect to="/home" />
    }

    return (
        <Card className="mt-2">
            <Card.Body>
                <Card.Title>Login form</Card.Title>
                <Form onSubmit={handleSubmit}>
                    {state.errorMessage &&
                        <Alert variant="danger">
                            {state.errorMessage}
                        </Alert>
                    }
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            required
                            name="username"
                            type="username"
                            value={state.username}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            name="password"
                            type="password"
                            value={state.password}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="remember">
                        <Form.Check
                            type="checkbox"
                            name="remember"
                            label="Remember me"
                            checked={state.remember}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={state.isSubmitting}>
                        Login
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default Login;
