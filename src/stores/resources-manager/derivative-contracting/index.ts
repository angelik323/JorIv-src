import { useDerivativeContractingResourcesV1 } from './derivative-contracting-resources-v1'

export const useDerivativeContractingResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useDerivativeContractingResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
