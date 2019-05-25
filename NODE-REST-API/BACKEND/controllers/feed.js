const { validationResult } = require('express-validator/check');
const Post = require('../models/post');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments().then(count => {
      totalItems = count;
      return Post.find().skip((currentPage-1)*perPage)
        .limit(perPage);
    }).then(posts => {
      res.status(200).json({
        posts: posts,
        totalItems: totalItems
      });
    }).catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422; //this is custom property
    throw error;
  }
  if (!req.file) {
    const error = new Error('Image extraction failed.');
    error.statusCode = 422; //this is custom property
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;
  let creator;

  // Create post in db
  const post = new Post({
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: req.userId
  });

  post.save().then(result => {
    return User.findById(req.userId);
  }).then(user => {
    creator = user;
    user.posts.push(post);
    return user.save();
  }).then(result => {
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: {id: creator._id, name: creator.name}
    });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if(!post) {
        const err =  new Error(`Product not found for ${postId}`);
        err.statusCode = 404;
        throw err;
      }
      res.status(200).json({
        message: 'Post fetched!',
        post: post
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422; //this is custom property
    throw error;
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const err = new Error('Image needs to be set!')
    err.statusCode = 422;
    throw err;
  }

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const err =  new Error(`Product not found for ${postId}`);
        err.statusCode = 404;
        throw err;
      }

      if (post.creator.toString() !== req.userId) {
        const err =  new Error('Not authorised!');
        err.statusCode = 404;
        throw err;
      }

      if (post.imageUrl !== imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    }).then(result => {
      res.status(200).json({message: 'Post updated successfully', post: result});
    }).catch(err=> {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const err =  new Error(`Product not found for ${postId}`);
        err.statusCode = 404;
        throw err;
      }

      if (post.creator.toString() !== req.userId) {
        const err =  new Error('Not authorised!');
        err.statusCode = 404;
        throw err;
      }

      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    }).then((result) => {
      return User.findById(req.userId);
    }).then(user => {
      user.posts.pull(postId); //method given by mongoose to remove an item
      return user.save();
    }).then(result => {
      res.status(200).json({message: 'Removed post successfully'});
    }).catch(err=> {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => {console.log(err)});
}
