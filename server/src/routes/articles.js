import { Router } from 'express';
import passport from 'passport';
import commentsRouter from './comments.js';
import authRouter from './auth.js';

import {
    validateNewArticle,
    validateArticleId,
    validateArticleUpdate
} from '../middleware/validation/article.js';

import {
  validateNewComment,
  validateCommentId,
  validateCommentUpdate
} from '../middleware/validation/comment.js';



import {
    index,
    show,
    store,
    update,
    remove
} from '../controllers/articleController.js'

import {
  index as commentIndex,
  show as commentShow,
  store as commentStore,
  update as commentUpdate,
  remove as commentRemove
} from '../controllers/commentController.js'

const articlesRouter = Router();

articlesRouter.get('/', index);

articlesRouter.get('/:id', validateArticleId, show);

articlesRouter.post('/',
    passport.authenticate('jwt', { session: false }),
    validateNewArticle,
    store
);

articlesRouter.put('/:id',
    passport.authenticate('jwt', { session: false }),
    validateArticleId,
    validateArticleUpdate,
    update
);

articlesRouter.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    validateArticleId,
    remove
);


articlesRouter.get('/:id/comments', commentIndex);

articlesRouter.get('/:articleId/comments/:commentId', commentShow);


articlesRouter.post('/:id/comments/',
passport.authenticate('jwt', { session: false }),
commentStore
);

articlesRouter.put('/:id/comments/:commentId',
  passport.authenticate('jwt', { session: false }),
  commentUpdate
  );

articlesRouter.delete('/:id/comments/:commentId',
    passport.authenticate('jwt', { session: false }),
    commentRemove
);


export default articlesRouter;
