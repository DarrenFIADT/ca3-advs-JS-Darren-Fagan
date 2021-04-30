import Article from '../models/Article.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

const index = async function(req, res, next) {
//  res.status(200).json({
    //"message": `GET request recieved; \
      //          articles id = ${req.params.articleId}, \
    //            comment id = ${re.params.commentId}`
  //});
    try {
        const article = await Article.findById(req.params.id)
                                           .exec();
      const ids = article.comments;
      const comments = await Comment.find()
                                    .where('_id')
                                    .in(ids)
                                    .exec();

      res.status(200).json(comments);
}
    catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const show = async function(req, res, next) {
    try {
        const comment = await Comment.findById(req.params.commentId)
                                  .exec();

        if (comment === null) {
            res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }
        else {
            res.status(200).json(comment);
        }
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const store = async function (req, res, next) {
    try {
        const article = await Article.findById(req.params.id)
                                              .exec();

        const comment = new Comment();
        comment.body = req.body.body;
        comment.author = req.user._id;
        comment.save();

        article.comments.push(comment._id)
        await article.save();

        comment.author = req.user;

        res.status(200).json(comment);
    }
    catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
};


const update = async function(req, res, next){
  try{
    const article = await Article.findById(req.params.id)
                                 .exec();
    const comment = await Comment.findById(req.params.commentId)
                                 .exec();

    if(article === null){
      res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }
    else if (comment === null){
      res.status().json({
        success: false,
        message: "Comment not found"
      });
    }
    else{
      comment.body = req.body.body;
      comment.save();

      comment.author = req.user;

      res.status(200).json(comment);
    }
  }
  catch(error){
    res.status(500).json({
      success: false,
      message: error.message
    });
  }

};

const remove = async function(req, res, next) {
    try {
        const article = await Article.findById(req.params.id)
                                   .exec();
        const comment = await Comment.findById(req.params.commentId)
                                     .exec();

        if (comment === null) {
            res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }
        else {
            await comment.remove();

            res.status(204).json(null);
        }
    }
    catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export { index, show, store, update, remove };
