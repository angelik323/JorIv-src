// vue - quasar - pinia
import { onMounted, onBeforeUnmount, ref, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader, useS3Documents, useUtils } from '@/composables'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useRealStateProjectStore } from '@/stores/trust-business/real-state-project'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { IFile, ITabs } from '@/interfaces/global'
import {
  IDocumentRealStateProject,
  IRealStateProject,
  IRealStateProjectStages,
} from '@/interfaces/customs/trust-business/RealStateProject'

const useRealStateProjectEdit = () => {
  // imports
  const router = useRouter()
  const route = useRoute()

  const realStateProjectId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { data_information_form, data_response } = storeToRefs(
    useRealStateProjectStore('v1')
  )
  const { _setDataInformationForm } = useRealStateProjectStore('v1')

  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const {
    _getRealStateProject,
    _updateRealStateProject,
    _updateRealStateProjectStage,
    _addFile,
    _deleteActionFile,
    _clearData,
  } = useRealStateProjectStore('v1')

  const response_map = ref<IRealStateProject>()

  const keys = {
    trust_business: [
      'project_type',
      'development_type',
      'base_calculation_property',
      'associated_financing',
      'project_status',
      'business_inmobiliary',
    ],
    assets: ['departments', 'banks'],
  }

  const keys2 = {
    trust_business: ['third_parties'],
  }

  // props
  const headerProps = {
    title: 'Editar registro de proyecto inmobiliario',
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
        label: 'Editar registro de proyecto inmobiliario',
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

  const formInformation = ref()

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  const makeDataRealSateProject = (): IRealStateProject => {
    return {
      id: data_information_form.value?.id,
      business_trust_id: data_information_form.value?.business_trust_id ?? null,
      project_name: data_information_form.value?.project_name ?? null,
      project_type: data_information_form.value?.project_type ?? null,
      description: data_information_form.value?.description ?? null,
      num_stages: data_information_form.value?.num_stages ?? null,
      status_id: data_information_form.value?.status_id ?? null,
    }
  }

  const makeDataRealSateProjectStage = (): IRealStateProjectStages[] => {
    return (
      data_information_form.value?.stages?.map((stage) => ({
        id: stage.id,
        stage_number: stage.stage_number,
        address: stage.address ?? null,
        land_area: stage.land_area ?? null,
        builder_id: stage.builder_id ?? null,
        technical_supervision_id: stage.technical_supervision_id ?? null,
        property_registration: 'a',
        start_date: stage.start_date ?? null,
        start_end: stage.start_end ?? null,
        total_value: stage.total_value ?? null,
        financed_value: stage.financed_value ?? null,
        associated_financing: stage.associated_financing ?? null,
        observations: stage.observations ?? null,
        development_type: stage.development_type ?? null,
        block_nomenclature: stage.block_nomenclature ?? null,
        number_of_groups: stage.number_of_groups ?? null,
        initial_group: stage.initial_group ?? null,
        final_group: stage.final_group ?? null,
        total_units_stage: stage.total_units_stage ?? null,
        property_area_m2: stage.property_area_m2 ?? null,
        property_value_calculation: `${stage.property_value_calculation}`,
        property_value: stage.property_value ?? null,
        department_id: stage.department_id ?? null,
        number_of_unit_per_group: stage.number_of_unit_per_group ?? null,
        city_id: stage.city_id ?? null,
        policies_id: stage.policies_id ?? null,
        guarantee_id: stage.guarantee_id ?? null,
        financing_bank_id: stage.financing_bank_id ?? null,
        business_trust_project_id: stage.business_trust_project_id ?? null,
        business_trust_id: stage.business_trust_id ?? null,
        base_calculation_property: stage.base_calculation_property ?? null,
        amount_smmlv: stage.amount_smmlv ?? null,
        year_base_smmlv: stage.year_base_smmlv ?? null,
        estimated_smmlv: stage.estimated_smmlv ?? null,
        nomenclatures: stage.nomenclatures ?? [],
        documents: stage.documents ?? [],
        status_id: stage.status_id ?? null,
      })) ?? []
    )
  }

  const handleDocumentsUpload = async (
    files: IDocumentRealStateProject[],
    id: number
  ): Promise<string[]> => {
    const documentIds: string[] = []
    const uploadUrls: string[] = []
    const filesToUpload: IFile[] = []

    for (const fileField of files) {
      const file = fileField
      if (!file) continue
      const { success, documentId, uploadUrl } = await _addFile(
        file.name,
        getExtensionFromMimeType(file.type ?? ''),
        id,
        file.name
      )

      if (!success || !documentId || !uploadUrl) continue

      documentIds.push(documentId.toString())
      uploadUrls.push(uploadUrl)
      filesToUpload.push(file.file)
    }

    if (!uploadUrls.length || !filesToUpload.length) return []

    await _saveDocumentsS3(uploadUrls, filesToUpload, false)

    return documentIds
  }

  const goToList = () => {
    _clearData()
    router.push({
      name: 'RealStateProjectList',
      query: {
        reload: 1,
      },
    })
  }
  const handleDeleteFiles = async () => {
    const stages = data_response.value?.stages ?? []
    const keys = [
      'alienation_permit',
      'builder_credit',
      'construction_license',
    ] as const

    const allDocs = stages.flatMap((stage) =>
      keys.flatMap((key) => stage.attachments?.[key] ?? [])
    )

    await Promise.all(allDocs.map((doc) => _deleteActionFile(doc.id, false)))
  }
  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)

      const data: IRealStateProject = makeDataRealSateProject()

      await _updateRealStateProject(data.id ?? 0, data)

      const stages = makeDataRealSateProjectStage()

      if (!stages.length) return

      stages.forEach(async (stage) => {
        await _updateRealStateProjectStage(stage.id ?? 0, stage)
        await handleDocumentsUpload(stage.documents || [], stage.id ?? 0)
      })

      await handleDeleteFiles()

      goToList()
      openMainLoader(false)
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  // lifecycle hooks
  onBeforeMount(async () => {
    openMainLoader(true)
    await _getRealStateProject(realStateProjectId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  const allKeys = [keys, keys2]

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all(allKeys.map((k) => _getResources(k)))
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    await Promise.all(allKeys.map((k) => _resetKeys(k)))
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
    formInformation,
    onSubmit,
  }
}
export default useRealStateProjectEdit
