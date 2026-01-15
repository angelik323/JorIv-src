import { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $logError: (error: any, context: string) => void
  }
}

declare global {
  const logError: (error: any, context: string) => void
}

export {}
