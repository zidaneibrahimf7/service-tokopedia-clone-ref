const express       = require('express')
const { ResponseSuccess, ResponseError } = require('../../../utils/ResponseMsg')
const VideosModel = require('../../models/Videos/model')

const router        = express.Router()

router.get('/getVideoList', async (req, res) => {
     try {
          const videoLists = await VideosModel.find({}).populate('product') //jika ingin membuka semua data, pake populate, tapi jika product ini bentuk ID aja, populate nya dihapus
          res.status(200).send(ResponseSuccess(videoLists, 'Video List Success'))
     } catch (e){
          res.status(500).json(ResponseError())
     }
})

router.post('/getVideoListDetail', async (req, res) => {
     const body = req.body
     const {productId} = body
     const product = await VideosModel.findOne({ "product": productId }).populate('product')

     res.status(200).send(product)
})

router.post('/getVideoListById', async (req, res) => {
     try {
          const body = req.body
          const {videoId} = body
          // const video = await VideosModel.findById(videoId)
          const video = await VideosModel.findOne({"videoId": videoId})
          // Fungsi dari findOne itu spesifik ingin mengambil data dari key apa. sedangkan findById, harus diambil dari _id itu
     
          res.status(200).send(ResponseSuccess(video, 'Get Video List By Id Success'))
     } catch (error){
           res.status(500).json(ResponseError())
     }
})

module.exports = router