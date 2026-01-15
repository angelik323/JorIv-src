<template>
  <q-form ref="formElementRef">
    <section class="mb-4 q-mt-md q-pt-lg amounts-table">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :custom-columns="['payment_number', 'status']"
        :rows-per-page-options="[0]"
        hideBottom
      >
        <template #status="{ row }">
          <ShowStatus
            :type="Number(row?.status.id ?? 1)"
            status-type="billingPortfolio"
          />
        </template>

        <template #payment_number="{ row }">
          <GenericSelectorComponent
            :default_value="row?.payment_number ?? null"
            :manual_option="numberOfPayments"
            hide_bottom_space
            map_options
            auto_complete
            required
            return_object
            :rules="[(val: string) => useRules().is_required(val,  'El número de pago es requerido')]"
            @update:modelValue="
              (value) => handlePaymentNumberChange(row, value)
            "
          />
        </template>
      </TableList>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

import { IResource, WriteActionType } from '@/interfaces/global'
import { useRules } from '@/composables'

import useBasicDataForm from '@/components/Forms/BillingPortfolio/TrustCommisionCollection/BasicDataForm'
import { ITrustCommissionCollectionItemList } from '@/interfaces/customs'

withDefaults(
  defineProps<{
    action: WriteActionType
    tableProps: any
    handlePaymentNumberChange: (
      row: ITrustCommissionCollectionItemList,
      value: { label: string; value: number } | null
    ) => void
    numberOfPayments: IResource[]
  }>(),
  {}
)

defineEmits<(e: 'validate:form') => void>()

const { formElementRef } = useBasicDataForm()

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
