import Article from '../models/Article.js';
import Image from '../models/Image.js';

const index = async function(req, res, next) {
    try {
        const articles = await Article.find({})
                                      .populate('tags')
                                      .populate('category')
                                      .populate('author')
                                      .populate('image')
                                      .exec();
        res.status(200).json(articles);
    }
    catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const show = async function(req, res, next) {
    try {
        const article = await Article.findById(req.params.id)
                                     .populate('tags')
                                     .populate('category')
                                     .populate('author')
                                     .populate('image')
                                     .populate({
                                         path: 'comments',
                                         populate: { path: 'author', model: 'User' }
                                      })
                                     .exec();

        if (article === null) {
            res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }
        else {
            res.status(200).json(article);
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
        const article = req.body;

        const image = new Image();
        image.path = "http://placeimg.com/640/480/nature";
        await image.save();

        const newArticle = new Article(article);
        newArticle.comments = [];
        newArticle.image = image._id;
        await newArticle.save();

        const createdArticle = await Article.findById(newArticle._id)
                                            .populate('tags')
                                            .populate('category')
                                            .populate('author')
                                            .populate('image')
                                            .exec();

            res.status(200).json(createdArticle);
    }
    catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const update = async function(req, res, next) {
    try {
        const article = await Article.findById(req.params.id)
                                     .exec();

        if (article === null) {
            res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }
        else {
            article.title = req.body.title;
            article.body = req.body.body;
            article.category = req.body.category;
            article.tags = req.body.tags;
            await article.save();

            const upDatedArticle = await Article.findById(req.params.id)
                                         .populate('tags')
                                         .populate('category')
                                         .populate('author')
                                         .populate('image')
                                         .exec();

            res.status(200).json(upDatedArticle);
        }
    }
    catch(error) {
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

        if (article === null) {
            res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }
        else {
            await article.remove();

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
