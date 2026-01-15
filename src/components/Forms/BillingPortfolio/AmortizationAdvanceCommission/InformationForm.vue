<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-2 mb-3">
        <div class="q-mb-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Información general
          </p>
        </div>

        <div class="row q-col-gutter-lg mt-1">
          <div
            class="col-12"
            :class="
              'create'.includes(props.action)
                ? 'col-xs-4 col-md-4'
                : 'col-xs-3 col-md-3'
            "
          >
            <GenericInput
              v-if="['create'].includes(action)"
              :default_value="models.invoice_number"
              :readonly="true"
              :required="true"
              :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().only_number_with_decimals(val),
              ]"
              label="Número de factura"
              @update:modelValue="models.invoice_number = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Número de factura</p>
              <p class="text-weight-medium no-margin">
                {{ models.invoice_number }}
              </p>
            </div>
          </div>

          <div
            v-if="
              tableProps.rows.length === 0 && ['create'].includes(props.action)
            "
            class="col-12"
            :class="
              'create'.includes(props.action)
                ? 'col-xs-4 col-md-4'
                : 'col-xs-3 col-md-3'
            "
          >
            <GenericDateInputComponent
              v-if="['create'].includes(action)"
              :default_value="models.amortization_start_date"
              :disabled="true"
              :required="true"
              :rules="[(val: string) => useRules().is_required(val)]"
              label="Fecha de amortización"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha de amortización</p>
              <p class="text-weight-medium no-margin">
                {{ models.amortization_start_date }}
              </p>
            </div>
          </div>

          <div
            class="col-12"
            :class="
              'create'.includes(props.action)
                ? 'col-xs-4 col-md-4'
                : 'col-xs-3 col-md-3'
            "
          >
            <GenericInput
              v-if="['create'].includes(action)"
              :default_value="models.balance_amortized"
              :readonly="true"
              :required="true"
              :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().only_number_with_decimals(val),
              ]"
              label="Saldo por amortizar"
              placeholder="Inserte"
              @update:modelValue="models.balance_amortized = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Saldo por amortizar</p>
              <p class="text-weight-medium no-margin">
                {{ models.balance_amortized }}
              </p>
            </div>
          </div>

          <div
            class="col-12"
            :class="
              'create'.includes(props.action)
                ? 'col-xs-4 col-md-4'
                : 'col-xs-3 col-md-3'
            "
          >
            <GenericInput
              v-if="['create'].includes(action)"
              :default_value="models.accumulated_amortization"
              :readonly="true"
              :required="true"
              :rules="[
                (val: string) => useRules().is_required(val),
                (val: string) => useRules().max_length(val, 15),
                (val: string) => useRules().only_number_with_decimals(val),
              ]"
              label="Amortización acumulada"
              @update:modelValue="models.accumulated_amortization = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Amortización acumulada</p>
              <p class="text-weight-medium no-margin">
                {{ models.accumulated_amortization }}
              </p>
            </div>
          </div>

          <div
            class="col-12"
            :class="
              'create'.includes(props.action)
                ? 'col-xs-4 col-md-4'
                : 'col-xs-3 col-md-3'
            "
            v-if="
              tableProps.rows.length === 0 || ['create'].includes(props.action)
            "
          >
            <CurrencyInput
              v-if="['create'].includes(action)"
              v-model="models.amortized_value"
              :currency="'COP'"
              :required="true"
              :rules="[
                (val: string) => useRules().is_required(val),
                (val: number) =>
                  useRules().max_value_field(
                    val,
                    Number(models.balance_amortized),
                    'Saldo por amortizar'
                  ),
              ]"
              label="Valor a amortizar"
            />
          </div>

          <div
            class="col-12"
            :class="
              'create'.includes(props.action)
                ? 'col-xs-4 col-md-4'
                : 'col-xs-3 col-md-3'
            "
          >
            <GenericInput
              v-if="['create'].includes(action)"
              :default_value="models.invoice_total"
              :disabled="true"
              :required="true"
              :rules="[(val: string) => useRules().is_required(val)]"
              label="Valor total de la factura"
              placeholder="Inserte"
              @update:modelValue="models.invoice_total = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Valor total de la factura
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.invoice_total }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-form>

  <div v-if="tableProps.rows.length !== 0" class="mx-3 mt-2 mb-3">
    <TableList
      :columns="tableProps.columns"
      :custom-columns="['actions', 'status_id']"
      :hide-bottom="true"
      :loading="tableProps.loading"
      :pages="tableProps.pages"
      :rows="tableProps.rows"
    >
      <template #status_id="{ row }">
        <div class="q-pa-md row items-center justify-center">
          <ShowStatus
            :type="Number(row?.status_id ?? 1)"
            status-type="billingPortfolio"
          />
        </div>
      </template>

      <template #actions="{ row }">
        <!-- Anular factura -->
        <Button
          v-if="['view'].includes(props.action)"
          :class-custom="'custom'"
          :flat="true"
          :left-icon="defaultIconsLucide.circleOff"
          :outline="false"
          :tooltip="'Anular'"
          color="orange"
          colorIcon="#f45100"
          :disabled="row.status_id === 4"
          @click="openAlertModal(row.id)"
        />
      </template>
    </TableList>
  </div>
  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 560px"
    title="¿Desea anular la amortización?"
    @confirm="cancelAmortization"
  >
    <template #default-body>
      <section>
        <div class="row q-col-gutter-sm q-mx-md q-mt-0">
          <GenericInput
            :default_value="modelsCancelAmortization.observation"
            :label="'Motivo de anulación'"
            :placeholder="'Ingrese el motivo de anulación'"
            :required="true"
            :rules="[
              (val: string) => useRules().is_required(val),
              (val: string) => useRules().max_length(val, 100),
            ]"
            type="textarea"
            @update:model-value="modelsCancelAmortization.observation = $event"
          />
        </div>
      </section>
    </template>
  </AlertModalComponent>
</template>

<script lang="ts" setup>
// components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useInformationForm from './InformationForm'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
// composables
import { useRules } from '@/composables'
// utils
import { defaultIconsLucide } from '@/utils'
// interfaces
import { IAmortizationAdvanceCommissionResponse } from '@/interfaces/customs'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'view'
    data?: IAmortizationAdvanceCommissionResponse
  }>(),
  {}
)

const emits = defineEmits(['validate:form', 'update'])

const {
  models,
  modelsCancelAmortization,
  formInformation,
  tableProps,
  alertModalRef,
  cancelAmortization,
  openAlertModal,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
