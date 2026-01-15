import { IBreadcrumbs } from '@/interfaces/customs/breadcrumbs'
import { defineStore } from 'pinia'




export const useBreadcrumbsStore = defineStore('breadcrumbsRoutes', {
  state: () => ({
    breadRoutes: undefined as IBreadcrumbs[] | undefined,
  }),

  actions: {
    setBreadRoutes(routes: IBreadcrumbs[]) {
      this.breadRoutes = routes
    },
  },
})
