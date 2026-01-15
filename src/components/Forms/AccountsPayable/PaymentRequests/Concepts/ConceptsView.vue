<template>
  <q-form ref="conceptsFormFormRef" class="q-pa-md">
    <section>
      <div class="flex justify-between">
        <p class="text-h6">Conceptos</p>
      </div>

      <VCard class="full-width">
        <template #content-card>
          <div class="q-pa-md">
            <TableList
              ref="tableRef"
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :pages="tableProps.pages"
              :custom-columns="[]"
              :hide-pagination="true"
            >
            </TableList>
          </div>
        </template>
      </VCard>
    </section>

    <section v-if="tablePropsBudget.rows.length > 0">
      <div class="flex justify-between">
        <p class="text-h6">Presupuesto</p>
      </div>

      <VCard class="full-width">
        <template #content-card>
          <div class="q-pa-md">
            <TableList
              ref="tableBudgetRef"
              :loading="tablePropsBudget.loading"
              :columns="tablePropsBudget.columns"
              :rows="tablePropsBudget.rows"
              :pages="tablePropsBudget.pages"
              :custom-columns="[]"
              :hide-pagination="true"
            >
            </TableList>
          </div>
        </template>
      </VCard>
    </section>

    <q-separator />
  </q-form>
</template>

<script setup lang="ts">
// components
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'

// interfaces
import { IPaymentRequestConceptsForm } from '@/interfaces/customs/accounts-payable/PaymentRequests'
import { ActionType } from '@/interfaces/global'

// logic view
import useConceptsView from '@/components/Forms/AccountsPayable/PaymentRequests/Concepts/ConceptsView'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentRequestConceptsForm | null
  }>(),
  {}
)

const {
  conceptsFormFormRef,
  tableRef,
  tableBudgetRef,
  tableProps,
  tablePropsBudget,
} = useConceptsView(props, emit)

defineExpose({
  validateForm: () => conceptsFormFormRef.value?.validate(),
})
</script>
