import express from 'express';
import { postQuery, getAllQueries, getQueriesByUserId, getQueryById, updateQueryById, deleteQueryById, deleteAllQueries } from '../controllers/queryController.js';

const router = express.Router();

router.post('/', postQuery);
router.get('/', getAllQueries);
router.get('/user/:userId', getQueriesByUserId);
router.get('/:id', getQueryById);
router.put('/:id', updateQueryById);     // replace all fields
router.delete('/:id', deleteQueryById);
router.delete('/', deleteAllQueries);    // DANGER

export default router;
