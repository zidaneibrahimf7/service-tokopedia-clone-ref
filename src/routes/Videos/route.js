const express                                = require('express')
const { ResponseSuccess, ResponseError }     = require('../../../utils/ResponseMsg')
const VideosModel                            = require('../../models/Videos/model')

const router                                 = express.Router()

router.get('/getAllVideoList', async (req, res) => {
    try {
        const videoLists = await VideosModel.find({}).populate('product');

        if (!videoLists || videoLists.length === 0) {
            return res.status(404).json(ResponseDataNotFound("No videos found"));
        }

        return res.status(200).json(ResponseSuccess(videoLists, 'Video List Success'));
    } catch (error) {
        console.error("Error fetching videos:", error);
        return res.status(500).json(ResponseError());
    }
});

router.post('/getVideoList', async (req, res) => {
    try {
        const { search } = req.body; // Ambil filter dari request body

        let filter = {}; // Filter query untuk pencarian video
        
        // Query video dan populate product
        let videos = await VideosModel.find(filter).populate({
            path: 'product',
            match: search ? { title: new RegExp(search, 'i') } : {} // Cari berdasarkan title (case insensitive)
        });

        // Hapus hasil yang tidak memiliki produk jika `search` digunakan
        if (search) {
            videos = videos.filter(video => video.product);
        }

        if (!videos || videos.length === 0) {
            return res.status(404).json(ResponseDataNotFound("No videos found"));
        }

        return res.status(200).json(ResponseSuccess(videos, 'Video List Success'));
    } catch (error) {
        console.error("Error fetching videos:", error);
        return res.status(500).json(ResponseError());
    }
});

router.post('/getVideoListById', async (req, res) => {
     try {
          const body = req.body
          const {videoId} = body
          // const video = await VideosModel.findById(videoId)
          const video = await VideosModel.findOne({"_id": videoId})
          // Fungsi dari findOne itu spesifik ingin mengambil data dari key apa. sedangkan findById, harus diambil dari _id itu
     
          res.status(200).send(ResponseSuccess(video, 'Get Video List By Id Success'))
     } catch (error){
           res.status(500).json(ResponseError())
     }
})

module.exports = router