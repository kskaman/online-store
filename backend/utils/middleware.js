const logger = require('./logger')
const Cart = require('./../models/cart')
const Order = require('./../models/order')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method : ', request.method)
  logger.info('Path : ', request.path)
  logger.info('Body : ', request.body)
  logger.info('---')
  next()
}


const roleMiddleware = (requiredRole) => {
  return (request, response, next) => {
    if (request.user && request.user.role === requiredRole) {
      next()
    } else {
      return response.status(403).json({ error: 'Access denied' })
    }
  }
}

const userAuthorization = (resourceType) => {
  return async (request, response, next) => {
    try {
      let resource

      if (resourceType === 'cart') {
        resource = await Cart.findById(request.params.id || request.user.id)
      } else if (resourceType === 'order') {
        resource = await Order.findById(request.params.id)
      }

      if (!resource) {
        return response.status(404).json({ error: `${resourceType} not found` })
      }

      if (resource.user.toString() !== request.user.id.toString()) {
        return response.status(403).json({ error: 'Access denied' })
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}


const getToken = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const authMiddleware = (request, response, next) => {
  const token = getToken(request)

  if (!token) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)
  request.user = decodedToken
  next()
}


const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unkonown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id ' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  response.status(500).json({ error: 'Internal Server Error' })
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndPoint,
  errorHandler,
  roleMiddleware,
  userAuthorization,
  authMiddleware
}