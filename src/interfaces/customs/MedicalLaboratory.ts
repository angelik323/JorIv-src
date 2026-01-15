export interface IMedicalLaboratoryRequest {
  id: number
  procedure_id: number
  unit_id: number
  classification_id: number | null
  date: string
  assessment: string
  exam_state_id: number
  interpretation: string
}

export interface IMedicalLaboratoryTable {
  id: number
  laboratory: string
  date: string
  unit: string
  classification: string
  assessment: string
  interpretation: string
  status: string
  file?: File | null
  procedure_id: number
}

export interface IMedicalLaboratoryFile {
  [key: `medic_laboratory[${number}][file]`]: File
}
