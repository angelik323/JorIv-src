import { computed } from 'vue'
import { IChipsOptions } from '@/interfaces/customs'

const useChipRow = (
  props: {
    items?: (string | IChipsOptions)[]
    defaultValue?: (string | IChipsOptions)[]
    emailMode?: boolean
    removable?: boolean
  },
  emit: (event: 'change', value: { name: string; id: number }[]) => void
) => {
  const normalizeToOptions = (
    items?: (string | IChipsOptions)[]
  ): IChipsOptions[] => {
    if (!Array.isArray(items)) return []
    return items.map((item) =>
      typeof item === 'string'
        ? { id: item, name: item }
        : { id: item.id, name: item.name ?? String(item.id) }
    )
  }

  const displayedItems = computed<IChipsOptions[]>(() =>
    normalizeToOptions(props.items ?? props.defaultValue)
  )

  const onRemove = (opt: IChipsOptions) => {
    const current = normalizeToOptions(props.defaultValue)
    const updated = current.filter((o) => o.id !== opt.id)

    emit(
      'change',
      updated.map((item) => ({
        name: item.name ?? '',
        id: Number(item.id),
      }))
    )
  }

  return {
    displayedItems,
    onRemove,
  }
}

export default useChipRow
