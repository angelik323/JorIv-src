export interface IFile extends File {
  __img?: HTMLImageElement
  __key?: string
  __status?: string
  __uploaded?: number
  __progress?: number
  __sizeLabel?: string
  __progressLabel?: string
}

// Representa la estructura de un archivo procesado
export interface IFileKey {
  __key?: string // Llave única para identificar el archivo
  name: string // Nombre del archivo
  [key: string]: any // Otras propiedades que puedan venir con el archivo
}

export interface IFilesValues {
  __key?: string | number
  id?: number
  name?: string
  date?: string
  file?: File | IFilesValues
  mime_type?: string
  url?: string
  created_at?: string
}

// Representa el archivo mapeado, que se guarda en la tabla local
export interface IFilesValuesV2 {
  id?: number // ID único asignado en la tabla
  name: string // Nombre del archivo
  date: string // Fecha del archivo
  file: IFileKey // El archivo original
}

// ! ---------- ERP fiscalía files -------
export interface IUploadedFile {
  __key: string
  __progress: number
  __progressLabel: string
  __sizeLabel: string
  __status: string
  __uploaded: number
  lastModified: number
  lastModifiedDate: Date
  name: string
  size: number
  type: string
  webkitRelativePath: string
}

export interface IFileField {
  id: string
  description: string
  file: IUploadedFile
}
// ! --------------------------------------
