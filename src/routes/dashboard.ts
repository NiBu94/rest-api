//@ts-nocheck
import { Router } from 'express';
import dashboardHandler from '../handlers/dashboard';
import { redirectIfAuthenticated, authenticated } from '../middleware/auth';

const router = Router();

router.get('/login', redirectIfAuthenticated, dashboardHandler.loginHtml);

router.get('/styles.css', dashboardHandler.styles);

router.get('/login.js', dashboardHandler.loginJs);

router.post('/login', dashboardHandler.login);

router.get('/dashboard', authenticated, dashboardHandler.dashboardHtml);

router.post('/download-excel', /*authenticated,*/ dashboardHandler.downloadExcel);

export default router;
