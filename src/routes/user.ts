import { Router } from 'express';
import userHandler from '../handlers/user';

const router = Router();

router.get('/:id', userHandler.get);

router.get('/', userHandler.getAll);

router.post('/', userHandler.create);

router.put('/:id', userHandler.update);

router.delete('/:id', userHandler.deleteUser);

export default router;
