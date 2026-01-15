interface ITableComponents{
    name: string
    label: string
    field: string
}

interface IRowType<T> {
    [key: string]: T
  }
  
  interface IColType {
    name: string;
  }

  interface ICardList extends IColType, IRowType<any> {
    // Puedes agregar propiedades adicionales específicas de ICardList aquí si es necesario
  }
