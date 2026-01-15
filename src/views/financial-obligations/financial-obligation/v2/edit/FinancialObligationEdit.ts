// vue - quasar
import { onBeforeMount, onBeforeUnmount, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// stores
import { useFinancialObligationStore } from '@/stores/financial-obligations/financial-obligation'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useFinantialObligationResourceStore } from '@/stores/resources-manager/finantial-obligations'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IFinancialObligationFormV2,
  IFinancialObligationDocument,
  IFinancialObligationUpdateV2,
  IFinancialObligationAuditInfo,
  IFinancialObligationAuthorizationObservation,
  IFinancialObligationDetailV2,
} from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'

// composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

const { defaultIconsLucide, cleanEmptyFields, getFileFromS3 } = useUtils()

const useFinancialObligationEdit = () => {
  // route
  const route = useRoute()
  const searchId = +route.params.id

  // composables
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()

  // loader
  const { openMainLoader } = useMainLoader()

  // imports
  const { getResources: getTreasuryResources } = useTreasuryResourceStore('v1')
  const {
    getResources: getTrustBusinessResources,
    resetKeys: resetTrustBusinessKeys,
  } = useTrustBusinessResourceStore('v1')
  const { getResources: getFinantialObligationResources } =
    useFinantialObligationResourceStore('v2')

  const { headerPropsDefault } = storeToRefs(useFinancialObligationStore('v2'))
  const {
    _getFinancialObligationById,
    _updateFinancialObligation,
    _addFinancialObligationDocument,
  } = useFinancialObligationStore('v2')

  // keys
  const trust_business_keys = ['business_trusts']
  const treasury_keys = ['banks', 'third_party_nit']
  const financial_obligation_keys = [
    'credit_types',
    'periodicity_types',
    'calculation_methods',
    'base_calculations',
    'quota_types',
    'amortization_types',
  ]

  // breadcrumb
  const headerPropsEdit = {
    title: 'Editar obligación financiera',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Editar',
          route: 'FinancialObligationEdit',
        },
        {
          label: `${searchId}`,
        },
      ],
    ],
  }

  // state
  const isLoading = ref(true)
  const responseData = ref<IFinancialObligationDetailV2 | null>(null)
  const isAuthorized = ref(false)

  // form refs
  const formBasicData = ref()

  // init data children
  const getBasicDataFormData = ref<IFinancialObligationFormV2 | null>(null)
  const getDocumentsFormData = ref<IFinancialObligationDocument[]>([])
  const auditInfo = ref<IFinancialObligationAuditInfo>({
    status_id: null,
    status_name: null,
    created_at: null,
    created_by: null,
    updated_at: null,
    updated_by: null,
  })
  const authorizationObservations = ref<
    IFinancialObligationAuthorizationObservation[]
  >([])

  // set data children
  const setBasicDataFormData = (data: IFinancialObligationFormV2 | null) => {
    getBasicDataFormData.value = data
  }

  const setDocumentsFormData = (data: IFinancialObligationDocument[]) => {
    getDocumentsFormData.value = data
  }

  // tabs
  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'observations',
      label: 'Observaciones',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ]

  const [initialTab] = tabs
  const tabActive = ref(initialTab.name)
  const tabActiveIdx = ref(tabs.indexOf(initialTab))

  // actions
  const makeDataRequest = (): IFinancialObligationUpdateV2 => {
    const formData = getBasicDataFormData.value!

    return cleanEmptyFields(
      {
        obligation_number: formData.obligation_number,
        business_trust_id: formData.business_trust_id,
        business_trust_name: formData.business_trust_name,
        business_trust_code: formData.business_trust_code,
        titular_id: formData.titular_id,
        titular_name: formData.titular_name,
        titular_nit: formData.titular_nit,
        bank_id: formData.bank_id,
        credit_type_id: formData.credit_type_id,
        amount: formData.amount,
        interest_rate: formData.interest_rate,
        factor_id: formData.factor_id,
        periodicity_id: formData.periodicity_id,
        quotas: formData.quotas,
        payment_day: formData.payment_day,
        alert_days: formData.alert_days,
        payment_plan_configuration: {
          calculation_method:
            formData.calculation_method_id as unknown as string,
          calculation_base: Number(formData.calculation_base_id) || 360,
          quota_type: formData.quota_type_id as unknown as string,
          amortization_type: formData.amortization_type_id as unknown as string,
          start_date: formData.start_date,
        },
      },
      true
    ) as IFinancialObligationUpdateV2
  }

  const onSubmit = async () => {
    openMainLoader(true)

    const payload: IFinancialObligationUpdateV2 = makeDataRequest()

    const success = await _updateFinancialObligation(searchId, payload)

    if (success) {
      if (getDocumentsFormData.value && getDocumentsFormData.value.length > 0) {
        await handleDocumentsUpload(searchId, getDocumentsFormData.value)
      }

      openMainLoader(false)
      showAlert('Registro actualizado exitosamente', 'success', undefined, 3000)
      return goToURL('FinancialObligationList')
    }

    openMainLoader(false)
  }

  const handleDocumentsUpload = async (
    obligationId: number,
    files: IFinancialObligationDocument[]
  ): Promise<void> => {
    for (const fileField of files) {
      const file = fileField.file
      if (!file || !fileField.is_new) continue

      await _addFinancialObligationDocument(obligationId, file)
    }
  }

  const goToEditDocuments = () => {
    goToURL('FinancialObligationEditDocuments', { id: searchId })
  }

  // lifecycles
  onBeforeMount(async () => {
    openMainLoader(true)

    await getTreasuryResources(`?keys[]=${treasury_keys.join('&keys[]=')}`)
    await getFinantialObligationResources(
      `?keys[]=${financial_obligation_keys.join('&keys[]=')}`
    )
    await getTrustBusinessResources(
      `?keys[]=${trust_business_keys.join('&keys[]=')}`
    )

    responseData.value = await _getFinancialObligationById(searchId)
    isLoading.value = false

    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    resetTrustBusinessKeys(trust_business_keys as never[])
  })

  onUnmounted(() => {
    getBasicDataFormData.value = null
    getDocumentsFormData.value = []
    responseData.value = null
  })

  // watchers
  watch(
    () => responseData.value,
    async (val) => {
      if (!val) return

      const basicData = val.basic_data
      const quotas = val.payment_plan?.quotas ?? []
      const firstQuota = quotas[0]
      const lastQuota = quotas[quotas.length - 1]

      const AUTHORIZED_STATUS_ID = 2
      isAuthorized.value =
        basicData.obligation_status?.id === AUTHORIZED_STATUS_ID

      // Mapear datos de auditoría
      auditInfo.value = {
        status_id: basicData.obligation_status?.id ?? null,
        status_name: basicData.authorize_status ?? null,
        created_at: basicData.creation?.created_at ?? null,
        created_by: basicData.creation?.created_by
          ? typeof basicData.creation.created_by === 'string'
            ? basicData.creation.created_by
            : `${basicData.creation.created_by.name ?? ''} ${
                basicData.creation.created_by.last_name ?? ''
              }`.trim()
          : null,
        updated_at: null,
        updated_by: null,
      }

      // Mapear observaciones de autorización
      const logs = val.authorizations?.logs ?? []
      authorizationObservations.value = logs.map(
        (log: Record<string, unknown>) => ({
          id: (log.id as number) ?? 0,
          observation: (log.observations as string) ?? null,
          user_name: log.created_by ? String(log.created_by) : null,
          decision_date: (log.created_at as string) ?? null,
          status_name: (log.status as string) ?? null,
        })
      )

      // Mapear datos del formulario
      getBasicDataFormData.value = {
        business_trust_id: basicData.business_trust?.id ?? null,
        business_trust_code: basicData.business_trust?.code ?? null,
        business_trust_name: basicData.business_trust?.name ?? null,
        obligation_number: basicData.obligation_number,
        titular_id: basicData.titular?.id ?? null,
        titular_name: basicData.titular?.name ?? null,
        titular_nit: basicData.titular?.nit?.toString() ?? null,
        bank_id: basicData.bank?.id ?? null,
        bank_name: basicData.bank?.description ?? null,
        credit_type_id: basicData.credit_type?.id ?? null,
        amount: basicData.amount ? parseFloat(basicData.amount) : null,
        interest_rate: basicData.interest_rate
          ? parseFloat(basicData.interest_rate)
          : null,
        factor_id: basicData.factor?.id ?? null,
        periodicity_id: basicData.periodicity?.id ?? null,
        quotas: basicData.quotas,
        payment_day: basicData.payment_day,
        alert_days: basicData.alert_days,
        calculation_method_id:
          (basicData.payment_plan_configuration
            ?.calculation_method as unknown as number) ?? null,
        calculation_base_id:
          basicData.payment_plan_configuration?.calculation_base ?? null,
        quota_type_id:
          (basicData.payment_plan_configuration
            ?.quota_type as unknown as number) ?? null,
        amortization_type_id:
          (basicData.payment_plan_configuration
            ?.amortization_type as unknown as number) ?? null,
        start_date:
          basicData.payment_plan_configuration?.start_date ??
          firstQuota?.payment_date ??
          null,
        end_date: lastQuota?.payment_date ?? null,
        initial_balance: firstQuota?.initial_balance
          ? parseFloat(firstQuota.initial_balance)
          : null,
        capital_quota: firstQuota?.capital_quota
          ? parseFloat(firstQuota.capital_quota)
          : null,
      }

      // Mapear documentos
      if (val.attachments && val.attachments.length > 0) {
        getDocumentsFormData.value = await Promise.all(
          val.attachments.map(async (item: IFinancialObligationDocument) => {
            const file = await getFileFromS3(
              item.s3_file_path ?? '',
              item.original_name ?? ''
            )
            return {
              ...item,
              file: file ?? undefined,
              is_new: false,
              to_delete: false,
            }
          })
        )
      }
    },
    { deep: true }
  )

  return {
    headerPropsEdit,
    tabs,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    formBasicData,
    getBasicDataFormData,
    getDocumentsFormData,
    auditInfo,
    authorizationObservations,
    isLoading,
    isAuthorized,
    searchId,

    onSubmit,
    goToURL,
    goToEditDocuments,
    setBasicDataFormData,
    setDocumentsFormData,
  }
}

export default useFinancialObligationEdit
