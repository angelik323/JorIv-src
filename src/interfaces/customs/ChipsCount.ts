import { Ref } from 'vue'

export type IChipsOptions = {
  id: string | number
  name?: string
}

export interface IChipsResult<T> {
  key: keyof T
  label: string
  visible: Ref<any[]>
  hiddenCount: Ref<number>
  emailMode?: boolean
}

export interface IChipsConfig<T> {
  key: keyof T
  label: string
  emailMode?: boolean
}
