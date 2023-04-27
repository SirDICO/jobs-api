const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')


const errorHandlerMiddleware = (err, req, res, next) => {

  let CustomerError = {
  //set default
  statusCode: err.statusCode  || StatusCodes.INTERNAL_SERVER_ERROR,

  msg:err.message || 'Something went wrong Try again later'
  }


  if(err.name === 'ValidationError'){
    CustomerError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
    CustomerError.statusCode = 400
  }

  if(err.code && err.code === 11000){
    CustomerError.msg = `this ${Object.keys(err.keyValue)}
     field already exist, Please choose another value`
    CustomerError.statusCode = 400; 
  }

  if(err.name === 'CastError'){
    CustomerError.msg = `No item Foun with id : ${err.value}`
    CustomerError.statusCode = 404;
  }

  return res.status(CustomerError.statusCode).json({ msg:CustomerError.msg })
}

module.exports = errorHandlerMiddleware
