// Vue - Pinia
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { IAddresses, IContact } from '@/interfaces/customs/IThirdParties'
import { ActionType } from '@/interfaces/global'
import { estate_origin } from '@/constants'
import {
  IFiduciaryInvestmentPlansForm,
  IFiduciaryInvestmentPlansPropsForm,
} from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Composables
import { useUtils, useRules } from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useAssetResourceStore } from '@/stores/resources-manager/assets'
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const useHolderForm = (props: IFiduciaryInvestmentPlansPropsForm) => {
  const { calculateCheckDigit, isEmptyOrZero } = useUtils()
  const {
    email_validation,
    only_number,
    no_special_characters,
    no_consecutive_spaces,
    length_exactly,
  } = useRules()

  const { _setDataForm } = useFiduciaryInvestmentPlanStore('v1')
  const { data_form } = storeToRefs(useFiduciaryInvestmentPlanStore('v1'))
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { print_groups } = storeToRefs(useFicResourceStore('v1'))
  const { cities, legal_people_fund_sources } = storeToRefs(
    useAssetResourceStore('v1')
  )
  const { funts_to_investment_plans } = storeToRefs(useFicResourceStore('v1'))

  const formHolder = ref()
  const models = ref<IFiduciaryInvestmentPlansForm>({
    holder_identification: {
      holder_id: null,
      fic_print_group_id: null,
      funding_source: '',
      residential_address: '',
      email_address: '',
      phone: '',
      holder: {
        id: null,
        document: '',
        check_digit: '',
        document_type: {
          name: '',
          abbreviation: '',
        },
        name: '',
        type: '',
        contacts: [],
        addresses: [],
        financialInfo: {
          id: null,
          third_party_id: null,
          funding_source: '',
        },
        natural_person: {
          last_name: '',
          middle_name: '',
          name: '',
          second_last_name: '',
        },
        fundingSourceNaturalPerson: null,
        fundingSourceLegalPerson: null,
      },
    },
  })

  const filteredPrintGroups = computed(() => {
    const selectedFundId = data_form.value?.collective_investment_fund_id

    if (!selectedFundId) {
      return print_groups.value
    }

    const filtered = print_groups.value.filter((printGroup) => {
      return printGroup.fund_id === selectedFundId
    })

    const currentPrintGroupId =
      models.value.holder_identification.fic_print_group_id
    if (currentPrintGroupId) {
      const isValidSelection = filtered.some(
        (pg) => pg.value === currentPrintGroupId
      )

      if (!isValidSelection) {
        models.value.holder_identification.fic_print_group_id = null
        if (data_form.value?.holder_identification) {
          data_form.value.holder_identification.fic_print_group_id = null
        }
      }
    }

    return filtered
  })

  const previousFundId = ref(data_form.value?.collective_investment_fund_id)
  const isInitialLoad = ref(true)

  watch(
    () => data_form.value?.collective_investment_fund_id,
    (newFundId) => {
      if (newFundId !== previousFundId.value) {
        models.value.holder_identification.fic_print_group_id = null

        if (data_form.value?.holder_identification) {
          data_form.value.holder_identification.fic_print_group_id = null
        }

        previousFundId.value = newFundId
      }
    },
    { immediate: false }
  )

  const validatePrintGroup = computed(() => {
    const selectedId = models.value.holder_identification.fic_print_group_id
    if (!selectedId) return { email: false, fisico: false, address: false }

    const printGroup = filteredPrintGroups.value.find(
      (item) => item.value === selectedId
    )

    if (!printGroup) return { email: false, fisico: false, address: false }
    switch (printGroup.send_type) {
      case 'Envio email':
        return { email: true, fisico: false, address: false }
      case 'Envio fisico':
        return { email: false, fisico: true, address: true }
      case 'Envio fisico y por email':
        return { email: true, fisico: true, address: true }
      case 'No enviar':
        return { email: false, fisico: false, address: false }
      default:
        return { email: false, fisico: false, address: false }
    }
  })

  const fundingSourceOptions = computed(() => {
    const holderId = models.value.holder_identification?.holder_id

    if (!holderId) {
      return []
    }

    const thirdParty = third_parties.value.find(
      (item) => item.value === holderId
    )

    if (!thirdParty) {
      return []
    }

    const isNaturalPerson =
      thirdParty.natural_person &&
      Object.keys(thirdParty.natural_person).length > 0 &&
      Object.values(thirdParty.natural_person).some(
        (value) => value !== null && value !== ''
      )

    if (isNaturalPerson) {
      return estate_origin || []
    } else {
      return legal_people_fund_sources.value || []
    }
  })

  const selectedFundParameters = computed(() => {
    const selectedFundId =
      data_form.value?.collective_investment_fund_id ||
      models.value?.collective_investment_fund?.fund_id

    if (selectedFundId) {
      const fund = funts_to_investment_plans.value?.find(
        (item) => item.id === selectedFundId
      )

      const params = fund?.fic_parameters
      return Array.isArray(params) ? params[0] : params
    }
  })

  const withholdingPercentage = computed(() => {
    return (
      selectedFundParameters.value?.withholding_percentage || 'No registrado'
    )
  })

  const gmfPercentage = computed(() => {
    return selectedFundParameters.value?.gmf_percentage || 'No registrado'
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setValueModel,
      edit: data_form.value ? setValueModel : setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setValueModel = () => {
    if (data_form.value) {
      data_form.value.holder_identification =
        data_form.value.holder_identification

      data_form.value.holder_identification.holder_id =
        data_form.value.holder_identification.holder_id ??
        data_form.value.holder_identification.id

      data_form.value.holder_identification.fic_print_group_id =
        data_form.value.holder_identification.fic_print_group_id ??
        data_form.value.holder_identification.fic_print_group?.id

      data_form.value.holder_identification.city_id =
        data_form.value.holder_identification.city_id ??
        data_form.value.holder_identification.city?.id

      data_form.value.holder_identification.funding_source_id =
        data_form.value.holder_identification.funding_source_id ??
        data_form.value.holder_identification.holder?.financialInfo
          ?.funding_source ??
        undefined

      if (props.action == 'edit') {
        data_form.value.holder_identification.holder_id =
          data_form.value.holder_identification.holder?.id

        const dv = calculateCheckDigit(
          data_form.value.holder_identification.holder?.document || ''
        )

        data_form.value.holder_identification?.holder &&
          (data_form.value.holder_identification.holder.check_digit = isNaN(dv)
            ? null
            : dv.toString())

        const isNaturalPerson =
          data_form.value.holder_identification.holder?.natural_person &&
          Object.keys(
            data_form.value.holder_identification.holder.natural_person
          ).length > 0

        data_form.value.holder_identification.funding_source_id =
          (isNaturalPerson
            ? data_form.value.holder_identification?.holder
                ?.fundingSourceNaturalPerson?.source_of_goods
            : data_form.value.holder_identification?.holder
                ?.fundingSourceLegalPerson?.funding_source) || ''
      }
      models.value = { ...data_form.value }
    }
  }

  const setFormView = () => {
    if (props.data) {
      props.data.holder_identification = props.data.holder_identification

      props.data.holder_identification.holder_id =
        props.data.holder_identification.holder_id ??
        props.data.holder_identification.id

      props.data.holder_identification.fic_print_group_id =
        props.data.holder_identification.fic_print_group_id ??
        props.data.holder_identification.fic_print_group?.id

      props.data.holder_identification.city_id =
        props.data.holder_identification.city_id ??
        props.data.holder_identification.city?.id

      props.data.holder_identification.funding_source_id =
        props.data.holder_identification.funding_source_id ??
        props.data.holder_identification.holder?.financialInfo?.id ??
        undefined

      const dv = calculateCheckDigit(
        props.data.holder_identification.holder?.document || ''
      )

      props.data.holder_identification?.holder &&
        (props.data.holder_identification.holder.check_digit = isNaN(dv)
          ? null
          : dv.toString())

      models.value = { ...props.data }
      const isNaturalPerson =
        props.data.holder_identification.holder?.natural_person &&
        Object.keys(props.data.holder_identification.holder.natural_person)
          .length > 0

      models.value.holder_identification.funding_source_id =
        (isNaturalPerson
          ? models.value.holder_identification?.holder
              ?.fundingSourceNaturalPerson?.source_of_goods
          : models.value.holder_identification?.holder?.fundingSourceLegalPerson
              ?.funding_source) || ''
    }
  }

  const setFormEdit = () => {
    if (props.data) {
      props.data.holder_identification = props.data.holder_identification

      props.data.holder_identification.holder_id =
        props.data.holder_identification.holder_id ??
        props.data.holder_identification.id

      props.data.holder_identification.fic_print_group_id =
        props.data.holder_identification.fic_print_group_id ??
        props.data.holder_identification.fic_print_group?.id

      props.data.holder_identification.city_id =
        props.data.holder_identification.city_id ??
        props.data.holder_identification.city?.id

      props.data.holder_identification.funding_source_id =
        props.data.holder_identification.funding_source_id ??
        props.data.holder_identification.holder?.financialInfo?.id ??
        ''

      models.value = { ...props.data }

      models.value.holder_identification?.holder_id
    }
  }

  const cleanAddress = (address?: string): string => {
    return address
      ? address
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      : ''
  }

  const getMainAddress = (addresses: IAddresses[] | undefined): string => {
    if (!addresses?.length) return ''

    const mainAddress = addresses.find((addr) => addr.is_main === true)?.address
    const fallbackAddress = addresses[0]?.address

    return cleanAddress(mainAddress) || cleanAddress(fallbackAddress) || ''
  }

  const getContactByType = (
    contacts: IContact[] | undefined,
    contactType: string
  ): string => {
    if (!contacts?.length) return ''

    const mainContact = contacts.find(
      (contact) =>
        contact.is_main === true && contact.contact_type === contactType
    )?.contact_value

    if (mainContact) return mainContact

    const fallbackContact = contacts.find(
      (contact) => contact.contact_type === contactType
    )?.contact_value

    return fallbackContact || ''
  }

  const getPhoneContact = (contacts: IContact[] | undefined): string => {
    if (!contacts?.length) return ''

    const phoneTypes = ['phone', 'mobile']

    const mainPhone = contacts.find(
      (contact) =>
        contact.is_main === true && phoneTypes.includes(contact.contact_type)
    )?.contact_value

    if (mainPhone) {
      return mainPhone.replace(/\D/g, '').replace(/^57/, '')
    }

    const fallbackPhone = contacts.find((contact) =>
      phoneTypes.includes(contact.contact_type)
    )?.contact_value

    return fallbackPhone
      ? fallbackPhone.replace(/\D/g, '').replace(/^57/, '')
      : ''
  }

  onMounted(async () => {
    handlerActionForm(props.action)
    setTimeout(() => {
      isInitialLoad.value = false
    }, 100)
  })

  watch(
    () => models.value.holder_identification?.holder_id,
    (newHolderId, oldHolderId) => {
      if (props.action !== 'create') return

      if (
        !isInitialLoad.value &&
        newHolderId !== oldHolderId &&
        oldHolderId !== undefined
      ) {
        models.value.holder_identification.funding_source_id = undefined
      }

      models.value.holder_identification.holder = {
        id: null,
        document: models.value.holder_identification.holder?.document ?? '',
        check_digit: '',
        document_type: {
          name: '',
          abbreviation: '',
        },
        name: '',
        type: '',
        contacts: models.value.holder_identification.holder?.contacts ?? [],
        addresses: [],
        financialInfo: {
          id: null,
          third_party_id: null,
          funding_source: '',
        },
        natural_person: {
          last_name: '',
          middle_name: '',
          name: '',
          second_last_name: '',
        },
      }

      if (models.value.holder_identification?.holder_id) {
        const third_partie = third_parties.value.filter(
          (item) => item.value == models.value.holder_identification?.holder_id
        )

        if (third_partie.length > 0) {
          const dv = calculateCheckDigit(third_partie[0].document ?? '')

          models.value.holder_identification.city_id =
            third_partie[0].addresses?.[0]?.city_id ?? null
          models.value.holder_identification.holder.check_digit = isNaN(dv)
            ? null
            : dv.toString()
          models.value.holder_identification.holder.document_type.abbreviation =
            third_partie[0].document_type?.abbreviation ?? ''
          models.value.holder_identification.holder.natural_person.last_name =
            third_partie[0].natural_person?.last_name ?? ''
          models.value.holder_identification.holder.natural_person.middle_name =
            third_partie[0].natural_person?.middle_name ?? ''
          models.value.holder_identification.holder.natural_person.name =
            third_partie[0].natural_person?.name ?? ''
          models.value.holder_identification.holder.natural_person.second_last_name =
            third_partie[0].natural_person?.second_last_name ?? ''
          const isNaturalPerson =
            third_partie[0].natural_person &&
            Object.keys(third_partie[0].natural_person).length > 0

          models.value.holder_identification.funding_source_id = isNaturalPerson
            ? third_partie[0].estate?.source_of_goods
            : third_partie[0].financial_info?.funding_source

          models.value.holder_identification.residential_address =
            getMainAddress(third_partie[0].addresses)
          models.value.holder_identification.email_address = getContactByType(
            third_partie[0]?.contacts,
            'email'
          )
          models.value.holder_identification.phone =
            getPhoneContact(third_partie[0]?.contacts) ?? ''
        }
      } else {
        if (!isInitialLoad.value) {
          models.value.holder_identification.funding_source_id = undefined
        }
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.holder_identification.city_id,
    () => {
      if (models.value.holder_identification.city_id) {
        const city = cities.value.filter(
          (item) => item.value == models.value.holder_identification.city_id
        )

        if (city) {
          if (!models.value.holder_identification.city) {
            models.value.holder_identification.city = {
              id: null,
              name: '',
              code: '',
            }
          }
          models.value.holder_identification.city.name = city[0].name ?? ''
        }
      } else {
        models.value.holder_identification.city_description = ''
      }
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        isInitialLoad.value = true
        handlerActionForm(props.action)
        setTimeout(() => {
          isInitialLoad.value = false
        }, 100)
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataForm(null)
      } else {
        _setDataForm({ ...models.value })
      }
    },
    { deep: true }
  )

  return {
    models,
    formHolder,
    third_parties,
    filteredPrintGroups,
    cities,
    legal_people_fund_sources,
    fundingSourceOptions,
    validatePrintGroup,
    email_validation,
    only_number,
    no_special_characters,
    no_consecutive_spaces,
    length_exactly,
    gmfPercentage,
    withholdingPercentage,
  }
}

export default useHolderForm
