import NoDataSearchImage from '@/assets/images/icons/no_data_2.svg'
import NoDataImage from '@/assets/images/icons/no_data.svg'
import { computed } from 'vue'

const useNoDataState = (props: {
  type: 'empty' | 'no-results'
  title?: string
  subtitle?: string
}) => {
  const getImage = () => {
    return props.type === 'empty' ? NoDataImage : NoDataSearchImage
  }

  const title = computed(
    () =>
      props.title ??
      (props.type === 'empty'
        ? 'Realice una búsqueda para ver los datos'
        : 'No se encontraron resultados')
  )

  const subtitle = computed(
    () =>
      props.subtitle ??
      (props.type === 'empty'
        ? 'Aquí visualizará los resultados de su búsqueda'
        : 'Pruebe con otra búsqueda')
  )

  return {
    title,
    subtitle,
    getImage,
  }
}

export default useNoDataState
