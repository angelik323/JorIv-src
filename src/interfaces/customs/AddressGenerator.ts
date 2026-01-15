export type Field = 'country' | 'department' | 'city'

export interface ILocation {
  id?: number | string
  country?: {
    id: number | null
    name?: string
  }
  department?: {
    id: number
    name?: string
  }
  city?: {
    id: number
    name?: string
  }
  address: string
}

export interface ILastElement {
  type: 'nomenclature' | 'letter' | 'digit' | 'bis'
  value: string
}

export interface INomenclature {
  abbreviation: string
  name: string
  requiresCustomName: boolean
  isMasculine?: boolean
}
