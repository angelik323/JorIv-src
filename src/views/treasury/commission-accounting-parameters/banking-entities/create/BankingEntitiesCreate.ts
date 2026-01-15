import { useMainLoader, useUtils } from '@/composables'
import { ICreateBankingEntitiesAccountingParametersCommissions } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import {
  useBankingEntitiesAccountingParametersCommissionsStore,
  useResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useBankingEntitiesCreate = (selectID: number) => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { data_information_form } = storeToRefs(
    useBankingEntitiesAccountingParametersCommissionsStore('v1')
  )

  const {
    _setDataInformationForm,
    _createBankingEntitiesAccountingParametersCommissions,
  } = useBankingEntitiesAccountingParametersCommissionsStore('v1')

  const { _getResourcesTreasuries } = useResourceStore('v1')

  const keys = ['banks', 'treasury_movement_codes']
  const headerProps = {
    title: 'Crear parámetros entidades bancarias',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Bloques contables de recaudo',
        route: 'CollectionAccountingBlocksList',
      },
      {
        label: 'Entidades bancarias',
        route: '',
      },
      {
        label: 'Crear',
        route: 'BankingEntitiesAccountingParametersCommissionsCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: useUtils().defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const makeDataRequest =
    (): ICreateBankingEntitiesAccountingParametersCommissions => {
      const {
        bank_id,
        description,
        treasury_movement_code_id,
        validates_collection_method,
        commission_rate,
        commission_percentage,
        fixed_value,
        observations,
      } = data_information_form.value ?? {}
      return {
        bank_id: bank_id ?? 0,
        description: description ?? '',
        treasury_movement_code_id: treasury_movement_code_id ?? 0,
        validates_collection_method: validates_collection_method ?? false,
        commission_rate: commission_rate ?? '',
        commission_percentage: commission_percentage ?? null,
        fixed_value: fixed_value ?? null,
        observations: observations ?? '',
        accounting_blocks_collection_id: selectID,
      }
    }

  const activeTab = ref<string>(tabs.value[0].name)

  const tabActiveIdx = ref<number>(
    tabs.value.findIndex((tab: ITabs) => tab.name === activeTab.value)
  )

  const informationFormRef = ref<{
    validateForm: () => Promise<boolean>
  } | null>(null)

  const validateForm = async (): Promise<boolean> => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  onMounted(async () => {
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
  })

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  const handlerGoTo = (goURL: string): void => {
    router.push({ name: goURL })
  }

  const onSubmit = async (): Promise<void> => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = {
        ...makeDataRequest(),
        accounting_blocks_collection_id: selectID,
      }
      if (
        await _createBankingEntitiesAccountingParametersCommissions(payload)
      ) {
        handlerGoTo('CollectionAccountingBlocksList')
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    handlerGoTo,
    onSubmit,
  }
}

export default useBankingEntitiesCreate
