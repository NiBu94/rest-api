import { Router } from 'express';
import weekDataHandler from '../handlers/weekData';
import { basicAuth } from '../middleware/auth';

const router = Router();

router.get('/years', weekDataHandler.getYears);

router.get('/:year', weekDataHandler.get);

router.get('/', basicAuth, weekDataHandler.getAll);

router.post('/', basicAuth, weekDataHandler.create);

router.put('/:year', basicAuth, weekDataHandler.update);

router.delete('/:year', basicAuth, weekDataHandler.deleteWeekData);

export default router;
