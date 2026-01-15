export interface IPages {
  currentPage: number
  lastPage: number
}

export interface IPaginated<T> {
  list: T[]
  pages: IPages
}
