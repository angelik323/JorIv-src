export interface IStatistics {
  stats: IStats[]
}

export interface IStats {
  image?: any
  count?: number | string
  label?: string
}
