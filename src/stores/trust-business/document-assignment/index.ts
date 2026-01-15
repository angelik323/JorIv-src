import { useDocumentAssignmentStorev1 } from './document-assignment-v1'

export const useDocumentAssignmentStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useDocumentAssignmentStorev1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
