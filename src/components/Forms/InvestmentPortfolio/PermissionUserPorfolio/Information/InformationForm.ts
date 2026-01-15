// vue | quasar | router
import { onBeforeMount, onUnmounted, ref, watch } from 'vue'
import { debounce } from 'quasar'

// store
import { storeToRefs } from 'pinia'
import {
  useInvestmentPortfolioResourceStore,
  usePermissionUserPorfolioStore,
  useResourceManagerStore,
  useUserResourceStore,
} from '@/stores'

// utils
import { IPermissionUserPorfolioForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import { useMainLoader } from '@/composables'

const useInformationForm = (props: {
  action: ActionType
  data?: IPermissionUserPorfolioForm | null
}) => {
  const { _setDataInformationForm } = usePermissionUserPorfolioStore('v1')
  const { data_information_form } = storeToRefs(
    usePermissionUserPorfolioStore('v1'),
  )
  const { openMainLoader } = useMainLoader()
  const { _getResources } = useResourceManagerStore('v1')
  const { user_permissions } = storeToRefs(useUserResourceStore('v1'))
  const { permissions_investment_portfolio } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1'),
  )

  // props
  const formElementRef = ref()
  const initialModelsValues: IPermissionUserPorfolioForm = {
    user_code: {
      code: '',
      id: null,
    },
    user_name: '',
    portfolio_code: {
      code: '',
      id: null,
    },
    portfolio_description: '',
  }

  const models = ref<IPermissionUserPorfolioForm>({
    ...initialModelsValues,
  })

  // handlers / actions
  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  const setForm = (data: IPermissionUserPorfolioForm) => {
    models.value.user_code = { code: data.document ?? '', id: data.id ?? null }
    models.value.portfolio_code = {
      code: data.investment_portfolio_code ?? '',
      id: data.investment_portfolio_id ?? null,
    }
    models.value.user_id = data.user_id ?? ''
    models.value.user_name = data.user_name ?? ''
    models.value.portfolio_description = data.investment_name ?? ''
    models.value.created_at = data.created_at ?? ''
    models.value.creator_data = data.creator_data ?? ''
    models.value.updated_at = data.updated_at ?? ''
    models.value.updated_data = data.updated_data ?? ''
  }

  const setFormEdit = async () => {
    clearForm()
    const data = data_information_form.value

    if (!data) return
    setForm(data)
  }

  const _setFormView = async () => {
    const data = data_information_form.value

    if (!data) return
    setForm(data)
  }

  const _setValueModel = () => {
    if (!data_information_form.value) return

    Object.assign(models.value, data_information_form.value)
  }

  const clearForm = () => {
    Object.assign(models.value, initialModelsValues)
  }

  // Manejador de codigos
  const isMatchingUserCode = ref(true)
  const isMatchingPortfolioCode = ref(true)

  const handlerUserCode = debounce(async (userCode: string) => {
    openMainLoader(true)
    await _getResources({ user: ['users'] }, `filter[search]=${userCode}`)
    openMainLoader(false)

    const userSelected = user_permissions.value.find(
      (u) => u.document === userCode,
    )
    if (!userSelected) {
      models.value.user_name = ''
      isMatchingUserCode.value = false
      return
    }

    models.value.user_name = `${userSelected?.name} ${userSelected?.last_name}`
    isMatchingUserCode.value = true
    models.value.user_code = { code: userCode, id: Number(userSelected.id) }
  }, 500)

  const handlerPortfolioCode = debounce(async (portfolioCode: string) => {
    openMainLoader(true)
    await _getResources(
      { investment_portfolio: ['investment_portfolio'] },
      `filter[code]=${portfolioCode}`,
    )
    openMainLoader(false)
    const portfolioSelected = permissions_investment_portfolio.value.find(
      (u) => u.code === portfolioCode,
    )

    if (!portfolioSelected) {
      models.value.portfolio_description = ''
      isMatchingPortfolioCode.value = false
      return
    }
    models.value.portfolio_description = `${portfolioSelected?.name}`

    isMatchingPortfolioCode.value = true
    models.value.portfolio_code = {
      code: portfolioCode,
      id: Number(portfolioSelected.id),
    }
  }, 500)

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  onBeforeMount(() => {
    handlerActionForm(props.action)
  })

  // watchers
  watch(
    () => data_information_form.value,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true },
  )

  return {
    isMatchingPortfolioCode,
    handlerPortfolioCode,
    isMatchingUserCode,
    user_permissions,
    handlerUserCode,
    formElementRef,
    models,
  }
}

export default useInformationForm
