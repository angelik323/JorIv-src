import { setActivePinia, createPinia } from 'pinia'
import { defineStore } from 'pinia'

export const useQuickTestStore = defineStore('quickTest', {
  state: () => ({
    testValue: 'initial',
  }),
  actions: {
    setTestValue(value: string) {
      this.testValue = value
    },
  },
})

describe('QuickTestStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('sets the test value correctly', () => {
    const store = useQuickTestStore()
    const newValue = 'updated'

    store.setTestValue(newValue)

    expect(store.testValue).toBe(newValue)
  })
})