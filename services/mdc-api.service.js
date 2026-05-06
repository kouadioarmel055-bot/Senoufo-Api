const axios = require('axios');

class MDCDatasetService {
  constructor() {
    this.apiKey = process.env.MDC_API_KEY;
    this.userId = process.env.MDC_USER_ID;
    this.datasetId = process.env.MDC_DATASET_ID;
    this.baseUrl = process.env.MDC_API_BASE_URL || 'https://datacollective.mozillafoundation.org/api';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 15000,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-MDC-User-ID': this.userId,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Fetch dataset information from Mozilla Data Collective
   */
  async getDatasetInfo() {
    try {
      const response = await this.client.get(`/datasets/${this.datasetId}`);
      return this.formatDatasetInfo(response.data);
    } catch (error) {
      console.error('Error fetching dataset from MDC:', error.message);
      throw new Error(`Failed to fetch dataset from MDC: ${error.message}`);
    }
  }

  /**
   * Fetch dataset statistics and files
   */
  async getDatasetFiles() {
    try {
      const response = await this.client.get(`/datasets/${this.datasetId}/files`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dataset files:', error.message);
      throw new Error(`Failed to fetch dataset files: ${error.message}`);
    }
  }

  /**
   * Fetch dataset metadata
   */
  async getDatasetMetadata() {
    try {
      const response = await this.client.get(`/datasets/${this.datasetId}/metadata`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dataset metadata:', error.message);
      throw new Error(`Failed to fetch dataset metadata: ${error.message}`);
    }
  }

  /**
   * Download dataset
   */
  async getDownloadLink() {
    try {
      const response = await this.client.post(`/datasets/${this.datasetId}/download`);
      return response.data;
    } catch (error) {
      console.error('Error getting download link:', error.message);
      throw new Error(`Failed to get download link: ${error.message}`);
    }
  }

  /**
   * Format MDC API response to our expected structure
   */
  formatDatasetInfo(mdcData) {
    return {
      id: this.datasetId,
      name: mdcData.name || 'Common Voice Scripted Speech 25.0 - Dioula',
      language: mdcData.language || 'Dioula',
      languageCode: mdcData.languageCode || 'dyu',
      description: mdcData.description || 'A collection of read speech recordings in Dioula',
      downloadUrl: mdcData.downloadUrl || `https://datacollective.mozillafoundation.org/datasets/${this.datasetId}`,
      license: mdcData.license || 'Creative Commons Zero v1.0 Universal (CC0-1.0)',
      licenseUrl: mdcData.licenseUrl || 'https://spdx.org/licenses/CC0-1.0.html',
      fileSize: mdcData.fileSize || '10.30 MB',
      format: mdcData.format || 'MP3',
      uploadDate: mdcData.uploadDate || mdcData.releaseDate || '2026-03-22',
      statistics: mdcData.statistics || {},
      demographics: mdcData.demographics || {},
      dataSplits: mdcData.dataSplits || {},
      fields: mdcData.fields || {},
      intendedUse: mdcData.intendedUse || '',
      forbiddenUsage: mdcData.forbiddenUsage || '',
      publisher: mdcData.publisher || 'Mozilla Foundation',
      publisherEmail: mdcData.publisherEmail || 'commonvoice@mozilla.org',
      communityLinks: mdcData.communityLinks || {},
      discussions: mdcData.discussions || {},
      contribute: mdcData.contribute || {}
    };
  }

  /**
   * Check if credentials are valid
   */
  async validateCredentials() {
    try {
      const response = await this.client.get('/user/profile');
      return {
        valid: true,
        userId: response.data.id,
        username: response.data.username || 'User'
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}

module.exports = new MDCDatasetService();
