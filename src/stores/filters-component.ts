import { defineStore } from 'pinia'
import { IFieldFiltersV1 } from '@/interfaces/customs'

export const useFiltersStore = defineStore('filters', {
  state: () => {
    return {
      filterState: [] as IFieldFiltersV1[] | [] | null,
    }
  },
  actions: {
    setFiltersState(state: IFieldFiltersV1[]) {
      this.filterState = []
      this.filterState = state
    },
    setFilterState(
      state: IFieldFiltersV1[],
      keyname: string,
      options?: {
        label: string
        value: number | string | boolean
      }[]
    ) {
      this.filterState = []
      this.filterState = state
      for (const key in this.filterState) {
        if (key === keyname) {
          this.filterState[key].options = options
        }
      }
    },
    setFilterValue(name: string, value: string | number | boolean | null) {
      const field = this.filterState?.find((f) => f.name === name)
      if (field) {
        field.value = value
      }
    },
  },
})
