// vue - pinia
import { computed, onMounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useRouter } from 'vue-router'

// interfaces
import {
  IBillingCollect,
  IBusinessAccounting,
  IBusinessBudget,
  IBusinessCxPTrustBusiness,
  IBusinessDerivedContracting,
  IBusinessTreasury,
  IRegulationTrustBusiness,
  ITrustBusinessRegisters,
  ITrustBusinessRegisterThird,
  ModelsMapType,
  RegisterKey,
} from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'
import { ActionType } from '@/interfaces/global/Action'

// composables
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { useUtils } from '@/composables/useUtils'
import { useAlert } from '@/composables/useAlert'

const useRegisters = (
  props: {
    action: ActionType
    data?: ITrustBusinessRegisters | null
    business_type: string | number | null
    is_consortium: boolean
    has_cxp: boolean
    has_budget: boolean
    derivate_contracting: boolean
    has_normative: boolean
    status_id?: number
    name?: string
    business_id?: number
  },
  emit: Function
) => {
  // router
  const router = useRouter()
  const { isEmptyOrZero } = useUtils()
  const { showAlert } = useAlert()

  // imports
  const { validateRouter } = useRouteValidator()

  // computed
  const models = ref<ITrustBusinessRegisters>({
    business_resources: [],
    business_accounting: null,
    business_treasurie: null,
    business_account_payable: null,
    business_normative: [],
    business_billing: [],
    business_derivate_contrating: null,
    business_budget: null,
  })

  const registerSelected = ref<{
    name: string
    label: string
    subtitle?: string
    showButton: boolean
    titleModal?: string
    type_resource?: number
  } | null>(null)

  const isLoading = ref(true)

  const is_view = computed(() => props.action === 'view')

  const is_preoperative = computed(
    () => props.status_id !== 56 && props.action === 'edit'
  )

  // tipo de negocio
  const business_type = computed(() => Number(props.business_type))

  // sociedad fiduciaria o fondos de inversión colectiva
  const is_types_investment_funds_or_trust_company = computed(() =>
    business_type.value ? ![9, 10].includes(business_type.value) : false
  )

  // fiducia de garantía
  //const is_guarantee_trust = computed(() => business_type.value === 4)

  // consorciado
  const isConsortium = computed(() => props.is_consortium === true)

  // dinamics components
  type FormComponentInstance = {
    validateForm: () => Promise<boolean> | boolean
  }

  type FormRef = ComponentPublicInstance<FormComponentInstance>
  const formRefs = ref<Partial<Record<RegisterKey, FormRef>>>({})
  type ExpansionRef = ComponentPublicInstance<{ show: () => void }>
  const expansionRefs = ref<Partial<Record<RegisterKey, ExpansionRef>>>({})

  const getAccountingModels = ref<IBusinessAccounting | null>(null)

  const getTreasuryModels = ref<IBusinessTreasury | null>(null)

  const getCxPModels = ref<IBusinessCxPTrustBusiness | null>(null)

  const getRegulationModels = ref<IRegulationTrustBusiness[] | null>(null)

  const getBillingModels = ref<IBillingCollect[] | null>(null)

  const getDerivedContractingModels = ref<IBusinessDerivedContracting | null>(
    null
  )

  const getBudgetModels = ref<IBusinessBudget | null>(null)

  const modelsMap: ModelsMapType = {
    accounting: getAccountingModels,
    treasury: getTreasuryModels,
    cxp: getCxPModels,
    regulation: getRegulationModels,
    billing: getBillingModels,
    derived_contracting: getDerivedContractingModels,
    budget: getBudgetModels,
    fiduciary_fee: ref(null),
  }

  const getModel = <K extends keyof ModelsMapType>(name: K) => {
    return modelsMap[name as keyof ModelsMapType]?.value ?? null
  }

  const updateModel = <K extends keyof ModelsMapType>(
    name: K,
    value: NonNullable<ModelsMapType[K]['value']>
  ) => {
    switch (name) {
      case 'accounting':
        models.value.business_accounting = value as IBusinessAccounting
        getAccountingModels.value = value as IBusinessAccounting
        break
      case 'treasury':
        models.value.business_treasurie = value as IBusinessTreasury
        getTreasuryModels.value = value as IBusinessTreasury
        break
      case 'derived_contracting':
        models.value.business_derivate_contrating =
          value as IBusinessDerivedContracting
        getDerivedContractingModels.value = value as IBusinessDerivedContracting
        break
      case 'budget':
        models.value.business_budget = value as IBusinessBudget
        getBudgetModels.value = value as IBusinessBudget
        break
      case 'fiduciary_fee':
        break
      case 'cxp':
        models.value.business_account_payable =
          value as IBusinessCxPTrustBusiness
        getCxPModels.value = value as IBusinessCxPTrustBusiness
        break
      case 'regulation':
        models.value.business_normative = value as IRegulationTrustBusiness[]
        getRegulationModels.value = value as IRegulationTrustBusiness[]
        break
      case 'billing':
        models.value.business_billing = value as IBillingCollect[]
        getBillingModels.value = value as IBillingCollect[]
        break
    }
  }

  const setFormRef = (name: RegisterKey, el: FormRef | undefined) => {
    formRefs.value[name] = el
  }

  const setExpansionRef = (name: RegisterKey, el: ExpansionRef | undefined) => {
    expansionRefs.value[name] = el
  }

  const validateForms = async () => {
    const accounting = formRefs.value['accounting']
    const accountingExp = expansionRefs.value['accounting']

    const treasury = formRefs.value['treasury']
    const treasuryExp = expansionRefs.value['treasury']

    const cxp = formRefs.value['cxp']
    const cxpExp = expansionRefs.value['cxp']

    const regulation = formRefs.value['regulation']
    const regulationExp = expansionRefs.value['regulation']

    const derived_contracting = formRefs.value['derived_contracting']
    const derived_contractingExp = expansionRefs.value['derived_contracting']

    const budget = formRefs.value['budget']
    const budgetExp = expansionRefs.value['budget']

    if (getAccountingModels.value && accounting) {
      const ok = await accounting.validateForm()
      if (!ok) {
        accountingExp?.show()
        return false
      }
    }

    if (getTreasuryModels.value && treasury) {
      const ok = await treasury.validateForm()
      if (!ok) {
        treasuryExp?.show()
        return false
      }
    }

    if (props.has_cxp && cxp) {
      const ok = await cxp.validateForm()
      if (!ok) {
        cxpExp?.show()
        return false
      }
    }

    if (props.has_normative && regulation) {
      const ok = await regulation.validateForm()
      if (!ok) {
        regulationExp?.show()
        return false
      }
    }

    if (getDerivedContractingModels.value && derived_contracting) {
      const ok = await derived_contracting.validateForm()
      if (!ok) {
        derived_contractingExp?.show()
        return false
      }
    }
    if (props.has_budget && getBudgetModels.value && budget) {
      const ok = await budget.validateForm()
      if (!ok) {
        budgetExp?.show()
        return false
      }
    }

    if (is_types_investment_funds_or_trust_company.value) {
      const trustors =
        models.value.business_resources?.filter(
          (item) => item.type_resource === 2
        ) || []
      if (trustors.length === 0) {
        showAlert(
          'Por favor, agregue los fideicomitentes para poder continuar con la creación del negocio.',
          'info'
        )
        return false
      }
      const beneficiaries =
        models.value.business_resources?.filter(
          (item) => item.type_resource === 3
        ) || []
      if (beneficiaries.length === 0) {
        showAlert(
          'Por favor, agregue los beneficiarios para poder continuar con la creación del negocio.',
          'info'
        )
        return false
      }
    }

    return true
  }

  // actions
  const thirdOptions = [
    'trustor',
    'participation_beneficiaries',
    'obligation_beneficiaries',
    'consortium_members',
  ]

  const register_expansion = computed(() => {
    const dynamic = [
      {
        name: 'trustor',
        label: 'Fideicomitentes',
        subtitle: undefined,
        showButton:
          is_types_investment_funds_or_trust_company.value &&
          !is_view.value &&
          !is_preoperative.value,
        titleModal: 'Registro de fideicomitentes',
        type_resource: 2,
        labelButton: undefined,
      },
      {
        name: 'participation_beneficiaries',
        label: 'Beneficiarios',
        subtitle: undefined,
        showButton:
          is_types_investment_funds_or_trust_company.value &&
          !is_view.value &&
          !is_preoperative.value,
        titleModal: 'Registro de Beneficiario de participación',
        type_resource: 3,
        labelButton: undefined,
      },
      /* TODO:pendiente de validación para saber con quienes debe mostrarse
      {
        name: 'obligation_beneficiaries',
        label: 'Beneficiarios de obligación',
        subtitle: undefined,
        showButton:
          is_guarantee_trust.value && !is_view.value && !is_preoperative.value,
        titleModal: 'Registro de Beneficiario de obligación',
        type_resource: 1,
      },
*/
      ...(props.is_consortium
        ? [
            {
              name: 'consortium_members',
              label: 'Consorciados',
              subtitle: undefined,
              showButton:
                isConsortium.value && !is_view.value && !is_preoperative.value,
              titleModal: 'Registro de Consorciados',
              type_resource: 4,
              labelButton: undefined,
            },
          ]
        : []),
    ]

    const staticPart = [
      { name: 'accounting', label: 'Contabilidad' },
      { name: 'treasury', label: 'Tesorería' },
      ...(props.has_normative
        ? [{ name: 'regulation', label: 'Normativa' }]
        : []),
      ...(props.has_cxp ? [{ name: 'cxp', label: 'Cuentas por pagar' }] : []),
      ...(props.action === 'create'
        ? []
        : [{ name: 'billing', label: 'Facturación' }]),
      ...(props.derivate_contracting
        ? [{ name: 'derived_contracting', label: 'Contratación derivada' }]
        : []),
      ...(props.has_budget ? [{ name: 'budget', label: 'Presupuesto' }] : []),
      ...(validateRouter(
        'SettlementCommissions',
        'BusinessTrustCommissionsList',
        'list'
      )
        ? [
            {
              name: 'fiduciary_fee',
              label: 'Comisión fiduciaria',
              subtitle:
                props.action === 'create'
                  ? 'Las comisiones fiduciarias deben ser creadas desde el submódulo de '
                  : undefined,
              showButton: props.action !== 'create',
              labelButton: props.action === 'edit' ? 'Editar' : 'Ver',
            },
          ]
        : []),
      ...(props.action !== 'create'
        ? [
            ...(validateRouter('BusinessTrust', 'RealStateProjectList', 'list')
              ? [
                  {
                    name: 'real_estate',
                    label: 'Proyectos Inmobiliarios',
                    showButton: true,
                    labelButton: props.action === 'edit' ? 'Editar' : 'Ver',
                  },
                ]
              : []),

            ...(validateRouter('BusinessTrust', 'PolicyList', 'list')
              ? [
                  {
                    name: 'policies',
                    label: 'Pólizas',
                    showButton: true,
                    labelButton: props.action === 'edit' ? 'Editar' : 'Ver',
                  },
                ]
              : []),

            ...(validateRouter('BusinessTrust', 'GuaranteesList', 'create')
              ? [
                  {
                    name: 'guarantees',
                    label: 'Garantías',
                    showButton: true,
                    labelButton: props.action === 'edit' ? 'Editar' : 'Ver',
                  },
                ]
              : []),
          ]
        : []),
    ].map((item) => ({
      ...item,
      showButton: item.showButton ? item.showButton : false,
      labelButton: item.labelButton ? item.labelButton : undefined,
      type_resource: undefined,
      titleModal: undefined,
    }))

    return [...dynamic, ...staticPart]
  })

  const goToRegister = (name: string) => {
    switch (name) {
      case 'fiduciary_fee':
        {
          const routeData = router.resolve({
            name: 'BusinessTrustCommissionsList',
            query: {
              trust_business: props.name,
            },
          })
          window.open(routeData.href, '_blank')
        }
        break
      case 'real_estate':
        {
          const routeData = router.resolve({
            name: 'RealStateProjectList',
            query: {
              trust_business: props.name,
            },
          })
          window.open(routeData.href, '_blank')
        }
        break
      case 'policies':
        {
          const routeData = router.resolve({
            name: 'PolicyList',
            query: {
              trust_business: props.business_id,
            },
          })
          window.open(routeData.href, '_blank')
        }
        break
      case 'guarantees':
        {
          const routeData = router.resolve({
            name: 'GuaranteesList',
            query: {
              trust_business: props.name,
            },
          })
          window.open(routeData.href, '_blank')
        }
        break
    }
  }

  // modal
  const alertModalRef = ref()

  const openAlertModal = async (idx: number) => {
    registerSelected.value = register_expansion.value[idx]
    await alertModalRef.value?.openModal()
  }

  const closeAlertModalRef = (data: ITrustBusinessRegisterThird[] | null) => {
    models.value.business_resources = [
      ...(models.value.business_resources || []).filter(
        (item) => item.type_resource !== registerSelected.value?.type_resource
      ),
      ...(data || []),
    ]
    alertModalRef.value?.closeModal()
  }

  // init
  const _setValueModel = () => {
    if (props.data) {
      models.value = { ...props.data }
      getAccountingModels.value = props.data.business_accounting || null
      getTreasuryModels.value = props.data.business_treasurie || null
      getCxPModels.value = props.data.business_account_payable || null
      getRegulationModels.value = props.data.business_normative || null
      getBillingModels.value = props.data.business_billing || null
      getDerivedContractingModels.value =
        props.data.business_derivate_contrating || null
      getBudgetModels.value = props.data.business_budget || null
    }
  }

  // lifecycles
  onMounted(async () => {
    isLoading.value = true
    await _setValueModel()
    isLoading.value = false
  })

  // watchs
  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        emit('update:models', null)
      } else {
        emit('update:models', models.value)
      }
    },
    {
      deep: true,
    }
  )

  watch(
    () => isConsortium.value,
    (val) => {
      if (!val) {
        models.value.business_resources =
          models.value.business_resources?.filter(
            (item) => item.type_resource !== 4
          )
      }
    },
    { deep: true }
  )

  watch(
    () => is_types_investment_funds_or_trust_company.value,
    (val) => {
      if (!val) {
        models.value.business_resources =
          models.value.business_resources?.filter(
            (item) => item.type_resource && ![2, 3].includes(item.type_resource)
          )
      }
    },
    { deep: true }
  )

  watch(
    () => props.has_budget,
    (val) => {
      if (!val) {
        const { business_budget, ...rest } = models.value

        models.value = {
          ...rest,
        }
        getBudgetModels.value = null
      }
    }
  )

  watch(
    () => props.derivate_contracting,
    (val) => {
      if (!val) {
        const { business_derivate_contrating, ...rest } = models.value

        models.value = {
          ...rest,
        }

        getDerivedContractingModels.value = null
      }
    }
  )
  watch(
    () => props.has_normative,
    (val) => {
      if (!val) {
        const { business_normative, ...rest } = models.value

        models.value = {
          ...rest,
        }

        getRegulationModels.value = null
      }
    }
  )

  watch(
    () => props.has_cxp,
    (val) => {
      if (!val) {
        const { business_account_payable, ...rest } = models.value

        models.value = {
          ...rest,
        }

        getCxPModels.value = null
      }
    }
  )

  return {
    models,
    register_expansion,
    alertModalRef,
    thirdOptions,
    registerSelected,
    formRefs,
    expansionRefs,
    isLoading,
    setFormRef,
    setExpansionRef,
    openAlertModal,
    closeAlertModalRef,
    getModel,
    updateModel,
    validateForms,
    goToRegister,
  }
}

export default useRegisters
