//@ts-nocheck
import { Router } from 'express';
import dashboardHandler from '../handlers/dashboard';
import { redirectIfAuthenticated, authenticated } from '../middleware/auth';

const router = Router();

router.get('/login', redirectIfAuthenticated, dashboardHandler.loginHtml);

router.get('/styles.css', dashboardHandler.styles);

router.get('/login.js', dashboardHandler.loginJs);

router.get('/unauthenticated', dashboardHandler.unauthenticated);

router.post('/login', dashboardHandler.login);

router.get('/dashboard', authenticated, dashboardHandler.dashboardHtml);

router.get('/dashboard.js', authenticated, dashboardHandler.dashboardJs);

router.post('/download-excel', authenticated, dashboardHandler.createDownloadLink);

router.get('/download-excel/:token', authenticated, dashboardHandler.downloadExcel);

export default router;
