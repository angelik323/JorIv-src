<template>
  <TableFinancialPlanningList
    :loading="tableProps.loading"
    :columns="tableProps.columns"
    :rows="tableProps.rows"
    :pages="tableProps.pages"
    :custom-columns="['actions', 'statusQuota']"
    @update-page="updatePage"
  >
    <template #custom-header>
      <div
        class="row q-col-gutter-sm justify-between"
        style="width: 100%"
        justify="justify-space-between"
      >
        <div class="col-auto self-center">
          <p class="q-my-none text-weight-medium text-h5">
            {{ tableProps.title }}
          </p>
        </div>
        <div class="col-auto">
          <div class="row q-col-gutter-md">
            <div class="col-auto">
              <Button
                :outline="false"
                label="Agregar"
                size="md"
                unelevated
                color="orange"
                :disabled="!getObligationSelect || tableProps.rows.length === 0"
                @click="
                  openPaymentPlanModal(
                    getObligationSelect,
                    'financial-plan/add'
                  )
                "
              />
            </div>
            <div class="col-auto">
              <Button
                :outline="true"
                label="Descargar excel"
                :leftImg="excelIcon"
                :disabled="tableProps.rows.length === 0"
                tooltip="Descargar excel"
                @click="exportXLSX"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #statusQuota="{ row }">
      <ShowStatus
        :type="Number(row?.statusQuotaId ?? 20)"
        statusType="financial/obligations"
      />
    </template>

    <template #actions="{ row }">
      <Button
        :left-icon="defaultIconsLucide.edit"
        color="orange"
        :class-custom="'custom'"
        :outline="false"
        :flat="true"
        :disabled="false"
        colorIcon="#f45100"
        :tooltip="'Editar'"
        @click="
          openPaymentPlanModal(
            row.financialObligationId,
            'financial-plan/update',
            row
          )
        "
      />
    </template>
  </TableFinancialPlanningList>

  <InfoFinancialPlanModal
    ref="alertPaymentPlanRef"
    styleModal="min-width: 70%"
    :title="alertModalConfig.title"
    :description_message="alertModalConfig.description"
    :textBtnConfirm="alertModalConfig.btnLabel"
    :loader="alertModalConfig.loader"
    :show-btn-cancel="false"
    :show-btn-confirm="false"
  >
    <template #default-body>
      <div class="q-mx-xl">
        <q-form>
          <div class="row q-col-gutter-md">
            <div class="col-xs-6 col-sm-4 col-md-3">
              <GenericInput
                label="Número de cuota"
                :required="true"
                :disabled="true"
                type="number"
                :default_value="planningForm.numberQuota"
                :rules="[]"
                @update:model-value="planningForm.numberQuota = $event"
              />
            </div>

            <div class="col-xs-6 col-sm-4 col-md-3">
              <CurrencyInput
                v-model="planningForm.initialBalance"
                :currency="'COP'"
                :disabled="true"
                :placeholder="'Ingrese un valor'"
                currencyLabel="Saldo inicial*"
                :rules="[ 
              (v: string) => is_required(v), 
              (v: string) => max_length(v, 40)
               ]"
              />
            </div>

            <div class="col-xs-6 col-sm-4 col-md-3">
              <CurrencyInput
                v-model="planningForm.interestQuota"
                :currency="'COP'"
                :placeholder="'Ingrese un valor'"
                currencyLabel="Cuota Interés*"
                :rules="[ 
              (v: string) => is_required(v), 
              (v: string) => max_length(v, 40)
               ]"
              />
            </div>

            <div class="col-xs-6 col-sm-4 col-md-3">
              <CurrencyInput
                v-model="planningForm.capitalQuota"
                :currency="'COP'"
                :placeholder="'Ingrese un valor'"
                currencyLabel="Cuota capital*"
                :rules="[ 
              (v: string) => is_required(v), 
              (v: string) => max_length(v, 40)
               ]"
              />
            </div>

            <div class="col-xs-6 col-sm-4 col-md-3">
              <CurrencyInput
                v-model="planningForm.totalQuota"
                :currency="'COP'"
                :disabled="true"
                :placeholder="'Ingrese un valor'"
                currencyLabel="Valor total cuota*"
                :rules="[ 
              (v: string) => is_required(v), 
              (v: string) => max_length(v, 40)
               ]"
              />
            </div>

            <div class="col-xs-6 col-sm-4 col-md-3">
              <CurrencyInput
                v-model="planningForm.finalBalance"
                :currency="'COP'"
                :disabled="true"
                :placeholder="'Ingrese un valor'"
                currencyLabel="Saldo final*"
                :rules="[ 
              (v: string) => is_required(v), 
              (v: string) => max_length(v, 40)
               ]"
              />
            </div>

            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <GenericDate
                :label="'Fecha de pago*'"
                :default_value="planningForm.paymentDate"
                :mask="'YYYY-MM-DD'"
                :required="false"
                :placeholder="'Inserte una fecha'"
                :rules="[]"
                @update:modelValue="planningForm.paymentDate = $event"
              />
            </div>

            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <GenericSelector
                label="Estado"
                auto_complete
                first_filter_option="label"
                second_filter_option="value"
                :manual_option="obligation_status"
                :map_options="true"
                :required="true"
                :readonly="getDisableStatus"
                :default_value="planningForm.statusQuotaId"
                @update:modelValue="planningForm.statusQuotaId = $event"
                :rules="[ (v: string) => is_required(v)]"
              />
            </div>
          </div>
        </q-form>
      </div>
    </template>
    <template #custom-actions>
      <Button
        outline
        label="Cancelar"
        size="md"
        unelevated
        color="orange"
        class="text-capitalize btn-filter custom"
        @click="handlerCloseModal"
      />

      <Button
        v-if="alertModalConfig.type === 'financial-plan/add'"
        :outline="false"
        label="Agregar"
        size="md"
        unelevated
        color="orange"
        :disabled="false"
        @click="
          updateAddFinancialPlaningById(
            planningForm,
            currentAmortizationFilter ?? ''
          )
        "
      />

      <Button
        v-if="alertModalConfig.type === 'financial-plan/update'"
        :outline="false"
        label="Actualizar"
        size="md"
        unelevated
        color="orange"
        :disabled="false"
        @click="updateFinancialPlaningById(planningForm)"
      />
      <Button
        v-if="alertModalConfig.type === 'financial-plan/create'"
        :outline="false"
        label="Crear"
        size="md"
        unelevated
        color="orange"
        :disabled="false"
        @click="
          updateAddFinancialPlaningById(
            planningForm,
            currentAmortizationFilter ?? ''
          )
        "
      />
    </template>
  </InfoFinancialPlanModal>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import Button from '@/components/common/Button/Button.vue'
import TableFinancialPlanningList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import InfoFinancialPlanModal from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericDate from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import excelIcon from '@/assets/images/excel.svg'

import useFinancialPlanningForm from '@/components/Forms/FinancialObligations/AmortizationForms/FinancialPlanning/FinancialPlanningForm'
import { useRules } from '@/composables'

import {
  IAmortizationList,
  IFinancialPlanType,
} from '@/interfaces/customs/financial-obligations/AmortizationTables'

const props = defineProps({
  obligationSelected: {
    type: Number,
    required: false,
    default: undefined,
  },
  hasPlan: {
    type: Boolean,
    required: true,
    default: false,
  },
  businessCode: {
    type: Object as PropType<IAmortizationList>,
  },
  action: {
    type: String as PropType<IFinancialPlanType>,
    required: true,
    default: 'financial-plan/default',
  },
})

const { is_required, max_length } = useRules()

const {
  defaultIconsLucide,
  tableProps,
  planningForm,
  alertModalConfig,
  alertPaymentPlanRef,
  obligation_status,
  getDisableStatus,
  getObligationSelect,
  exportXLSX,
  handlerCloseModal,
  updateAddFinancialPlaningById,
  updateFinancialPlaningById,
  openPaymentPlanModal,
  updatePage,
  currentAmortizationFilter,
} = useFinancialPlanningForm(props)
</script>
