import {Router} from 'express'
import { getMovieById } from '../admin/controllers/admin.movie.controller'


const router=Router()


router.get('/movies/:movieId',getMovieById)

export default router