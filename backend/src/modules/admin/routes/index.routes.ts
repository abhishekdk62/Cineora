import { Router } from 'express';
import adminMovieRoutes from './admin.movie.routes';
import adminOwnerRoutes from './admin.owner.routes';

const router = Router();

router.use('/movies',  adminMovieRoutes);
router.use('/owners', adminOwnerRoutes);

export default router;
