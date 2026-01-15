import { useMainLoader, useUtils } from '@/composables'
import {
  IBankingEntitiesAccountingParametersCommissions,
  ICreateBankingEntitiesAccountingParametersCommissions,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import {
  useBankingEntitiesAccountingParametersCommissionsStore,
  useResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onBeforeMount, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useBankingEntitiesEdit = (selectID: number) => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const route = useRoute()
  const bankingEntityId = +route.params.id

  const { data_information_form, type_banking_entities_request } = storeToRefs(
    useBankingEntitiesAccountingParametersCommissionsStore('v1')
  )
  const {
    _setDataInformationForm,
    _updateBankingEntitiesAccountingParametersCommissions,
    _getByIdBankingEntitiesAccountingParametersCommissions,
  } = useBankingEntitiesAccountingParametersCommissionsStore('v1')

  const { _getResourcesTreasuries } = useResourceStore('v1')

  const keys = ['banks', 'treasury_movement_codes']

  const headerProps = ref<{
    title: string
    breadcrumbs: Array<{ label: string; route?: string }>
  }>({
    title: 'Editar parámetros entidades bancarias',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Bloques contables de recaudo',
        route: 'CollectionAccountingBlocksList',
      },
      {
        label: 'Parámetros de entidades bancarias',
        route: '',
      },
      {
        label: 'Editar',
        route: 'BankingEntitiesAccountingParametersCommissionsEdit',
      },
      { label: bankingEntityId.toString() },
    ],
  })

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

  const activeTab = ref<string>(tabs.value[0].name)
  const tabActiveIdx = ref<number>(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )
  const informationFormRef = ref<{
    validateForm?: () => Promise<boolean>
  } | null>(null)

  onUnmounted(() => {
    _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
    _setDataInformationForm(null)
  })

  const handlerGoTo = (goURL: string): void => {
    router.push({ name: goURL })
  }

  const makeDataRequest =
    (): ICreateBankingEntitiesAccountingParametersCommissions => {
      return {
        bank_id: data_information_form.value?.bank_id ?? null,
        description: data_information_form.value?.description ?? '',
        treasury_movement_code_id:
          data_information_form.value?.treasury_movement_code_id ?? null,
        validates_collection_method:
          data_information_form.value?.validates_collection_method ?? false,
        commission_rate: data_information_form.value?.commission_rate ?? '',
        commission_percentage:
          data_information_form.value?.commission_percentage ?? null,
        fixed_value: data_information_form.value?.fixed_value ?? null,
        observations: data_information_form.value?.observations ?? '',
        accounting_blocks_collection_id:
          selectID ??
          data_information_form.value?.accounting_blocks_collection_id,
      }
    }

  const onSubmit = async (): Promise<void> => {
    openMainLoader(true)
    const payload = {
      ...makeDataRequest(),
      accounting_blocks_collection_id: selectID,
    }
    if (
      await _updateBankingEntitiesAccountingParametersCommissions(
        payload,
        bankingEntityId
      )
    ) {
      router.push({ name: 'CollectionAccountingBlocksList' })
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdBankingEntitiesAccountingParametersCommissions(
      bankingEntityId
    )
    if (type_banking_entities_request.value) {
      const req =
        type_banking_entities_request.value as IBankingEntitiesAccountingParametersCommissions

      _setDataInformationForm({
        bank_id: req.bank?.id ?? null,
        description: req.description ?? '',
        treasury_movement_code_id: req.treasury_movement_code_id?.id ?? null,
        validates_collection_method: req.validates_collection_method ?? false,
        commission_rate: req.commission_rate ?? '',
        commission_percentage: req.commission_percentage
          ? Number(req.commission_percentage)
          : null,
        fixed_value: req.fixed_value ?? null,
        observations: req.observations ?? '',
        accounting_blocks_collection_id: selectID,
      })
    }
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    data_information_form,
    type_banking_entities_request,
    handlerGoTo,
    onSubmit,
  }
}
export default useBankingEntitiesEdit
