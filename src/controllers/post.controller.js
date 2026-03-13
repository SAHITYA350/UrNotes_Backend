const Post = require('../models/post.model');
const uploadFile = require('../services/storage.service');

exports.createPost = async (req, res) => {
    const { title, description } = req.body;
    try {
        let imageUrl = "";
        if (req.file) {
            const result = await uploadFile(req.file.buffer);
            imageUrl = result.url;
        }

        const post = await Post.create({
            title,
            description,
            image: imageUrl,
            author: req.user._id
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user._id }).populate('author', 'username email').sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePost = async (req, res) => {
    const { title, description } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        post.title = title || post.title;
        post.description = description || post.description;

        if (req.file) {
            const result = await uploadFile(req.file.buffer);
            post.image = result.url;
        }

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
