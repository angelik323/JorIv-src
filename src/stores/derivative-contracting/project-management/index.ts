import { useProjectManagementStoreV1 } from './project-management-v1'

export const useProjectManagementStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useProjectManagementStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
