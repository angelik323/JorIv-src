export interface IBankStructureEquivalence {
  id?: number
  bank_id: number
  typeable_type: string
  typeable_id: number
  data_type: string
  equivalence_1?: string
  equivalence_2?: string
  equivalence_3?: string
}

export interface IBankStructureEquivalenceResponse {
  success: boolean
  message: string
  data: {
    [key: string]: {
      data: IBankStructureEquivalence[]
    }
  }
}
