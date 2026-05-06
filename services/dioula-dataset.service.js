// Dioula/Common Voice dataset information
const DIOULA_DATASET = {
  id: 'cmn1q3sgr00xwmm07t7te56k4',
  name: 'Common Voice Scripted Speech 25.0 - Dioula',
  language: 'Dioula',
  languageCode: 'dyu',
  description: 'A collection of read speech recordings in Dioula (Dioula ye)',
  downloadUrl: 'https://datacollective.mozillafoundation.org/datasets/cmn1q3sgr00xwmm07t7te56k4',
  license: 'Creative Commons Zero v1.0 Universal (CC0-1.0)',
  licenseUrl: 'https://spdx.org/licenses/CC0-1.0.html',
  fileSize: '10.30 MB',
  format: 'MP3',
  uploadDate: '2026-03-22',
  statistics: {
    totalClips: 295,
    duration: {
      total: 0.51,
      validated: 0.36,
      unit: 'hours'
    },
    speakers: 35,
    sentences: 5069,
    validatedSentences: 5028,
    unvalidatedSentences: 41,
    averageClipDuration: 6.309,
    durationUnit: 'seconds'
  },
  demographics: {
    gender: {
      male: { clips: 116, percentage: 39.3, speakers: 8 },
      female: { clips: 89, percentage: 30.2, speakers: 6 },
      unspecified: { clips: 90, percentage: 30.5, speakers: 21 },
      declared: { clips: 205, percentage: 69.5 }
    },
    age: {
      teens: { clips: 5, percentage: 1.7, speakers: 1 },
      twenties: { clips: 194, percentage: 65.8, speakers: 12 },
      thirties: { clips: 0, percentage: 0, speakers: 0 },
      fourties: { clips: 6, percentage: 2.0, speakers: 1 },
      fifties: { clips: 0, percentage: 0, speakers: 0 },
      unspecified: { clips: 90, percentage: 30.5, speakers: 21 },
      declared: { clips: 205, percentage: 69.5 }
    }
  },
  dataSplits: {
    clips: {
      validated: { count: 211, percentage: 71.5 },
      invalidated: { count: 15, percentage: 5.1 },
      other: { count: 69, percentage: 23.4 }
    },
    training: {
      train: { count: 90, percentage: 42.7 },
      dev: { count: 50, percentage: 23.7 },
      test: { count: 63, percentage: 29.9 }
    }
  },
  fields: {
    clips: [
      'client_id',
      'path',
      'text',
      'up_votes',
      'down_votes',
      'age',
      'gender',
      'accents',
      'variant',
      'segment',
      'prompt_upvotes',
      'prompt_reports',
      'is_edited'
    ],
    sentences: [
      'sentence_id',
      'sentence',
      'variant',
      'sentence_domain',
      'source',
      'is_used',
      'clips_count'
    ]
  },
  intendedUse: 'Training and evaluating automatic speech recognition (ASR) models. May also be used for applications relating to computer-aided language learning (CALL) and language or heritage revitalisation.',
  forbiddenUsage: 'It is forbidden to attempt to determine the identity of speakers in the Common Voice datasets. It is forbidden to re-host or re-share this dataset.',
  publisher: 'Mozilla Foundation',
  publisherEmail: 'commonvoice@mozilla.org',
  contacts: [
    {
      type: 'Email',
      value: 'mozilladatacollective@mozillafoundation.org'
    }
  ],
  communityLinks: {
    translators: 'https://pontoon.mozilla.org/dyu/common-voice/contributors/',
    communities: 'https://github.com/common-voice/common-voice/blob/main/docs/COMMUNITIES.md'
  },
  discussions: {
    matrix: 'https://chat.mozilla.org/#/room/#common-voice:mozilla.org',
    discourse: 'https://discourse.mozilla.org/t/about-common-voice-readme-first/17218',
    discord: 'https://discord.gg/9QTj9zwn',
    telegram: 'https://t.me/mozilla_common_voice'
  },
  contribute: {
    speak: 'https://commonvoice.mozilla.org/dyu/speak',
    write: 'https://commonvoice.mozilla.org/dyu/write',
    listen: 'https://commonvoice.mozilla.org/dyu/listen',
    review: 'https://commonvoice.mozilla.org/dyu/review'
  }
};

module.exports = { DIOULA_DATASET };
