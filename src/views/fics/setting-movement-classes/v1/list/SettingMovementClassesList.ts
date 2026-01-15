// Vue - Pinia - Quasar
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IMovementGroup } from '@/interfaces/customs/fics/SettingMovementClasses'

// Stores
import { useSettingMovementClassesStore } from '@/stores/fics/movement-classes'

const useSettingMovementClassesList = () => {
  const { setting_movement_classes_list } = storeToRefs(
    useSettingMovementClassesStore('v1')
  )
  const { _getListAction } = useSettingMovementClassesStore('v1')

  const isOpenExpansionItem = ref(false)

  const headerProps = {
    title: 'Clases de movimiento',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Clases de movimiento',
        route: 'SettingMovementClassesList',
      },
    ],
  }

  const tableProps = ref({ loading: false })

  const tableGroups = computed(() =>
    (setting_movement_classes_list.value as IMovementGroup[]).map((group) => ({
      title: group.name,
      rows: group.classes_movements.filter((row) => row.id < 28),
      columns: [
        {
          name: 'id',
          required: true,
          label: '#',
          align: 'center',
          field: 'id',
          sortable: true,
        },
        {
          name: 'code',
          required: true,
          label: 'Código',
          align: 'left',
          field: 'code',
          sortable: true,
        },
        {
          name: 'description',
          required: true,
          label: 'Descripción',
          align: 'left',
          field: 'description',
          sortable: true,
        },
      ] as QTable['columns'],
    }))
  )

  onMounted(async () => {
    tableProps.value.loading = true

    await _getListAction()

    tableProps.value.loading = false
  })

  return {
    headerProps,
    tableGroups,
    isOpenExpansionItem,
  }
}

export default useSettingMovementClassesList
