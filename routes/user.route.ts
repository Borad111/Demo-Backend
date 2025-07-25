import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { jwtUtils } from '../utils/jwt.utils';
const router=express.Router();


router.post('/auth/register',UserController.registerUser);
router.post('/auth/login',UserController.loginUser);
router.get('/profile', UserController.getPrfile);
router.post('/user/createMsg',UserController.createMsg);
router.post('/user/logout',UserController.logout);
router.get('/admin/getMsg',UserController.getAllMesgs);
router.get('/user/msg',UserController.getMsg);
router.delete('/msg/:id',UserController.deletemsg);
router.put('/user/updateMsg/:id',UserController.updateMsg);

export default router;