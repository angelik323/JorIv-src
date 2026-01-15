import { useCheckbookQueryStorev1 } from './check-book-consultation-v1'

export const useCheckbookQuery = (version: 'v1') => {
  switch (version) {
    case 'v1':
      return useCheckbookQueryStorev1()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
