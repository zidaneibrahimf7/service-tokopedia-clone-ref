const express                            = require('express')
const { ResponseSuccess, ResponseError } = require('../../../utils/ResponseMsg')
const ProductModels                      = require('../../models/Products/model')
const VideosModel                        = require('../../models/Videos/model')
const mongoose                           = require('mongoose')

const router                             = express.Router()

router.get('/getProductList', async (req, res) => {
     try {
          const ProductList = await ProductModels.find({}).populate('video')
          res.status(200).send(ResponseSuccess(ProductList, 'Product List Success'))
     } catch (e){
          res.status(500).json(ResponseError())
     }
})

router.post('/getProductListById', async (req, res) => {
     try {
          const body = req.body
          const { productId } = body

          const productById = await ProductModels.findOne({"_id": productId}).populate('video')

          res.status(200).send(ResponseSuccess(productById, 'Get Product Success'))
     } catch(e){
          res.status(500).json(ResponseError())
     }
})

router.post('/addProduct', async (req, res) => {
     try {
          const { productId, linkProduct, videoLink, title, price, urlImageThumbnail } = req.body;

          // 1️⃣ Buat produk baru
          const newProduct = new ProductModels({
               productId,
               linkProduct,
               videoLink,
               title,
               price
          });

          await newProduct.save();

          // 2️⃣ Buat video baru & hubungkan dengan Product
          const newVideo = new VideosModel({
               videoId: new mongoose.Types.ObjectId(), // Generate ObjectId
               urlImageThumbnail,
               product: newProduct._id // Hubungkan ke Product
          });

          await newVideo.save();

          // 3️⃣ Update produk agar menghubungkan ke Video yang baru dibuat
          newProduct.video = newVideo._id;
          await newProduct.save();

          res.status(200).send(ResponseSuccess({}, 'Add Product Success'))

     } catch (error) {
          console.error("Error adding product & video:", error);
          res.status(500).json(ResponseError())
     }
});

router.delete('/deleteProduct', async (req, res) => {
    try {
        const { productId } = req.body;

        // 1️⃣ Cari produk berdasarkan `productId`
        const product = await ProductModels.findOne({ productId });

        if (!product) {
            return res.status(404).json(ResponseDataNotFound("Product not found"));
        }

        // 2️⃣ Hapus video yang terhubung dengan produk
        await VideosModel.deleteOne({ product: product._id });

        // 3️⃣ Hapus produk itu sendiri
        await ProductModels.deleteOne({ productId });

        return res.status(200).json(ResponseSuccess({}, "Product deleted successfully"));
    } catch (error) {
        console.error("Error deleting product & video:", error);
        return res.status(500).json(ResponseError());
    }
});


module.exports = router