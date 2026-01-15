<template>
  <q-form
    role="form"
    ref="basicDataFormRef"
    aria-label="Formulario de datos básicos"
  >
    <section aria-label="Sección de formulario de datos básicos">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericDateInputComponent
            :default_value="models.date"
            label="Fecha"
            mask="YYYY-MM-DD"
            placeholder="AAAA-MM-DD"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'La fecha es requerida'),
              (val: string) => useRules().valid_format_date(val, 'AAAA-MM-DD'),
            ]"
            disabled
          />
        </div>

        <div class="col-12 col-md-12">
          <div class="flex justify-between items-center">
            <p class="q-mb-none">Naturaleza*</p>
            <RadioYesNo
              :model-value="models.operation_nature"
              :hasTitle="false"
              :hasSubtitle="false"
              :options="natureOperation"
              @update:model-value="handleChangeNatureOperation"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'La naturaleza es requerida'),
              ]"
            />
          </div>
        </div>

        <div class="col-12 q-mb-md">
          <q-separator />
        </div>

        <div class="col-12">
          <div class="q-my-lg">
            <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
              Operaciones
              {{ action === 'create' ? 'por cumplir' : 'cumplidas' }}
            </p>
          </div>
          <VCard>
            <template #content-card>
              <div class="q-mx-md">
                <TableList
                  :loading="tableComplianceOperationsPortfolio.loading"
                  :rows="tableComplianceOperationsPortfolio.rows"
                  :columns="tableComplianceOperationsPortfolio.columns"
                  selection="multiple"
                  @selected="handleSelectedRows($event.selected)"
                  :dense="false"
                  hide-pagination
                >
                  <template #custom-no-data>
                    <div class="row justify-center mt-4">
                      <div>
                        <img
                          src="@/assets/images/icons/no_data.svg"
                          alt="Helion"
                        />
                      </div>
                    </div>

                    <p class="text-weight-bold text-h6 text-center">
                      {{
                        models.operation_nature
                          ? 'No hay operaciones disponibles para la naturaleza seleccionada'
                          : 'Seleccione una naturaleza para ver las operaciones por cumplir'
                      }}
                    </p>
                  </template>
                </TableList>
              </div>
            </template>
          </VCard>
        </div>

        <div class="col-12" v-if="models.instruction_slip_ids.length > 0">
          <div class="q-my-lg">
            <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
              Detalle de operaciones
              {{ action === 'create' ? 'por cumplir' : 'cumplidas' }} -
              {{ models.operation_nature }}
            </p>
          </div>
          <VCard>
            <template #content-card>
              <div class="q-mx-md">
                <TableList
                  :loading="tableDetailsComplianceOperationsPortfolio.loading"
                  :rows="tableDetailsComplianceOperationsPortfolio.rows"
                  :columns="tableDetailsComplianceOperationsPortfolio.columns"
                  :custom-columns="['actions']"
                  :dense="false"
                  hide-pagination
                >
                  <template #header-payment-or-collection-method>
                    <span v-html="paymentMethodLabel"></span>
                  </template>
                  <template #actions="{ row }">
                    <Button
                      v-if="row.instrucion_slip_id"
                      :left-icon="defaultIconsLucide.circleX"
                      color="orange"
                      :class-custom="'custom'"
                      :outline="false"
                      :flat="true"
                      colorIcon="#f45100"
                      :tooltip="'Anular operación'"
                      @click="handleCancelModal(row)"
                    />
                  </template>
                </TableList>
              </div>
            </template>
          </VCard>
        </div>
      </div>
    </section>
  </q-form>
  <AlertModalComponent
    ref="cancelModalRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="cancelModalConfig.description"
    :description_message="''"
    @confirm="handleCancelOperation()"
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
  </AlertModalComponent>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    action: ExtendedActionTypeCancel
  }>(),
  {}
)

import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import useBasicDataComplianceOperationsPortfolioForm from '@/components/Forms/InvestmentPortfolio/ComplianceOperationsPortfolio/BasicData/BasicData'
import TableList from '@/components/table-list/TableList.vue'
import { useRules } from '@/composables'
import { natureOperation } from '@/constants'
import { ExtendedActionTypeCancel } from '@/interfaces/global'

const {
  models,
  basicDataFormRef,
  paymentMethodLabel,
  tableComplianceOperationsPortfolio,
  tableDetailsComplianceOperationsPortfolio,
  defaultIconsLucide,
  cancelModalRef,
  cancelModalConfig,
  handleSelectedRows,
  handleChangeNatureOperation,
  handleCancelModal,
  handleCancelOperation,
} = useBasicDataComplianceOperationsPortfolioForm(props.action)

defineExpose({
  getValues: () => models.value,
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
