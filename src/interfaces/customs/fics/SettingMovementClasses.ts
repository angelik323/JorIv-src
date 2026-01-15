export interface IMovementGroup {
  id: number
  name: string
  classes_movements: {
    id: number
    group_id: number
    code: string
    description: string
  }[]
}
