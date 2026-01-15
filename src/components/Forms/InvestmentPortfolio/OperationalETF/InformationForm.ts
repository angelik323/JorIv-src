import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { ActionType } from '@/interfaces/global'

import {
  useFicResourceStore,
  useInvestmentPortfolioResourceStore,
  useOperationalETFStore,
} from '@/stores'
import { IOperationalETFEdit } from '@/interfaces/customs'

const useInformationForm = (props: {
  action: ActionType
  id?: number
  hasLoadedData: boolean
}) => {
  const { operational_etf, operational_etf_raw } = storeToRefs(
    useOperationalETFStore('v1')
  )

  const { administrators_codes, emitter, coins, isin_code_mnemonics_local } =
    storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { funds } = storeToRefs(useFicResourceStore('v1'))

  const informationForm = ref()

  const isEdit = computed(() => props.action === 'edit')
  const isView = computed(() => props.action === 'view')

  const isValidBusiness = ref<boolean>(true)

  const validateInvestmentPortfolio = () => {
    return informationForm.value?.validate()
  }

  const getPayloadData = () => {
    return operational_etf.value
  }

  onMounted(() => {
    if (!(isEdit.value || isView.value)) return
    const stop = watch(
      () => [
        props.hasLoadedData,
        administrators_codes.value.length,
        emitter.value.length,
        isin_code_mnemonics_local.value.length,
        operational_etf_raw.value,
      ],
      ([ready, ac, em, isin, raw]) => {
        if (!ready || !ac || !em || !isin || !raw) return
        setEditPayload(raw as unknown as IOperationalETFEdit)
        stop()
      },
      { immediate: true }
    )
  })

  watch(
    () => operational_etf.value.administrator_id,
    (id) => {
      const sel = administrators_codes.value.find(
        (i) => String(i.value) === String(id)
      )

      operational_etf.value.admin_description = sel?.description ?? ''
    },
    { immediate: true }
  )

  watch(
    () => operational_etf.value.transmitter_id,
    (id) => {
      const sel = emitter.value.find((i) => String(i.value) === String(id))
      operational_etf.value.transmitter_description = sel?.description ?? ''
    },
    { immediate: true }
  )

  watch(
    () => operational_etf.value.isin_code_id,
    (id) => {
      const sel = isin_code_mnemonics_local.value.find(
        (i) => String(i.value) === String(id)
      )
      operational_etf.value.nemotechnic = sel?.description ?? ''
    },
    { immediate: true }
  )

  const setEditPayload = async (api: IOperationalETFEdit) => {
    operational_etf.value.etf_number = Number(
      api.etf_number ?? operational_etf.value.etf_number ?? 0
    )
    operational_etf.value.description = api.description ?? ''
    operational_etf.value.index_type = api.index_type ?? ''
    operational_etf.value.index_description = api.index_description ?? ''
    operational_etf.value.status_id = Number(
      api.status?.id ?? operational_etf.value.status_id ?? 1
    )

    const adminId =
      administrators_codes.value.find(
        (i) =>
          String(i.document_third ?? '').trim() ===
            String(api.administrator?.nit ?? '').trim() ||
          String(i.label ?? '').startsWith(`${api.administrator?.nit ?? ''} -`)
      )?.id ?? 0

    operational_etf.value.administrator_id = Number(adminId || 0)
    operational_etf.value.admin_description =
      api.administrator?.description ??
      administrators_codes.value.find((i) => Number(i.id) === Number(adminId))
        ?.description ??
      ''

    const emMatch = emitter.value.find(
      (i) =>
        String(i.document_third ?? '').trim() ===
          String(api.transmitter?.nit ?? '').trim() ||
        String(i.label ?? '').startsWith(`${api.transmitter?.nit ?? ''} -`)
    )

    const transmVal = emMatch ? Number(emMatch.value) : 0
    operational_etf.value.transmitter_id = transmVal
    operational_etf.value.transmitter_description =
      api.transmitter?.description ?? emMatch?.description ?? ''

    const isinId =
      isin_code_mnemonics_local.value.find(
        (i) =>
          String(i.description ?? '').trim() ===
            String(api.isin?.mnemonic ?? '').trim() ||
          String(i.label ?? '').endsWith(`- ${api.isin?.mnemonic ?? ''}`)
      )?.value ?? 0

    operational_etf.value.isin_code_id = Number(isinId || 0)
    operational_etf.value.nemotechnic =
      api.isin?.mnemonic ??
      isin_code_mnemonics_local.value.find(
        (i) => String(i.value) === String(isinId)
      )?.description ??
      ''
    const coinMatch = coins.value.find((c) =>
      String(c.label ?? '').startsWith(`${api.currency?.code ?? ''} -`)
    )
    operational_etf.value.currency_id = Number(coinMatch?.value ?? 0)
  }

  return {
    operational_etf,
    informationForm,
    isView,
    isEdit,
    emitter,
    coins,
    isin_code_mnemonics_local,
    administrators_codes,
    isValidBusiness,
    funds,
    getPayloadData,
    validateInvestmentPortfolio,
    setEditPayload,
  }
}

export default useInformationForm
