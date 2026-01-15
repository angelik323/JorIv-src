<template>
  <div>
    <VCard class="q-pa-lg" style="margin-bottom: 1.5rem">
      <template #content-card>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-end">
          <div class="col-12 col-md-4 q-mb-md">
            <p class="text-weight-bold no-margin">Fondo de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ investment_plan_operation?.fund_code || 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-md-4 q-mb-md">
            <p class="text-weight-bold no-margin">Descripción fondo</p>
            <p class="text-weight-medium no-margin">
              {{ investment_plan_operation?.fund_name || 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-md-4 q-mb-md">
            <p class="text-weight-bold no-margin">Fecha de registro</p>
            <p class="text-weight-medium no-margin">
              {{ investment_plan_operation?.request_date || 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-md-4 q-mb-md">
            <p class="text-weight-bold no-margin">Fecha de operación</p>
            <p class="text-weight-medium no-margin">
              {{ investment_plan_operation?.request_date || 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-md-4 q-mb-md">
            <p class="text-weight-bold no-margin">Negocio</p>
            <p class="text-weight-medium no-margin">
              {{
                investment_plan_operation?.business_trust_code ||
                'No registrado'
              }}
            </p>
          </div>
          <div class="col-12 col-md-4 q-mb-md">
            <p class="text-weight-bold no-margin">Plan de inversión</p>
            <p class="text-weight-medium no-margin">
              {{
                investment_plan_operation?.investment_plan || 'No registrado'
              }}
            </p>
          </div>
          <div class="col-12 col-md-4 q-mb-md">
            <p class="text-weight-bold no-margin">Número de operación</p>
            <p class="text-weight-medium no-margin">
              {{
                investment_plan_operation?.operation_number || 'No registrado'
              }}
            </p>
          </div>
          <div class="col-12 col-md-4 q-mb-md">
            <p class="text-weight-bold no-margin">Fecha de cumplimiento</p>
            <p class="text-weight-medium no-margin">
              {{
                investment_plan_operation?.compliance_date || 'No registrado'
              }}
            </p>
          </div>
          <div class="col-12 col-md-4 q-mb-md">
            <p class="text-weight-bold no-margin">Tipo de operación</p>
            <p class="text-weight-medium no-margin">
              {{ investment_plan_operation?.type || 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-md-4 q-mb-md">
            <p class="text-weight-bold no-margin">Valor de la operación</p>
            <p class="text-weight-medium no-margin">
              {{
                useUtils().formatCurrency(
                  investment_plan_operation?.operation_value
                ) ?? 'No registrado'
              }}
            </p>
          </div>
        </div>
      </template>
    </VCard>
    <VCard class="q-pa-lg">
      <template #content-card>
        <q-form ref="operationDetailForm">
          <section>
            <div class="row justify-between items-center q-pb-lg">
              <p class="mb-0 text-black-10 text-weight-bold text-h6">
                Detalle operación de retiros
              </p>
            </div>
            <VCard class="q-px-lg" style="margin-bottom: 0">
              <template #content-card>
                <section class="detail-table q-pb-lg">
                  <TableList
                    :loading="false"
                    :columns="tableProps.columns"
                    :rows="tableProps.rows"
                    :hide-pagination="true"
                    :hide-header="!tableProps.rows?.length"
                    :custom-columns="['radio']"
                  >
                    <template #radio="{ row }">
                      <RadioYesNo
                        v-model="row.selected"
                        :options="[{ label: '', value: true }]"
                        @update:model-value="selectDetail(row)"
                      />
                    </template>
                    <template v-if="tableProps.rows.length" #custom-bottom-row>
                      <q-tr>
                        <q-td colspan="4" style="height: 1.75rem" align="right">
                          <strong class="text-primary_fiduciaria">
                            Total operación
                          </strong>
                        </q-td>
                        <q-td colspan="5" style="height: 1.75rem">
                          <span>{{
                            `${useUtils().formatCurrencyString(totalValue)}`
                          }}</span>
                        </q-td>
                      </q-tr>
                    </template>
                  </TableList>
                </section>
                <section v-if="selectedRow?.id">
                  <div
                    class="row q-col-gutter-x-lg q-col-gutter-y-sm items-end"
                  >
                    <div class="col-12 col-md-4 q-mb-md">
                      <p class="text-weight-bold no-margin">
                        Banco recaudador/pagador
                      </p>
                      <p class="text-weight-medium no-margin">
                        {{ selectedRow.observations ?? 'No registrado' }}
                      </p>
                    </div>
                    <div class="col-12 col-md-4 q-mb-md">
                      <p class="text-weight-bold no-margin">
                        Descripción banco
                      </p>
                      <p class="text-weight-medium no-margin">
                        {{ selectedRow.collection_bank ?? 'No registrado' }}
                      </p>
                    </div>
                    <div class="col-12 col-md-4 q-mb-md">
                      <p class="text-weight-bold no-margin">
                        Cuenta recaudo/pagadora
                      </p>
                      <p class="text-weight-medium no-margin">
                        {{ selectedRow.observations ?? 'No registrado' }}
                      </p>
                    </div>
                    <div class="col-12 col-md-4 q-mb-md">
                      <p class="text-weight-bold no-margin">
                        Descripción cuenta recaudo/pagadora
                      </p>
                      <p class="text-weight-medium no-margin">
                        {{ selectedRow.fic_account ?? 'No registrado' }}
                      </p>
                    </div>
                    <div class="col-12 col-md-4 q-mb-md">
                      <p class="text-weight-bold no-margin">Tipo de cuenta</p>
                      <p class="text-weight-medium no-margin">
                        {{ selectedRow.observations ?? 'No registrado' }}
                      </p>
                    </div>
                  </div>
                  <q-separator class="q-mb-md" />
                  <div class="col-12">
                    <GenericInputComponent
                      label="Observaciones"
                      type="textarea"
                      placeholder="Inserte"
                      required
                      disabled
                      :default_value="selectedRow.observation"
                      :rules="[(val: string) => useRules().is_required(val, 'La observación es requerida')]"
                      @update:modelValue="selectedRow.observation = $event"
                    />
                  </div>
                </section>
                <section class="q-pb-lg">
                  <slot name="submit-button"></slot>
                </section>
              </template>
            </VCard>
          </section>
        </q-form>
      </template>
    </VCard>
  </div>
</template>
<script setup lang="ts">
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Composables
import { useRules, useUtils } from '@/composables'

// logic view
import useAnnulateOperationDetailForm from '@/components/Forms/Fics/InvestmentPlanOperations/Annulate/AnnulateOperationForm'

defineExpose({
  validateForm: () => validateDetailData(),
  getFormData: () => getFormData(),
})

const {
  tableProps,
  totalValue,
  selectedRow,
  investment_plan_operation,
  getFormData,
  selectDetail,
  validateDetailData,
} = useAnnulateOperationDetailForm()
</script>
<style lang="scss" scoped>
:deep(.detail-table, .detail-table .q-tr .q-td) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
