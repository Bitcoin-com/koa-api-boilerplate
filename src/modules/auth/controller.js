const passport = require('koa-passport')

// Used for debugging and iterrogating JS objects.
const util = require('util')
util.inspect.defaultOptions = { depth: 5 }

/**
 * @apiDefine TokenError
 * @apiError Unauthorized Invalid JWT token
 *
 * @apiErrorExample {json} Unauthorized-Error:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "status": 401,
 *       "error": "Unauthorized"
 *     }
 */

/**
 * @api {post} /auth Authenticate user
 * @apiVersion 1.0.0
 * @apiName AuthUser
 * @apiGroup Auth
 *
 * @apiParam {String} username  User username.
 * @apiParam {String} password  User password.
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "username": "johndoe@gmail.com", "password": "foo" }' localhost:5000/auth
 *
 * @apiSuccess {Object}   user           User object
 * @apiSuccess {ObjectId} user._id       User id
 * @apiSuccess {String}   user.name      User name
 * @apiSuccess {String}   user.username  User username
 * @apiSuccess {String}   token          Encoded JWT
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "username": "johndoe"
 *        },
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
 *     }
 *
 * @apiError Unauthorized Incorrect credentials
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "status": 401,
 *       "error": "Unauthorized"
 *     }
 */

async function authUser (ctx, next) {
  console.log(`ctx.request: ${util.inspect(ctx.request)}`)
  console.log(`ctx.request.body: ${util.inspect(ctx.request.body)}`)
  console.log(`ctx.request.query: ${util.inspect(ctx.request.query)}`)

  return passport.authenticate('local', (err, user, info, status) => {
    if (err) throw err

    if (!user) {
      ctx.throw(401)
    }

    const token = user.generateToken()

    const response = user.toJSON()

    delete response.password

    ctx.body = {
      token,
      user: response
    }
  })(ctx, next)
}

module.exports.authUser = authUser
