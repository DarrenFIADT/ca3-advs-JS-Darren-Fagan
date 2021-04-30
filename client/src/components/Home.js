import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { AuthContext } from '../App';
import Sidebar from './Sidebar';
import Show from './articles/Show';
import Edit from './articles/Edit';
import Create from './articles/Create';


const ArticlesContext = React.createContext();

const initialState = {
    articles: [],
    isFetching: false,
    hasError: false
};

const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case "FETCH_ARTICLES_REQUEST": {
            return {
                ...state,
                isFetching: true,
                hasError: false
            };
        }
        case "FETCH_ARTICLES_SUCCESS": {
            return {
                ...state,
                isFetching: false,
                articles: action.payload
            };
        }
        case "FETCH_ARTICLES_FAILURE": {
            return {
                ...state,
                isFetching: false,
                hasError: true
            };
        }
        case "ARTICLE_CREATED": {
            const newArticle = action.payload;
            state.articles.push(newArticle);
            return {
                ...state,
                articles: state.articles
            };
        }
        case "ARTICLE_UPDATED": {
            const updatedArticle = action.payload;
            const index = state.articles.findIndex(
                article => article._id === updatedArticle._id
            );
            state.articles.splice(index, 1, updatedArticle);
            return {
                ...state,
                articles: state.articles
            };
        }
        case "ARTICLE_DELETED": {
            const id = action.payload;
            const articles = state.articles.filter(
                article => article._id !== id
            );
            return {
                ...state,
                articles: articles
            };
        }
        default: {
            return state;
        }
    }
};

const Home = () => {

    const authContext = React.useContext(AuthContext);

    const [state, dispatch] = React.useReducer(reducer, initialState);

    React.useEffect(() => {
        dispatch({
            type: "FETCH_ARTICLES_REQUEST"
        });

        fetch("http://localhost:8000/articles", {
            headers: {
                Authorization: `Bearer ${authContext.state.token}`
            }
        })
        .then(res => res.json())
        .then(resJson => {
            dispatch({
                type: "FETCH_ARTICLES_SUCCESS",
                payload: resJson
            });
        })
        .catch(error => {
            dispatch({
                type: "FETCH_ARTICLES_FAILURE"
            });
        });
    }, [authContext.state.token]);

    const { path } = useRouteMatch();

    if (state.hasError) return <p>Error!</p>;
    if (state.isFetching) return <p>Loading...</p>;

    if (!authContext.state.isAuthenticated) {
        return <Redirect to="/login" />
    }

    return (
        <ArticlesContext.Provider value={{
            state,
            dispatch
        }}>
            <Container>
                <Row>
                    <Col><h1>Our articles</h1></Col>
                </Row>
                {state.articles !== null && state.articles.length > 0 &&
                <Row>
                    <Col sm={3}>
                        <Sidebar />
                    </Col>
                    <Col sm={9}>
                        <Switch>
                            <Route exact path={path}>
                                <h3>Please select an article.</h3>
                            </Route>
                            <Route path={`${path}/create`}>
                                <Create />
                            </Route>
                            <Route path={`${path}/:id/edit`}>
                                <Edit />
                            </Route>
                            <Route path={`${path}/:id`}>
                                <Show />
                            </Route>
                        </Switch>
                    </Col>
                </Row>
                }
                {state.articles === null || state.articles.length === 0 &&
                <Row>
                    <Col>
                        <p>There are no articles at the moment.</p>
                    </Col>
                </Row>
                }
            </Container>
        </ArticlesContext.Provider>
    );
};

export default Home;
export { ArticlesContext };
