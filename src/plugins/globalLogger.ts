export default {
  install(app: any) {
    const logError = (error: any, context: string) => {
      if (import.meta.env.VITE_MODE === 'development') {
        console.error(`Error en ${context}:`, {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
        })
      }
    }

    // Registrar en Vue
    app.config.globalProperties.$logError = logError

    // Registrar en el objeto global
    if (typeof window !== 'undefined') {
      ;(window as any).logError = logError
    } else if (typeof global !== 'undefined') {
      ;(global as any).logError = logError
    }
  },
}
