import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { jwtUtils } from '../utils/jwt.utils';
const router=express.Router();


router.post('/auth/register',UserController.registerUser);
router.post('/auth/login',UserController.loginUser);
router.get('/profile',authenticateJwt, UserController.getPrfile);
router.post('/user/createMsg',authenticateJwt,UserController.createMsg);
router.post('/user/logout',authenticateJwt,UserController.logout);
router.get('/admin/getMsg',authenticateJwt,UserController.getAllMesgs);
router.get('/user/msg',authenticateJwt,UserController.getMsg);
router.delete('/msg/:id',authenticateJwt,UserController.deletemsg);
router.put('/user/updateMsg/:id',authenticateJwt,UserController.updateMsg);

export default router;