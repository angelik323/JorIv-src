import { useUtils } from '@/composables'
import { IIssuersCounterpartiesForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import {
  useIssuersCounterpartiesStore,
  useResourceManagerStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const useIssuersCounterpartiesForm = (props: {
  action: ActionType
  id?: number
}) => {
  const { data_issuers_counterparties_form, responseThirdDocument } =
    storeToRefs(useIssuersCounterpartiesStore('v1'))

  const { risk_rating_agencie, lp_issuer_rating, cp_issuer_rating } =
    storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _validExistsThirdDocument, _setDataIssuersCounterpartiesForm } =
    useIssuersCounterpartiesStore('v1')

  const informationFormRef = ref()

  const models = ref<IIssuersCounterpartiesForm>({
    third_party_id: 0,
    document_third: '',
    type_third: '',
    description: '',
    anna_code: '',
    emitter_type: '',
    rating_agency: '',
    cp_issuer_rating: '',
    lp_issuer_rating: '',
    class_ratings: [],
    history_issuers_counter_party: {
      created_at: null,
      creator_data: '',
      updated_at: null,
      update_data: null,
    },
  })

  const isCreateOrEdit = ['create', 'edit'].includes(props.action)

  const keys = {
    investment_portfolio: [
      'risk_rating_agencie',
      'qualification_lp',
      'qualification_cp',
    ],
  }

  onMounted(async () => {
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => data_issuers_counterparties_form.value,
    (newValue) => {
      if (newValue) {
        models.value = newValue
      }
    }
  )

  const validateThirdDocument = async (value: string) => {
    if (!value || value.trim() === '') {
      return
    }

    const isValid = await _validExistsThirdDocument(value)
    if (isValid) {
      models.value.third_party_id = responseThirdDocument.value.id ?? 0
      models.value.document_third = responseThirdDocument.value.document || ''
      models.value.description =
        responseThirdDocument.value?.natural_person?.name ||
        responseThirdDocument.value?.legal_person?.business_name ||
        ''
      models.value.type_third =
        responseThirdDocument.value.third_party_type || ''
    }
  }

  watch(
    () => [
      models.value.document_third,
      models.value.anna_code,
      models.value.emitter_type,
      models.value.rating_agency,
      models.value.lp_issuer_rating,
      models.value.cp_issuer_rating,
      models.value.class_ratings,
    ],
    () => {
      if (useUtils().isEmptyOrZero(models.value)) {
        _setDataIssuersCounterpartiesForm(null)
      } else {
        _setDataIssuersCounterpartiesForm(models.value)
      }
    }
  )

  return {
    models,
    isCreateOrEdit,
    risk_rating_agencie,
    lp_issuer_rating,
    cp_issuer_rating,
    informationFormRef,
    validateThirdDocument,
  }
}

export default useIssuersCounterpartiesForm
