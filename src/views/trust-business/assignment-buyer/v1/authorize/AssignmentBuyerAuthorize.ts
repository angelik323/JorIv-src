// vue - quasar
import { onMounted, onBeforeUnmount, ref, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader } from '@/composables'

// stores
import { useAssignmentBuyerStore } from '@/stores/trust-business/assignment-buyer'
import { useResourceManagerStore } from '@/stores/resources-manager'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { ITabs } from '@/interfaces/global'
import {
  IAssigneeCedents,
  IAssignmentBuyer,
  IPaymentPlanAssignmentBuyer,
} from '@/interfaces/customs/trust-business/AssignmentBuyer'
import { IResponseDocuments } from '@/interfaces/customs/trust-business/RecordTransfers'

const useAssignmentBuyerAuthorize = () => {
  const router = useRouter()
  const route = useRoute()

  const assignmentBuyerId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _clearData, _getByIdAction, _authorize } =
    useAssignmentBuyerStore('v1')

  const { data_response, selectedThirdId, data_authorization, data_tables } =
    storeToRefs(useAssignmentBuyerStore('v1'))

  const { _setDataAuthorize } = useAssignmentBuyerStore('v1')
  const response_map = ref<IAssignmentBuyer>()
  const response_map_documents = ref<IResponseDocuments[]>([])

  const keys = {
    trust_business: ['participant_types'],
  }

  const keys2 = {
    trust_business: ['business_trusts&filter[can_project]=true'],
  }

  const keys3 = {
    trust_business: ['third_parties'],
  }

  // props
  const headerProps = {
    title: 'Autorizar cesión de comprador',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Cesión de comprador',
        route: 'AssignmentBuyerList',
      },
      {
        label: 'Autorizar',
      },
      {
        label: `${assignmentBuyerId}`,
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
      name: 'documents',
      label: 'Documentos*',
      icon: defaultIconsLucide.file,
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

  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)

  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  const formInformation = ref()
  const formDocuments = ref()
  const formAuthorize = ref()

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    action: false as boolean,
  })

  const openAlertModal = async (action: boolean) => {
    alertModalConfig.value.action = action
    alertModalConfig.value.description = `¿Desea ${
      action ? 'autorizar' : 'rechazar'
    } la cesión de comprador?`
    await alertModalRef.value.openModal()
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [formInformation, formDocuments]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const nextTab = async () => {
    if (await validateForms()) {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const goToList = () => {
    router.push({ name: 'AssignmentBuyerList', query: { reload: 1 } })
  }

  const onSubmit = async (action: boolean) => {
    if (await formAuthorize.value?.validateForm()) {
      openMainLoader(true)
      const isSuccess = await _authorize(
        assignmentBuyerId,
        action,
        data_authorization.value ?? ''
      )
      if (isSuccess) {
        _setDataAuthorize('')
        goToList()
      }
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdAction(assignmentBuyerId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  const allKeys = [keys, keys2, keys3]

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all(allKeys.map((k) => _getResources(k)))
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    _clearData()
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
        business_trust_name: data.business_trust?.name ?? '',
        real_estate_project_id: data.project?.id ?? null,
        real_estate_project_name: data.project?.name ?? '',
        project_stage_id: data.project_stage?.id ?? null,
        project_stage_name: `${data.project_stage?.stage_number}`,
        business_trust_property_id: data.business_trust_property_id ?? null,
        business_trust_property_name: data.property?.nomenclature ?? '',
        status_id: data.status_id?.id ?? null,
        assignees:
          data.assignees.map((item: IAssigneeCedents) => ({
            third_party_id: item.id,
          })) ?? [],
        observations: data.observations,
      }

      data_tables.value = {
        buyers:
          data.cedents.map((item: IAssigneeCedents) => ({
            id: item.id,
            third_party_id: item.id,
            buyer: item,
            name: item.name,
            third_party: {
              id: item.id,
              document_number: item.document ?? '',
              document_type: item.document_type.name ?? '',
              email: item.email ?? '',
            },
          })) ?? [],
        payment_plans: data.payment_plan.map(
          (item: IPaymentPlanAssignmentBuyer) => ({
            ...item,
          })
        ),
      }

      response_map_documents.value = data.attachments ?? []

      selectedThirdId.value =
        data.cedents.find((c: IAssigneeCedents) => c.is_cedent)?.id ?? null
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
    formDocuments,
    response_map,
    response_map_documents,
    formAuthorize,
    alertModalRef,
    alertModalConfig,

    openAlertModal,
    nextTab,
    backTab,
    onSubmit,
    goToList,
  }
}
export default useAssignmentBuyerAuthorize
