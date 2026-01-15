// vue - quasar
import { IDownloadData } from '@/interfaces/customs'
import { computed, ref } from 'vue'

export const useModalDownload = (emit: any) => {
  const checks = ref<IDownloadData[]>([
    {
      label: 'Todos',
      id: 0,
      value: false,
    },
    {
      label: 'Fideicomitentes',
      id: 2,
      value: false,
    },
    {
      label: 'Beneficiarios de participación',
      id: 3,
      value: false,
    },
    {
      label: 'Beneficiarios de obligación',
      id: 1,
      value: false,
    },
    {
      label: 'Consorciados',
      id: 4,
      value: false,
    },
  ])

  const onSubmit = async () => {
    const dataFilter = checks.value.filter(
      (check) => check.value && check.id !== 0
    )
    emit('save', dataFilter)
  }

  const handleCheck = (index: number, value: boolean) => {
    if (index === 0) {
      for (let i = 1; i < checks.value.length; i++) {
        checks.value[i].value = value
      }
    } else {
      if (!value) {
        checks.value[0].value = false
      }
    }
  }

  const hasSelectedItem = computed(() => {
    return checks.value.some((check) => check.value == true)
  })

  return {
    checks,
    handleCheck,
    hasSelectedItem,
    onSubmit,
  }
}
