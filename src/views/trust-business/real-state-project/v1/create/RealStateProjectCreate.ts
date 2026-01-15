// vue - quasar - pinia
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader, useS3Documents } from '@/composables'

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

const useRealStateProjectCreate = () => {
  const router = useRouter()

  // imports
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    _createRealStateProject,
    _createRealStateProjecStages,
    _addFile,
    _clearData,
  } = useRealStateProjectStore('v1')

  const { data_information_form } = storeToRefs(useRealStateProjectStore('v1'))
  const { _setDataInformationForm } = useRealStateProjectStore('v1')

  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const keys = {
    trust_business: [
      'project_type',
      'development_type',
      'base_calculation_property',
      'associated_financing',
      'business_inmobiliary',
    ],
    assets: ['departments', 'banks'],
  }

  const keys2 = {
    trust_business: ['third_parties'],
  }

  // props
  const headerProps = {
    title: 'Crear registro de proyecto inmobiliario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
        route: '',
      },
      {
        label: 'Proyecto inmobiliario',
        route: 'RealStateProjectList',
      },
      {
        label: 'Crear registro de proyecto inmobiliario',
        route: '',
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
      business_trust_id: data_information_form.value?.business_trust_id ?? null,
      project_name: data_information_form.value?.project_name ?? null,
      project_type: data_information_form.value?.project_type ?? null,
      description: data_information_form.value?.description ?? null,
      num_stages: data_information_form.value?.num_stages ?? null,
    }
  }

  const makeDataRealSateProjectStage = (): IRealStateProjectStages[] => {
    return (
      data_information_form.value?.stages?.map((stage) => ({
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

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)

      const data: IRealStateProject = makeDataRealSateProject()
      const idRealSrateProjectId = await _createRealStateProject(
        data.business_trust_id ?? 0,
        data
      )
      if (idRealSrateProjectId === 0) return

      const stages = makeDataRealSateProjectStage()
      if (!stages.length) return
      stages.forEach(async (stage) => {
        const idStage = await _createRealStateProjecStages(
          idRealSrateProjectId,
          stage
        )
        await handleDocumentsUpload(stage.documents || [], idStage)
      })
      goToList()

      openMainLoader(false)
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  // lifecycle hooks
  const allKeys = [keys, keys2]

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all(allKeys.map((k) => _getResources(k)))
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    await _setDataInformationForm(null)
    return Promise.all([_resetKeys(keys), _resetKeys(keys2)])
  })

  return {
    headerProps,
    tabs,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    formInformation,
    data_information_form,
    onSubmit,
    goToList,
    validateForm,
  }
}
export default useRealStateProjectCreate
