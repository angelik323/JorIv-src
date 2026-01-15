<template>
  <q-form
    ref="formElementRef"
    aria-label="Formulario de datos básicos para plan de pagos"
  >
    <section>
      <div
        class="row"
        :class="
          ['create', 'edit'].includes(action)
            ? 'q-col-gutter-x-lg q-col-gutter-y-sm'
            : 'q-col-gutter-lg'
        "
      >
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.business_trust"
            label="Nombre del negocio"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="business_trusts"
            :rules="[
              (val: string) => useRules().is_required(val, 'El nombre del negocio es requerido'),
            ]"
            :disabled="['edit'].includes(action)"
            @update:modelValue="models.business_trust = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_trust ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.project"
            label="Nombre del proyecto"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="availableProjects"
            :rules="[
              (val: string) => useRules().is_required(val, 'El nombre del proyecto es requerido'),
            ]"
            :disabled="['edit'].includes(action)"
            @update:modelValue="models.project = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del proyecto</p>
            <p class="text-weight-medium no-margin">
              {{ models.project ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.project_stage"
            label="Etapa"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="availableStages"
            :rules="[
              (val: string) => useRules().is_required(val, 'La etapa es requerida'),
            ]"
            :disabled="['edit'].includes(action)"
            @update:modelValue="models.project_stage = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Etapa</p>
            <p class="text-weight-medium no-margin">
              {{ models.project_stage ?? '' }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['create', 'edit'].includes(action) ? 'col-md-6' : 'col-md-4'"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.property"
            label="Apartamento / Casa"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="availableProperties"
            :rules="[
              (val: string) => useRules().is_required(val, 'El apartamento / casa es requerido'),
            ]"
            :disabled="['edit'].includes(action)"
            @update:modelValue="models.property = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Apartamento / Casa</p>
            <p class="text-weight-medium no-margin">
              {{ models.property ?? '' }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['create', 'edit'].includes(action) ? 'col-md-6' : 'col-md-8'"
        >
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.buyers"
            label="Comprador(es)"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90" style="max-width: 400px">
            <p class="text-weight-bold no-margin">Comprador(es)</p>
            <p class="text-weight-medium no-margin">
              {{ models.buyers ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.trust_mandate"
            label="Encargo fiduciario"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Encargo fiduciario</p>
            <p class="text-weight-medium no-margin">
              {{ models.trust_mandate ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.unit_value"
            label="Valor de la unidad"
            placeholder="Inserte"
            currency="COP"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor de la unidad es requerido'),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor de la unidad</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.unit_value) ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.value_finish"
            label="Valor de los acabados"
            placeholder="Inserte"
            currency="COP"
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor de los acabados</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.value_finish) ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.initial_fee_value"
            label="Valor cuota inicial"
            placeholder="Inserte"
            currency="COP"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor cuota inicial es requerido'),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor cuota inicial</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.initial_fee_value) ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.subsidy_fee_value"
            label="Valor del subsidio"
            placeholder="Inserte"
            currency="COP"
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor del subsidio</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.subsidy_fee_value) ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.value_other_concepts"
            label="Valor otros conceptos"
            placeholder="Inserte"
            currency="COP"
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor otros conceptos</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.value_other_concepts) ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.fixed_value_initial_fee"
            label="Valor fijo cuota inicial"
            placeholder="Inserte"
            currency="COP"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor fijo cuota inicial es requerido'),
            ]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor fijo cuota inicial</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.fixed_value_initial_fee) ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.separation_value"
            label="Valor de separación"
            placeholder="Inserte"
            currency="COP"
            :rules="[]"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor de separación</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.separation_value) ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.financial_obligations"
            label="Número de obligación financiera"
            placeholder="Seleccione"
            auto_complete
            map_options
            required
            :manual_option="financial_obligations"
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => useRules().is_required(val, 'El número de obligación financiera es requerido'),
            ]"
            @update:modelValue="models.financial_obligations = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Número de obligación financiera
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.financial_obligations_name ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            :model-value="models.credit_value"
            label="Valor del crédito"
            placeholder="-"
            currency="COP"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor del crédito</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.credit_value) ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.term"
            label="Plazo"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Plazo</p>
            <p class="text-weight-medium no-margin">
              {{ models.term ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.periodicity"
            label="Periodicidad"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Periodicidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.periodicity ?? '' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.effective_annual_rate"
            label="Tasa efectiva anual (%)"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tasa efectiva anual (%)</p>
            <p class="text-weight-medium no-margin">
              {{ models.effective_annual_rate ?? '' }}
            </p>
          </div>
        </div>

        <div
          class="col-12 col-md-8 place-content--center"
          v-if="['create', 'edit'].includes(action)"
        >
          <Button
            label="Crear plan de pagos"
            no-caps
            :outline="false"
            :disabled="
              action === 'edit' || paymentPlanModalConfig.externalBtnDisabled
            "
            @click="validatePaymentPlanForm"
          />
        </div>
      </div>
    </section>

    <!-- Subida de documentos -->
    <section class="q-mt-xl">
      <DocumentsForm
        ref="documentsFormRef"
        :action
        :data="['edit', 'view'].includes(action) ? dataResponse : undefined"
      />
    </section>

    <!-- Tabla de planes de pago -->
    <section
      v-if="isPaymentPlansTableEnabled || ['edit', 'view'].includes(action)"
      ref="paymentPlansSectionRef"
      class="q-mt-xl"
    >
      <TableList
        :loading="tablePaymentPlanProperties.loading"
        :columns="tablePaymentPlanProperties.columns"
        :rows="tablePaymentPlanProperties.rows"
        :custom-columns="['status', 'actions']"
        hide-pagination
        dense
      >
        <template #custom-header>
          <div
            class="row justify-between items-end q-col-gutter-x-md q-col-gutter-y-sm"
            style="width: 100%"
          >
            <div class="col-auto">
              <p class="q-table__title no-margin">
                {{ tablePaymentPlanProperties.title }}
              </p>
            </div>

            <div class="col-auto flex q-gutter-x-md q-gutter-y-sm">
              <Button
                v-if="['create', 'edit'].includes(action)"
                ref="addPlanButtonRef"
                label="Agregar"
                :outline="false"
                :left-icon="defaultIconsLucide.plusCircleOutline"
                color-icon="white"
                @click="handlePaymentPlanTableOptions('create')"
              />

              <Button
                v-if="['edit', 'view'].includes(action)"
                class-custom="custom"
                label="Descargar excel"
                color="orange"
                outline
                :styleContent="{
                  'place-items': 'center',
                  color: 'black',
                }"
                :left-img="imgButtonHeaderTable"
                @click="downloadExcel"
              />
            </div>
          </div>
        </template>

        <template #status="{ row }">
          <ShowStatus :type="Number(row?.status)" status-type="trustBusiness" />
        </template>

        <template
          v-if="['create', 'edit'].includes(action)"
          #actions="{ row, index }"
        >
          <!-- Disponibles solo para ultimo elemento de la tabla -->
          <template v-if="index === (models.payments_plan ?? []).length - 1">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handlePaymentPlanTableOptions('edit', row)"
            />

            <Button
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openModalDelete(row)"
            />
          </template>
        </template>

        <template #custom-no-data>
          <div
            class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
          >
            <img
              src="@/assets/images/icons/no_data_2.svg"
              alt="No hay datos para mostrar"
              width="180px"
            />
            <p class="text-weight-bold text-h5 text-center">
              No hay datos para mostrar
            </p>
          </div>
        </template>
      </TableList>
    </section>
  </q-form>

  <q-dialog
    ref="paymentPlanModalRef"
    v-model="isPaymentPlanModalOpen"
    persistent
  >
    <q-card
      class="relative v-card-rounded q-px-xl q-py-lg generator-card"
      flat
      bordered
    >
      <Button
        class-custom="custom absolute-top-right q-ma-md z-top q-pa-sm"
        color="black"
        flat
        :outline="false"
        :left-icon="defaultIconsLucide.close"
        colorIcon="black"
        aria-label="Cerrar modal"
        @click="isPaymentPlanModalOpen = false"
      />

      <div class="q-mt-xs q-mb-md">
        <span class="text-h6 text-black-90 text-weight-bold">
          {{ paymentPlanModalConfig.title }}
        </span>
      </div>

      <q-form
        ref="paymentPlanFormRef"
        aria-label="Formulario para plan de pago"
      >
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pt-sm">
          <div class="col-12 col-md-3">
            <GenericInputComponent
              :default_value="paymentModels.installment_number"
              label="Número de cuota"
              placeholder="-"
              type="text"
              disabled
            />
          </div>

          <div class="col-12 col-md-3">
            <CurrencyInput
              :model-value="paymentModels.initial_balance"
              label="Saldo inicial"
              placeholder="-"
              currency="COP"
              disabled
            />
          </div>

          <div class="col-12 col-md-3">
            <CurrencyInput
              v-model="paymentModels.late_interest"
              label="Interés por mora"
              placeholder="Inserte"
              currency="COP"
              required
              :rules="[
              (val: string) => useRules().is_required(val, 'El interés por mora es requerido'),
            ]"
            />
          </div>

          <div class="col-12 col-md-3">
            <CurrencyInput
              v-model="paymentModels.capital_fee"
              label="Cuota capital"
              placeholder="Inserte"
              currency="COP"
              required
              :rules="[
              (val: string) => useRules().is_required(val, 'La cuota capital es requerida'),
            ]"
            />
          </div>

          <div class="col-12 col-md-3">
            <CurrencyInput
              :model-value="paymentModels.total_value"
              label="Valor total cuota"
              placeholder="-"
              currency="COP"
              disabled
            />
          </div>

          <div class="col-12 col-md-3">
            <CurrencyInput
              :model-value="paymentModels.final_balance"
              label="Saldo final"
              placeholder="-"
              currency="COP"
              disabled
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericDateInputComponent
              :default_value="paymentModels.payment_date"
              label="Fecha de pago"
              placeholder="AAAA/MM/DD"
              mask="YYYY-MM-DD"
              required
              :rules="[
              (val: string) => useRules().is_required(val, 'La fecha de pago es requerida')
            ]"
              @update:modelValue="paymentModels.payment_date = $event"
            />
          </div>

          <div class="col-12 col-md-3">
            <GenericSelectorComponent
              :default_value="paymentModels.status"
              label="Estado"
              placeholder="Seleccione"
              map_options
              :manual_option="payment_plan_statuses"
              required
              :disabled="
                action !== 'edit' || paymentPlanModalConfig.action !== 'edit'
              "
              :rules="[ 
                (val: string) => useRules().is_required(val, 'El estado es requerido')
              ]"
              @update:modelValue="paymentModels.status = $event"
            />
          </div>
        </div>

        <q-separator class="q-mb-lg" color="grey-2" />

        <div class="row justify-center q-gutter-md q-mb-xs">
          <Button
            class="custom"
            label="Cancelar"
            color="orange"
            size="md"
            no-caps
            unelevated
            outline
            :styleContent="{
              color: 'black',
            }"
            @click="isPaymentPlanModalOpen = false"
          />

          <Button
            class="custom"
            :label="paymentPlanModalConfig.btnText"
            color="orange"
            size="md"
            no-caps
            unelevated
            :outline="false"
            @click="onSavePaymentPlan"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>

  <AlertModalComponent
    ref="deleteModalRef"
    styleModal="min-width: 470px"
    :title="alertModalConfig.description"
    :showImgDefault="false"
    @confirm="handleDeletePaymentInstallment"
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
import { ActionType } from '@/interfaces/global'
import {
  IPaymentPlanBasicDataForm,
  IPaymentPlanResponse,
} from '@/interfaces/customs'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import DocumentsForm from '@/components/Forms/TrustBusiness/PaymentPlan/Documents/DocumentsForm.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import { useRules } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import useBasicDataPaymentPlanForm from '@/components/Forms/TrustBusiness/PaymentPlan/BasicDataPaymentPlan/BasicDataPaymentPlan'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IPaymentPlanBasicDataForm | null
    dataResponse?: IPaymentPlanResponse | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IPaymentPlanBasicDataForm | null): void
}>()

const {
  business_trusts,
  payment_plan_statuses,
  financial_obligations,
  availableProjects,
  availableStages,
  availableProperties,
  formElementRef,
  paymentPlanFormRef,
  paymentPlansSectionRef,
  addPlanButtonRef,
  models,
  paymentModels,
  isPaymentPlansTableEnabled,
  isPaymentPlanModalOpen,
  tablePaymentPlanProperties,
  paymentPlanModalRef,
  paymentPlanModalConfig,
  deleteModalRef,
  alertModalConfig,
  formatCurrencyString,
  downloadExcel,
  validatePaymentPlanForm,
  handlePaymentPlanTableOptions,
  onSavePaymentPlan,
  openModalDelete,
  handleDeletePaymentInstallment,
} = useBasicDataPaymentPlanForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>

<style scoped lang="scss">
.generator-card {
  width: 1040px;
  max-width: 90vw;
  border-radius: 15px !important;
}
</style>
