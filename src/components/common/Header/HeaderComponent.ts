import { useMeta } from 'quasar'

export const useHeaderComponent = (props: any, emit: any) => {
  try {
    useMeta(() => {
      return {
        title: props.breadcrumbsPaths
          ? 'Core Fiduprevisora - ' +
            props.breadcrumbsPaths[props.breadcrumbsPaths.length - 1].label
          : 'Core Fiduprevisora',
      }
    })
  } catch (error) {
    useMeta(() => {
      return {
        title: 'Core Fiduprevisora',
      }
    })
  }

  const to = () => {
    emit('to')
  }

  return {
    to,
  }
}
