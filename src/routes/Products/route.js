const express                            = require('express')
const { ResponseSuccess, ResponseError } = require('../../../utils/ResponseMsg')
const ProductModels                      = require('../../models/Products/model')

const router                             = express.Router()

router.get('/getProductList', async (req, res) => {
     try {
          const ProductList = await ProductModels.find({})
          res.status(200).send(ResponseSuccess(ProductList, 'Product List Success'))
     } catch (e){
          res.status(500).json(ResponseError())
     }
})

module.exports = router