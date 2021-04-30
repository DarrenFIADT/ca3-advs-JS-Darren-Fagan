import React from 'react';
import { Redirect } from 'react-router-dom';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { AuthContext } from '../../App';
import DeleteModal from './DeleteModal';
import EditCommentModal from './comments/EditCommentModal';
import DeleteCommentModal from './comments/DeleteCommentModal';
import Create from '../articles/Create';
import { useHistory } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';


const initialState = {
    article: null,
    isFetching: false,
    hasError: false
};

const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case "FETCH_ARTICLE_REQUEST": {
            return {
                ...state,
                isFetching: true,
                hasError: false
            };
        }
        case "FETCH_ARTICLE_SUCCESS": {
            return {
                ...state,
                isFetching: false,
                article: action.payload
            };
        }
        case "FETCH_ARTICLE_FAILURE": {
            return {
                ...state,
                isFetching: false,
                hasError: true
            };
        }
        case "POST_COMMENT_REQUEST": {
            return {
                ...state,
                isPosting: true,
                errorMessage: null
            };
        }
        case "POST_COMMENT_SUCCESS": {
          const article = state.article;
          const comment = action.payload;
          if(!article.comments.some(c => comment._id === c._id)){
            article.comments.push(comment);
          }
            return {
                ...state,
                isPosting: false,

            };
        }
        case "POST_COMMENT_FAILURE": {
            return {
                ...state,
                isPosting: false,
                errorMessage: action.payload
            };
        }
        case "COMMENT_UPDATED": {
          const article = state.article;
          const comment = action.payload;
          const index = article.comments.findIndex(c => comment._id === c._id);
          if(index !== -1){
            article.comments.splice(index, 1, comment);
          }
          return{
            ...state
          };
        }

        case "COMMENT_DELETED": {
          const article = state.article;
          const comment = action.payload;
          const index = article.comments.findIndex(c => comment._id === c._id);
          if (index !== -1){
            article.comments.splice(index,1);
          }
          return{
            ...state,
        };
      }

        default: {
            return state;
        }
    }
};

const Show = () => {
    const { id } = useParams();

    const authContext = React.useContext(AuthContext);

    const [state, dispatch] = React.useReducer(reducer, initialState);

    const new_comment = React.useRef();

    const handleSubmit = (e) => {
      e.preventDefault();

      dispatch({
        type: "POST_COMMENT_REQUEST"
      });

      const comment = {
        body: new_comment.current.value
      };

      fetch(`http://localhost:8000/articles/` + id +  `/comments`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authContext.state.token}`
        },
        body: JSON.stringify(comment)
      })
      .then(res => res.json())
      .then(response => {
        new_comment.current.value = "";
        dispatch({
          type: "POST_COMMENT_SUCCESS",
          payload: response
        });
      })
      .catch(error =>{
        dispatch({
          action: "POST_COMMENT_FAILURE",
          payload:error.message || error.statusText
        });
      });
    };

    const onCommentUpdated = (comment) => {
      dispatch({
        type: "COMMENT_UPDATED",
        payload: comment
      });
    };
    const onCommentDeleted = (comment) => {
        dispatch({
          type: "COMMENT_DELETED",
          payload: comment
        });
      };


    React.useEffect(() => {
        dispatch({
            type: "FETCH_ARTICLE_REQUEST"
        });

        fetch(`http://localhost:8000/articles/${id}`, {
            headers: {
                Authorization: `Bearer ${authContext.state.token}`
            }
        })
        .then(res => res.json())
        .then(resJson => {
            dispatch({
                type: "FETCH_ARTICLE_SUCCESS",
                payload: resJson
            });
        })
        .catch(error => {
            dispatch({
                type: "FETCH_ARTICLE_FAILURE"
            });
        });
    }, [authContext.state.token, id]);

    const { url } = useRouteMatch();

    if (state.hasError) return <p>Error!</p>;
    if (state.isFetching) return <p>Loading...</p>;

    const article = state.article;

    if (!authContext.state.isAuthenticated) {
        return <Redirect to="/login" />
    }

    return (
        <>
            {article !== null &&
            <>
                <h2>{article.title}</h2>
                <h4>
                    Author: {article.author.username}
                    {article.author._id === authContext.state.user._id &&
                    <Navbar className="float-right">
                        <Nav.Item className="mr-2">
                            <Nav.Link
                                className="btn btn-outline-warning"
                                as={Link}
                                to={`${url}/edit`}
                            >
                                Edit
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <DeleteModal id={id} />
                        </Nav.Item>
                    </Navbar>
                    }
                </h4>
                <p>Category: {article.category.title}</p>
                {article.tags.length > 0 &&
                    <>
                        <p>Tags:</p>
                        <ul>
                            {article.tags.map(tag => (
                                <li key={tag._id}>{tag.title}</li>
                            ))}
                        </ul>
                    </>
                }
                <p><img src={article.image.path} alt="Nature" /></p>
                <p>{article.body}</p>
                {article.comments.length > 0 &&
                <>
                    <h4>Comments</h4>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Author</th>
                                <th>Comment</th>
                                <th>Date</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {article.comments.map(comment => (
                                <tr key={comment._id}>
                                    <td>{comment.author.username}</td>
                                    <td>{comment.body}</td>
                                    <td>{comment.updatedAt}</td>
                                    <td>
                                    {authContext.state.user._id === comment.author._id &&
                                      <>
                                      <EditCommentModal article={article} comment={comment} onCommentUpdated={onCommentUpdated}/>
                                      <DeleteCommentModal article={article} comment={comment} onCommentDeleted={onCommentDeleted}/>
                                      </>
                                    }
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
</>
}
<Form onSubmit={handleSubmit}>
  {state.errorMessage &&
    <Alert variant="danger">
    {state.errorMessage}
    </Alert>
  }
  <Form.Group controlId="comment">
    <Form.Label>Comment</Form.Label>
    <Form.Control
        required
        name="comment"
        type="text"
        ref={new_comment}
      />
    </Form.Group>
    <Button variant="primary" type= "submit" disabled={state.isPosting}>
    POST
    </Button>
    </Form>
    </>
  }
  </>
);
};



export default Show;
