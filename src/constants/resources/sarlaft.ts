export const sarlaft_file_processing_status_default = {
  statusId: 20,
  progress: 0,
}

export const sarlaft_file_processing_status_success = {
  statusId: 104,
}

export const SARLAFT_PARAMETERIZATION_OPTIONS = [
  { label: 'Diaria', value: 'Diario' },
  { label: 'Mensual', value: 'Mensual' },
  { label: 'Trimestral', value: 'Trimestral' },
  { label: 'Semestral', value: 'Semestral' },
  { label: 'Anual', value: 'Anual' },
]

export const POLLING_CONFIG = {
  INTERVAL_MS: 5000,
  MAX_ATTEMPTS: 60,
  PROGRESS_INCREMENT: 0.1,
  PROGRESS_MAX_LOADING: 0.9,
} as const
