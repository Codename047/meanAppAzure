var express = require('express');
var router  = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

function isAuthenticated(req,res,next){
	if(req.method === "GET"){
		return next();
	}

	if(req.isAuthenticated()){
		return next();
	}

		return res.redirect('/#login');
};

router.use('/posts',isAuthenticated);
router.route('/posts')

.get(function(req,res){
	Post.find(function(err,data){
		 return res.send(data);
	})
})

.post(function(req,res){
	var post = new Post();
	post.text = req.body.text;
	post.username = req.body.created_by
	post.save(function(err,post){
		return res.json(post);
	});
});

router.route('/posts/:id')

.get(function(req, res){
        Post.findById(req.params.id, function(err, post){
            if(err)
                res.send(err);
            res.json(post);
        });
    }) 

.put(function(req, res){
        Post.findById(req.params.id, function(err, post){
            if(err)
                res.send(err);

            post.created_by = req.body.created_by;
            post.text = req.body.text;

            post.save(function(err, post){
                if(err)
                    res.send(err);

                res.json(post);
            });
        });
    })

.delete(function(req, res) {
        Post.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });
module.exports = router;