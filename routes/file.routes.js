const Router = require('express')
const router = Router()
const authMiddleware = require('../middleware/auth-middleware')
const FileController = require('../controllers/fileController')



router.post('',authMiddleware, FileController.createDir)
router.post('/upload',authMiddleware, FileController.uploadFile)

router.get ('', authMiddleware, FileController.fetFiles)



module.exports = router