import { IShowEmptySecreens } from '@/interfaces/customs'
import { ref } from 'vue'

export const useShowEmptyScreen = () => {
  const title = ref<string>('Realice una búsqueda para ver los datos')
  const description = ref<string>(
    'Aquí visualizará los resultados de su búsqueda'
  )
  const image = ref<string>('default')
  const loader = ref<boolean>(false)

  const openComponentLoader = ({
    setTitle,
    setDescription,
    setImage,
    setLoader,
  }: IShowEmptySecreens) => {
    title.value = setTitle
    description.value = setDescription
    image.value = setImage
    loader.value = setLoader
  }

  const resetSetLoaderComponent = () => {
    title.value = 'Realice una búsqueda para ver los datos'
    description.value = 'Aquí visualizará los resultados de su búsqueda'
    image.value = 'default'
    loader.value = false
  }

  return {
    title,
    description,
    loader,
    image,
    openComponentLoader,
    resetSetLoaderComponent,
  }
}
