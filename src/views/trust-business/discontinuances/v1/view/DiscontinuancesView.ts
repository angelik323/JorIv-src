// vue - quasar
import { onMounted, onBeforeUnmount, ref, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader, useUtils } from '@/composables'

// stores
import { useDiscontinuancesStore } from '@/stores/trust-business/discontinuances'
import { useResourceManagerStore } from '@/stores/resources-manager'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { ITabs } from '@/interfaces/global'
import {
  IAttachmentTableDiscontinuances,
  IDiscontinuances,
  IDiscontinuancesExtraDataResponse,
} from '@/interfaces/customs/trust-business/Discontinuances'
import { IDocumentRealStateProject } from '@/interfaces/customs/trust-business/RealStateProject'

const useDiscontinuancesView = () => {
  // imports
  const router = useRouter()
  const route = useRoute()

  const discontinuancesId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _clearData, _getByIdAction } = useDiscontinuancesStore('v1')

  const { data_response, data_tables } = storeToRefs(
    useDiscontinuancesStore('v1')
  )
  const response_map = ref<IDiscontinuances>()

  const keys = {
    trust_business: [
      'business_trusts_property_withdrawals_states',
      'project_stage',
      'business_trust_properties',
      'means_of_payment',
    ],
  }

  const keys2 = {
    trust_business: ['business_trusts'],
  }

  const keys3 = {
    trust_business: ['business_trust_real_estate_project'],
  }

  const keysV2 = {
    treasury: ['banks'],
  }

  // props
  const headerProps = {
    title: 'Ver desistimiento',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Desistimientos',
        route: 'DiscontinuancesList',
      },
      {
        label: 'Ver',
      },
      {
        label: `${discontinuancesId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'auth',
      label: 'Autorización',
      icon: defaultIconsLucide.circleCheckBig,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)

  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  const formInformation = ref()

  const goToList = () => {
    _clearData()
    router.push({ name: 'DiscontinuancesList' })
  }

  const onSubmit = async () => {
    openMainLoader(false)
    goToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdAction(discontinuancesId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  const allKeys = [keys, keys2, keys3]

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all(allKeys.map((k) => _getResources(k)))
    await _getResources(keysV2, '', 'v2')
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    await Promise.all(allKeys.map((k) => _resetKeys(k)))
  })

  watch(
    () => data_response.value,
    async () => {
      const data = data_response.value
      if (!data) return

      response_map.value = {
        id: data.id,
        business_trust_id: data.business_trust?.id ?? null,
        business_trust_name: data.business_trust?.name ?? null,
        real_estate_project_id: data.real_estate_project.id ?? null,
        real_estate_project_name: data.real_estate_project?.name ?? '',
        project_stage_id: data.project_stage.id ?? null,
        project_stage_name: `${data.project_stage?.stage_number} - ${data.project_stage?.observations}`,
        business_trust_property_id: data.property_nomenclature?.id ?? null,
        business_trust_property_name:
          data.property_nomenclature?.nomenclature ?? '',
        status_id: data.status_id ?? null,
        date_register: data.registration_date ?? '',
        date_vinculation: data.date_vinculation ?? '',
        property_value: data.property_value ?? '',
        total_paid: data.total_paid ?? '',
        balance_due: data.balance_due ?? '',
        order_number: data.order_number ?? '',
        refund_amount: data.order_of_payment?.refund_amount ?? null,
        retention_amount: data.order_of_payment?.retention_amount
          ? Number(data.order_of_payment.retention_amount)
          : null,
        penalty_amount: data.order_of_payment?.penalty_amount
          ? Number(data.order_of_payment.penalty_amount)
          : null,
        net_refund_amount: data.order_of_payment?.net_refund_amount
          ? Number(data.order_of_payment.net_refund_amount)
          : null,
        refund_method_id:
          Number(data.order_of_payment?.refund_method?.id) ?? null,

        refund_method_name:
          data.order_of_payment.refund_method?.type_mean_of_payments,
        bank_id: data.order_of_payment?.bank?.id ?? null,
        bank_name: data.order_of_payment?.bank?.description ?? '',
        bank_account_number: data.order_of_payment?.bank_account_number ?? null,
        bank_account_number_name:
          data.order_of_payment?.bank_account_number ?? null,

        documents: await Promise.all(
          (data.attachments_table ?? []).map(
            async (doc: IAttachmentTableDiscontinuances) => {
              const file = await useUtils().getFileFromS3(
                doc.actions.download_url,
                `${doc.original_name_file ? doc.original_name_file : doc.item}`
              )

              return {
                file,
                name: doc.original_name_file,
                DbType: doc.item,
                required: true,
                id: doc.id,
                type: doc.original_name_file
                  ? doc.original_name_file.split('.').pop() ?? 'unknown'
                  : 'unknown',
              } as IDocumentRealStateProject
            }
          )
        ).then((arr) => arr.filter((doc) => doc !== null)),
        observations: data.observations ?? '',
      } as IDiscontinuances

      data_tables.value = {
        owner: {
          id: data.main_owner.id,
          status_id: data.main_owner.status_id,
          status: data.main_owner.status,
          document_type_id: data.main_owner.document_type_id,
          document_type: data.main_owner.document_type,
          email: data.main_owner.email,
          phone: data.main_owner.phone,
          address: data.main_owner.address,
          document: data.main_owner.document,
          name: data.main_owner.name,
          type: data.main_owner.type,
        },
        payment_plans:
          data.payment_plans?.map((item) => ({
            id: item.id ?? 0,
            installment_number: item.installment_number ?? '',
            initial_balance: item.initial_balance ?? '',
            total_value: item.total_value ?? '',
            late_interest: item.late_interest ?? '',
            capital_fee: item.capital_fee ?? '',
            final_balance: item.final_balance ?? '',
            payment_date: item.payment_date ?? '',
            status_id: Number(item.status_id),
          })) ?? [],
      } as IDiscontinuancesExtraDataResponse
    },
    { deep: true }
  )

  return {
    headerProps,
    tabs,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    formInformation,
    response_map,

    goToList,
    backTab,
    nextTab,
    onSubmit,
  }
}
export default useDiscontinuancesView
