const express = require('express');
const router = express.Router();
const diolaController = require('../controllers/dioula.controller');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dioula Dataset API is running' });
});

// Credentials validation
router.get('/validate-credentials', diolaController.validateCredentials);

// Dataset information routes
router.get('/dataset/info', diolaController.getDatasetInfo);
router.get('/dataset/stats', diolaController.getDatasetStats);
router.get('/dataset/resources', diolaController.getResourceLinks);
router.get('/dataset/samples', diolaController.getSampleSentences);
router.get('/dataset/metadata', diolaController.getMetadataFields);
router.get('/dataset/files', diolaController.getDatasetFiles);
router.get('/dataset/download-link', diolaController.getDownloadLink);

module.exports = router;
