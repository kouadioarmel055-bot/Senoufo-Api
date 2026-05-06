const mdcService = require('../services/mdc-api.service');
const { DIOULA_DATASET } = require('../services/dioula-dataset.service');

// Get complete dataset information from MDC API
const getDatasetInfo = async (req, res) => {
  try {
    // Try to fetch from MDC API first
    try {
      const mdcData = await mdcService.getDatasetInfo();
      return res.json({
        success: true,
        source: 'MDC API',
        data: mdcData
      });
    } catch (mdcError) {
      console.warn('MDC API error, falling back to cached data:', mdcError.message);
      // Fallback to cached data if MDC API is unavailable
      return res.json({
        success: true,
        source: 'cached',
        data: DIOULA_DATASET
      });
    }
  } catch (error) {
    console.error('Error fetching dataset info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dataset information'
    });
  }
};

// Get dataset statistics
const getDatasetStats = async (req, res) => {
  try {
    let dataSource = DIOULA_DATASET;
    
    try {
      const mdcData = await mdcService.getDatasetInfo();
      dataSource = mdcData;
    } catch (mdcError) {
      console.warn('Using cached statistics:', mdcError.message);
    }

    const stats = {
      language: dataSource.language,
      languageCode: dataSource.languageCode,
      statistics: dataSource.statistics,
      demographics: dataSource.demographics,
      dataSplits: dataSource.dataSplits
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dataset stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dataset statistics'
    });
  }
};

// Get available download and resource links
const getResourceLinks = async (req, res) => {
  try {
    let dataSource = DIOULA_DATASET;
    
    try {
      const mdcData = await mdcService.getDatasetInfo();
      dataSource = mdcData;
    } catch (mdcError) {
      console.warn('Using cached resource links:', mdcError.message);
    }

    const links = {
      downloadUrl: dataSource.downloadUrl,
      license: dataSource.license,
      licenseUrl: dataSource.licenseUrl,
      communityLinks: dataSource.communityLinks,
      discussions: dataSource.discussions,
      contribute: dataSource.contribute,
      publisher: dataSource.publisher,
      publisherEmail: dataSource.publisherEmail,
      contacts: dataSource.contacts || []
    };
    
    res.json({
      success: true,
      data: links
    });
  } catch (error) {
    console.error('Error fetching resource links:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resource links'
    });
  }
};

// Get dataset sample sentences
const getSampleSentences = (req, res) => {
  try {
    // Sample sentences from the dataset
    const samples = [
      'Fɛɛrɛ misali: barokuntigi le b\'o lawili.',
      'K\'aɲini kalandenw fɛ ka bataki kalan gafe kɔnɔ. Faamuyali ɲiningaliw kalandenw fɛ.',
      'Ka mɔgɔjeninw walima mɔgɔsumaninw timinandiya o ka kuma;',
      'Yirali Sɛnsɛnni walima ɲɛyirali',
      'Coulibaly taara jamana wɛrɛ la.'
    ];
    
    res.json({
      success: true,
      data: {
        language: DIOULA_DATASET.language,
        samples: samples,
        totalValidatedSentences: DIOULA_DATASET.statistics.validatedSentences,
        totalUnvalidatedSentences: DIOULA_DATASET.statistics.unvalidatedSentences
      }
    });
  } catch (error) {
    console.error('Error fetching sample sentences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sample sentences'
    });
  }
};

// Get metadata fields structure
const getMetadataFields = (req, res) => {
  try {
    const fields = {
      clipFields: DIOULA_DATASET.fields.clips,
      sentenceFields: DIOULA_DATASET.fields.sentences
    };
    res.json({
      success: true,
      data: fields
    });
  } catch (error) {
    console.error('Error fetching metadata fields:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metadata fields'
    });
  }
};

// Validate MDC API credentials
const validateCredentials = async (req, res) => {
  try {
    const validation = await mdcService.validateCredentials();
    
    if (validation.valid) {
      res.json({
        success: true,
        message: 'Credentials are valid',
        data: validation
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: validation.error
      });
    }
  } catch (error) {
    console.error('Error validating credentials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate credentials'
    });
  }
};

// Get dataset files from MDC
const getDatasetFiles = async (req, res) => {
  try {
    const files = await mdcService.getDatasetFiles();
    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Error fetching dataset files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dataset files: ' + error.message
    });
  }
};

// Get download link from MDC
const getDownloadLink = async (req, res) => {
  try {
    const downloadLink = await mdcService.getDownloadLink();
    res.json({
      success: true,
      data: downloadLink
    });
  } catch (error) {
    console.error('Error getting download link:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get download link: ' + error.message
    });
  }
};

module.exports = {
  getDatasetInfo,
  getDatasetStats,
  getResourceLinks,
  getSampleSentences,
  getMetadataFields,
  validateCredentials,
  getDatasetFiles,
  getDownloadLink
};
