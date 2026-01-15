import { Ref } from 'vue'

export const useTable = <T extends { id: number }>(
  tableRef: Ref<{ rows: T[] }>
) => {
  // Actualiza un registro de la tabla por su id con los cambios especificados
  const updateRowById = (id: number, changes: Partial<T>) => {
    const index = tableRef.value.rows.findIndex((row) => row.id === id)
    if (index !== -1) {
      tableRef.value.rows[index] = {
        ...tableRef.value.rows[index],
        ...changes,
      }
    }
  }

  // Elimina un registro de la tabla por su id
  const removeRowById = (id: number) => {
    tableRef.value.rows = tableRef.value.rows.filter((row) => row.id !== id)
  }

  return {
    updateRowById,
    removeRowById,
  }
}
