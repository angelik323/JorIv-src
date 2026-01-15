export interface IMedicalExamRequest {
  id: number
  procedure_id: number
  classification_id: number
  day_of_exam: string
  interpretation: string
}

export interface IMedicalExamTable {
  exam: string
  classification: string
  date: string
  interpretation: string
  id: number
  file?: File | null
  procedure_id?: number | null
}

export interface IMedicalExamFileBase {
  id: number
}

export interface IMedicalExamFile {
  [key: `medic_exam[${number}][file]`]: File
}
