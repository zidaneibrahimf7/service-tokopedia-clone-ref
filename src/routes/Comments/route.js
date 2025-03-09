const express                            = require('express')
const { ResponseSuccess, ResponseError } = require('../../../utils/ResponseMsg')
const CommentModel                       = require('../../models/Comments/model')

const router                             = express.Router()
const mongoose                           = require('mongoose');

router.post('/addComment', async (req, res) => {
    try {
         console.log(req.body, ':req')
        const { videoId, username, comment } = req.body;

        // Validasi input
        if (!videoId || !username || !comment) {
            return res.status(400).json({ code: 400, message: 'All fields must be filled' });
        }

        // Buat komentar baru
        const newComment = new CommentModel({
            video: videoId, // Hubungkan ke video
            videoId, // Hubungkan ke video
            username,
            comment
        });

        // Simpan ke database
        await newComment.save();

     res.status(200).send(ResponseSuccess({}, 'Add comment successfully'))

    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/getAllComments', async (req, res) => {
     try {
          const CommentList = await CommentModel.find({}).populate('video')
          res.status(200).send(ResponseSuccess(CommentList, 'Comment List Success'))
     } catch (e){
          res.status(500).json(ResponseError())
     }
})

router.post('/getCommentById', async (req, res) => {
    try {
        const { videoId } = req.body; // Ambil videoId dari body request

        if (!videoId) {
            return res.status(400).json({ code: 400, message: 'videoId is required' });
        }

        // Cek apakah videoId valid untuk ObjectId
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ code: 400, message: 'Invalid videoId format' });
        }

        // Convert ke ObjectId
        const objectId = new mongoose.Types.ObjectId(videoId);

        // Cari komentar berdasarkan videoId
        const comments = await CommentModel.find({ video: objectId }).populate('video');

        if (!comments || comments.length === 0) {
            return res.status(404).json({ code: 404, message: 'No comments found for this videoId' });
        }

        res.status(200).send(ResponseSuccess(comments, 'Get Comment By Id Success'));
    } catch (e) {
        console.error("Error fetching comments:", e);
        res.status(500).json(ResponseError());
    }
});


module.exports = router