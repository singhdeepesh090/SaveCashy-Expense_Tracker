const express = require('express');
const { addTransaction, getAllTransactions, editTransaction, deleteTransaction } = require('../controllers/transactionController');

const router = express.Router();

// routers
router.post('/add-transaction', addTransaction );

// edit transaction
router.post('/edit-transaction', editTransaction );

router.post('/get-transaction', getAllTransactions );

router.post('/delete-transaction', deleteTransaction );

module.exports = router;