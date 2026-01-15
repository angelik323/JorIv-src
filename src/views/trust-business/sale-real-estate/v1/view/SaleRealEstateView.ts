// vue - quasar - router - pinia
import { ref, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader, useUtils } from '@/composables'

// stores
import { useSaleRealEstateStore } from '@/stores/trust-business/sale-real-estate'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { ITabs } from '@/interfaces/global'
import { ISaleRealEstate } from '@/interfaces/customs/trust-business/SaleRealEstate'
import { IDocumentRealStateProject } from '@/interfaces/customs/trust-business/RealStateProject'
import { IAttachmentTableDiscontinuances } from '@/interfaces/customs/trust-business/Discontinuances'

const useSaleRealEstateView = () => {
  // imports
  const router = useRouter()
  const route = useRoute()

  const saleRealEstateId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()

  const { _clearData, _getByIdAction } = useSaleRealEstateStore('v1')

  const { data_response } = storeToRefs(useSaleRealEstateStore('v1'))

  const response_map = ref<ISaleRealEstate>()

  // props
  const headerProps = {
    title: 'Ver venta de inmueble',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Venta de inmueble',
        route: 'SaleRealEstateList',
      },
      {
        label: 'Ver registro de proyecto inmobiliario',
      },
      { label: `${saleRealEstateId}` },
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

  const goToList = () => {
    _clearData()
    router.push({ name: 'SaleRealEstateList' })
  }

  const onSubmit = async () => {
    openMainLoader(true)

    goToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdAction(saleRealEstateId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  watch(
    () => data_response.value,
    async () => {
      const data = data_response.value
      if (!data) return

      response_map.value = {
        id: data.id,
        creation_date: data.created_at ?? '',
        status_id: data.status.id,
        buyers: data.buyers?.map((b) => ({
          buyer_id: b.third_party_id,
        })),
        real_estate_project_id: data.project_id,
        real_estate_project_name: data.project_name,
        real_estate_project_stage_id: data.project_stage_id ?? null,
        real_estate_project_stage_name: `${data.project_stage}`,
        real_estate_project_nomenclature_id: data.property_detail.id,
        real_estate_project_nomenclature_name:
          data.property_detail.nomenclature,
        type: data.type_property_text,
        area: data.property_detail?.area?.toString(),
        value: data.property_detail?.value?.toString(),
        date: data.property_detail?.start_end?.toString(),
        has_extraordinary_paymentes: data.has_extraordinary_payment,
        has_extraordinary_payment: data.has_extraordinary_payment ?? null,
        fiduciary_mandate_id: data.payment_plan?.fiduciary_mandate_id ?? null,
        fiduciary_mandate_name: data.payment_plan?.fiduciary_mandate ?? null,
        extraordinaryPayment: data.extraordinary_payments?.map((ep) => ({
          id: ep.id,
          extraordinary_payment_value: ep.amount,
          concept: ep.concept,
        })),
        financial_obligation: data.payment_plan?.financial_obligation,
        payment_plan_list: data.payment_plan_list,
        documents: await Promise.all(
          Object.values(data.attachments ?? {}).map(
            async (docs: IAttachmentTableDiscontinuances) => {
              if (Array.isArray(docs) && docs.length > 0) {
                const first = docs[0]
                const file = await useUtils().getFileFromS3(
                  first.s3_file_path,
                  `${
                    first.original_name_file
                      ? first.original_name_file
                      : first.name
                  }.${first.document_type}`
                )
                return {
                  file,
                  name: first.original_name_file,
                  DbType: first.original_name,
                  required: true,
                  id: first.id,
                  type: first.document_type,
                } as IDocumentRealStateProject
              }
              return null
            }
          )
        ).then((arr) => arr.filter((doc) => doc !== null)),
      } as ISaleRealEstate
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

    onSubmit,
    goToList,
  }
}
export default useSaleRealEstateView
