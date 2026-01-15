export interface Props {
  title?: string
  subtitle?: string
  breadcrumbs: {
    label: string
    route?: string
  }[]
  btnLabel?: string
  btnSize?: string
  btnClass?: string
  btnIcon?: string
  btnDisable?: boolean
  btnOutline?: boolean
  btnColor?: string
  btnTextColor?: string
  indentation?: boolean
  contentIndentation?: boolean
}

export type Emits = (e: 'to') => void

export const useContentComponent = (emits: Emits) => {
  const to = () => {
    emits('to')
  }

  return {
    to,
  }
}
