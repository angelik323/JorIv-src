import { ref } from 'vue'

const useImageLabel = (props: {
  src: string
  alt: string
  label?: string
  imageSize?: string
  spinnerColor?: string
}) => {
  const imageSize = props.imageSize ?? '40px'

  const imageErrored = ref(false)

  return {
    imageSize,
    imageErrored,
  }
}

export default useImageLabel
