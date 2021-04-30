import validator from '../../lib/validate.js';

const validateNewComment = (req, res, next) => {
    const rules = {

        "body": "required|string",
        "author": "required|exists:User,_id",

    }
    validator(req.body, rules, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        else {
            next();
        }
    });
}

const validateCommentId = (req, res, next) => {
    const rules = {
        "id": "required|exists:Comment,_id"
    }
    validator(req.params, rules, {}, (err, status) => {
        if (!status) {
            res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }
        else {
            next();
        }
    });
}

const validateCommentUpdate = (req, res, next) => {
    const rules = {

        "body": "required|string",
        "author": "required|exists:User,_id"

    }
    validator(req.body, rules, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        }
        else {
            next();
        }
    });
}

export { validateNewComment, validateCommentId, validateCommentUpdate }
