// vue - quasar - pinia
import { onMounted, onBeforeUnmount, ref, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader } from '@/composables'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useRealStateProjectStore } from '@/stores/trust-business/real-state-project'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { ITabs } from '@/interfaces/global'
import {
  IDocumentRealStateProject,
  IRealStateProject,
} from '@/interfaces/customs/trust-business/RealStateProject'

import { useUtils } from '@/composables'

const useRealStateProjectEdit = () => {
  // imports
  const route = useRoute()

  const realStateProjectId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _getRealStateProject } = useRealStateProjectStore('v1')
  const { data_response } = storeToRefs(useRealStateProjectStore('v1'))

  const { _setDataInformationForm } = useRealStateProjectStore('v1')

  const response_map = ref<IRealStateProject>()

  const keys = {
    trust_business: [
      'project_type',
      'development_type',
      'base_calculation_property',
    ],
  }
  const keys_filter = {
    trust_business: [
      'business_trusts&filter[business_type_id]=2&filter[status_id]=59',
    ],
  }

  // props
  const headerProps = {
    title: 'Ver registro de proyecto inmobiliario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Proyecto inmobiliario',
        route: 'RealStateProjectList',
      },
      {
        label: 'Ver registro de proyecto inmobiliario',
      },
      { label: `${realStateProjectId}` },
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
  ])

  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)

  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getRealStateProject(realStateProjectId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  // lifecycle hooks
  onMounted(() => {
    openMainLoader(true)
    _getResources(keys)
    _getResources(keys_filter)
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    await _resetKeys(keys)
    await _setDataInformationForm(null)
  })

  watch(
    () => data_response.value,
    async () => {
      const data = data_response.value

      if (!data) return

      response_map.value = {
        id: data.id,
        project_name: data.project_name,
        project_type: data.project_type,
        description: data.description,
        num_stages: data.num_stages,
        status: data.status,
        status_id: data.status.id,
        business_trust_id: data.business_trust.id,
        business_trust: data.business_trust,
        stages: await Promise.all(
          data.stages.map(async (item) => ({
            id: item.id,
            stage_number: item.stage_number,
            address: item.address,
            land_area: item.land_area,
            builder_id: item.builder.id ?? null,
            builder_name: item.builder.name ?? '',
            technical_supervision_id: item.technical_supervision.id ?? null,
            technical_supervision_name: item.technical_supervision.name ?? null,
            property_registration: item.property_registration,
            start_date: item.start_date,
            start_end: item.start_end,
            total_value: item.total_value,
            financed_value: item.financed_value,
            associated_financing: item.associated_financing,
            observations: item.observations,
            development_type: item.development_type,
            block_nomenclature: item.block_nomenclature,
            number_of_groups: item.number_of_groups,
            initial_group: item.initial_group,
            final_group: item.final_group,
            total_units_stage: item.total_units_stage,
            property_area_m2: item.property_area_m2,
            property_value_calculation: Number(item.property_value_calculation),
            property_value: item.property_value,
            department_id: item.department?.id,
            department_name: item.department?.name,
            city_id: item.city?.id,
            city_name: item.city?.name,
            policies_id: item.policy?.id,
            policies_name: `${item.policy?.policy_type} - ${item.policy?.policy_number}`,
            guarantee_id: item.guarantee?.id,
            guarantees_name: `${item.guarantee?.guarantee_type} - ${item.guarantee?.description}`,
            financing_bank_id: item.financing_bank?.id,
            financing_bank_name: item.financing_bank?.description,
            business_trust_project_id: data.business_trust.id,
            business_trust_id: data.business_trust.id,
            base_calculation_property: Number(item.property_value_calculation),
            amount_smmlv: item.amount_smmlv,
            year_base_smmlv: item.year_base_smmlv,
            estimated_smmlv: item.estimated_smmlv,
            number_of_unit_per_group: item.number_of_unit_per_group,
            nomenclatures:
              item.nomenclatures?.map((n) => ({
                id: n.id,
                index_number: n.index_number,
                nomenclature: n.nomenclature,
                area: n.area,
                value: n.value,
                status_id: n.status?.id ?? 0,
              })) ?? [],
            documents: await Promise.all(
              Object.values(item.attachments ?? {}).map(async (docs) => {
                if (Array.isArray(docs) && docs.length > 0) {
                  const first = docs[0]
                  const file = await useUtils().getFileFromS3(
                    first.s3_file_path,
                    `${first.original_name}.${first.document_type}`
                  )
                  return {
                    file,
                    name: first.original_name,
                    required: true,
                    id: first.id,
                    type: first.document_type,
                  } as IDocumentRealStateProject
                }
                return null
              })
            ).then((arr) => arr.filter((doc) => doc !== null)),
            status_id: item.status?.id,
          }))
        ),
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    tabs,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    response_map,
  }
}
export default useRealStateProjectEdit
