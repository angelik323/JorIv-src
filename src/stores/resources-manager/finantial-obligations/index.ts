import { useFinantialObligationResourcesV1 } from './finantial-obligation-resources-v1'
import { useFinantialObligationResourcesV2 } from './finantial-obligation-resources-v2'

export function useFinantialObligationResourceStore(version: 'v1'): ReturnType<typeof useFinantialObligationResourcesV1>
export function useFinantialObligationResourceStore(version: 'v2'): ReturnType<typeof useFinantialObligationResourcesV2>
export function useFinantialObligationResourceStore(version: 'v1' | 'v2') {
  switch (version) {
    case 'v1':
      return useFinantialObligationResourcesV1()
    case 'v2':
      return useFinantialObligationResourcesV2()

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
