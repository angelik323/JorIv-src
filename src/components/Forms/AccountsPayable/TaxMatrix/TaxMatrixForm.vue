<template>
  <q-form
    ref="taxMatrixFormRef"
    class="q-pa-lg"
    :aria-label="`Formulario de matriz tributaria ${taxType}`"
  >
    <section>
      <VCard>
        <template #content-card>
          <div class="q-pa-lg">
            <div class="q-mb-md text-center">
              <p class="text-weight-medium q-mb-none">Calidad tributaria (NIT tributario)</p>
            </div>

            <TableList
              hidePagination
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :custom-columns="tableProps.customColumns"
            >
              <template
                v-for="columnKey in tableProps.customColumns"
                :key="columnKey"
                #[columnKey]="{ row }"
              >
                <div v-if="isReadonly">
                  <Icon
                    v-if="row.columns[columnKey]"
                    name="CheckCircle2"
                    :size="20"
                    color="orange"
                  />
                  <Icon v-else name="XCircle" :size="20" color="grey" />
                </div>

                <RadioYesNo
                  v-else
                  :modelValue="row.columns[columnKey]"
                  @update:modelValue="(val: boolean) => (row.columns[columnKey] = val)"
                  :isRadioButton="false"
                  :hasTitle="false"
                  :hasSubtitle="false"
                  customClass="flex justify-center"
                />
              </template>
            </TableList>
          </div>
        </template>
      </VCard>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Icon from '@/components/common/Icon/Icon.vue'

// Interfaces
import {
  ITaxMatrixItem,
  TaxType,
} from '@/interfaces/customs/accounts-payable/TaxMatrix'
import { ActionType } from '@/interfaces/global'

// Logic view
import useTaxMatrixForm from '@/components/Forms/AccountsPayable/TaxMatrix/TaxMatrixForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITaxMatrixItem | null
    taxType: TaxType | 'RFT' | 'RIV' | 'RIC' | 'RTE'
  }>(),
  {}
)

const { isReadonly, getValues, tableProps, taxMatrixFormRef } =
  useTaxMatrixForm(props)

defineExpose({ getValues })
</script>
