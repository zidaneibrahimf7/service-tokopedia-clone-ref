function ResponseSuccess(response, message) {
     return {
          code: 0,
          content: response,
          message: message
     }
}

function ResponseDataNotFound(message = "Data not found"){
     return {
          code: 404,
          content: {},
          message: message

     }
}

function ResponseError(message = "Something wrong on Back end"){
     return {
          code: 500,
          content: {},
          message: message

     }
}

module.exports = {ResponseSuccess, ResponseError, ResponseDataNotFound}