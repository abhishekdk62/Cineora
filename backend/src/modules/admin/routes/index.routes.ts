import { Router } from 'express';
import adminMovieRoutes from './admin.movie.routes';
import adminOwnerRoutes from './admin.owner.routes';
import userRoutes from './admin.user.routes';

const router = Router();

router.use('/movies',  adminMovieRoutes);
router.use('/owners', adminOwnerRoutes);
router.use('/users',userRoutes)

export default router;
