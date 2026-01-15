import { IFilesValuesV2 } from '@/interfaces/global'

export interface IDocumentTable {
  id: number
  date: string
  description: string
  file?: IFilesValuesV2['file']
}

export interface IDocumentFileBase {
  id: number
}

export interface IDocumentFile {
  [key: `documents[${number}]`]: File
}
