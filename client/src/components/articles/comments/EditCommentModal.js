import React from 'react';
import { useParams, useRouteMatch, useHistory, Link } from 'react-router-dom';
import {Nav, Form, Button, Alert, Container, Row, Col, Modal } from 'react-bootstrap';
import { AuthContext } from '../../../App';
import { ArticlesContext } from '../../Home';




const initialState = {
    show: false,
    isUpdating: false,
    hasError: false
};

const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case "UPDATE_COMMENT_REQUEST": {
            return {
                ...state,
                isUpdating: true,
                hasError: false
            };
        }
        case "UPDATE_COMMENT_SUCCESS": {
          const article = state.article;
          const comment = action.payload;
            return {
                ...state,
                isUpdating: false,
                article: action.payload
            };
        }
        case "UPDATE_COMMENT_FAILURE": {
            return {
                ...state,
                isUpdating: false,
                hasError: true
            };
        }
        case "UPDATE_COMMENT": {
            return {
                ...state,
                ...action.payload
            };
        }
        case "SET_SHOW": {
            return {
                ...state,
                show: action.payload
            };
        }
        default: {
            return state;
        }
    }
};

const EditCommentModal = (props)  => {
  const article = props.article;
  const comment = props.comment;
  const onCommentUpdated = props.onCommentUpdated;

  const authContext = React.useContext(AuthContext);

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const commentBody = React.useRef();

  const setShow = (show) => {
      dispatch({
          type: "SET_SHOW",
          payload: show
      });
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirm = () => {
      dispatch({
          type: "UPDATE_COMMENT_REQUEST"
      });

      const updatedComment = {
        body: commentBody.current.value
      };

         fetch(`http://localhost:8000/articles/${article._id}/comments/${comment._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${authContext.state.token}`
            },
          body: JSON.stringify(updatedComment)
        })
        .then(res => res.json())
        .then(res => {
          onCommentUpdated(res);
            dispatch({
                type: "UPDATE_COMMENT_SUCCESS"
            });
          })
        .catch(error => {
            dispatch({
                type: "UPDATE_COMMENT_FAILURE"
            });
        });
        setShow(false);
    };


    return (
        <>
        <Nav.Link as={Button} variant="primary" onClick={handleShow}>
            Edit
        </Nav.Link>
            <Modal
                show={state.show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                animation={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {state.errorMessage &&
                    <Alert variant="warning">
                        {state.errorMessage}
                    </Alert>
                    }
                    <Form.Group controlId="comment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      required
                      name="comment"
                      type="text"
                      ref={commentBody}
                      defaultValue={comment.body}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="outline-warning"
                        onClick={handleConfirm}
                        disabled={state.isUpdating}
                    >
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default EditCommentModal;
