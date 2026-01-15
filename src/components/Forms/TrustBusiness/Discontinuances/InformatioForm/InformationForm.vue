<template>
  <q-form ref="formInformation">
    <div class="q-mb-lg mt-2">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
        Información general
      </p>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-xs-3 col-md-3" v-if="props.action !== 'create'">
        <GenericInputComponent
          v-if="props.action === 'edit'"
          :default_value="models.id"
          label="Id del desistimiento"
          :type="'text'"
          placeholder=""
          disabled
        />

        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Id del desistimiento</p>
          <p class="text-weight-medium no-margin">{{ models.id }}</p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericSelectorComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.business_trust_id"
          :label="'Nombre del negocio'"
          map_options
          :manual_option="business_trusts"
          :required="true"
          :rules="[
              (v:string) => useRules().is_required(v, 'El negocio es requerido')
            ]"
          :readonly="!isCreate"
          @update:modelValue="models.business_trust_id = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Nombre del negocio</p>
          <p class="text-weight-medium no-margin">
            {{ models.business_trust_name }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericSelectorComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.real_estate_project_id"
          :label="'Proyecto inmobiliario'"
          map_options
          :manual_option="business_trust_real_estate_project"
          :readonly="!models.business_trust_id || !isCreate"
          :required="true"
          :rules="[
              (v:string) => useRules().is_required(v, 'El proyecto inmobiliario es requerido')
            ]"
          @update:modelValue="models.real_estate_project_id = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Proyecto inmobiliario</p>
          <p class="text-weight-medium no-margin">
            {{ models.real_estate_project_name }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericSelectorComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.project_stage_id"
          :label="'Etapa'"
          map_options
          :manual_option="project_stage"
          :readonly="!models.real_estate_project_id || !isCreate"
          :rules="[(v:string) =>useRules().is_required(v, 'El número de etapa es requerido')]"
          required
          @update:modelValue="models.project_stage_id = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Etapa</p>
          <p class="text-weight-medium no-margin">
            {{ models.project_stage_name }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericSelectorComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.business_trust_property_id"
          :label="'Apartamento / Casa'"
          map_options
          :manual_option="business_trust_properties"
          :readonly="!models.project_stage_id || !isCreate"
          :rules="[(v:string) =>useRules().is_required(v, 'El apartamento / casa es requerida')]"
          required
          @update:modelValue="models.business_trust_property_id = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Apartamento / Casa</p>
          <p class="text-weight-medium no-margin">
            {{ models.business_trust_property_name }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericDateInputComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.date_register"
          label="Fecha de registro"
          :rules="[]"
          disabled
          @update:modelValue="models.date_register = $event"
        />

        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Fecha de registro</p>
          <p class="text-weight-medium no-margin">
            {{ models.date_register }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericDateInputComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.date_vinculation"
          label="Fecha de vinculación"
          :rules="[]"
          disabled
          @update:modelValue="models.date_vinculation = $event"
        />

        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Fecha de vinculación</p>
          <p class="text-weight-medium no-margin">
            {{ models.date_vinculation }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <CurrencyInput
          v-if="!isViewOrAuthorize"
          v-model="models.property_value!"
          label="Valor del inmueble"
          :currency="'COP'"
          :placeholder="''"
          :rules="[
            (val: string) => useRules().max_length(val, 40),
            (val: string) => useRules().min_length(val, 1),
          ]"
          disabled
          @update:modelValue="models.property_value = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Valor del inmueble</p>
          <p class="text-weight-medium no-margin">
            {{ formatCurrency(`${models.property_value}`) }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <CurrencyInput
          v-if="!isViewOrAuthorize"
          v-model="models.total_paid!"
          label="Total abonado"
          :currency="'COP'"
          :placeholder="''"
          :rules="[
            (val: string) => useRules().max_length(val, 40),
            (val: string) => useRules().min_length(val, 1),
          ]"
          disabled
          @update:modelValue="models.total_paid = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Total abonado</p>
          <p class="text-weight-medium no-margin">
            {{ formatCurrency(`${models.total_paid}`) }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <CurrencyInput
          v-if="!isViewOrAuthorize"
          v-model="models.balance_due!"
          label="Saldo por pagar"
          :currency="'COP'"
          :placeholder="''"
          :rules="[
            (val: string) => useRules().max_length(val, 40),
            (val: string) => useRules().min_length(val, 1),
          ]"
          disabled
          @update:modelValue="models.balance_due = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Saldo por pagar</p>
          <p class="text-weight-medium no-margin">
            {{ formatCurrency(`${models.balance_due}`) }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericInputComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.order_number"
          label="Número de encargo"
          :type="'text'"
          placeholder=""
          disabled
        />

        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Número de encargo</p>
          <p class="text-weight-medium no-margin">{{ models.order_number }}</p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3" v-if="props.action !== 'create'">
        <div class="text-black-90">
          <p class="text-weight-bold no-margin">Estado</p>
          <ShowStatus :type="Number(models.status_id)" />
        </div>
      </div>
    </div>

    <section class="q-mt-xl">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="[
          'status_id',
          'initial_balance',
          'total_balance',
          'interest',
          'quota_capital',
          'final_balance',
        ]"
        :hideBottom="true"
        :class="'q-pt-lg amounts-table'"
      >
        <template #status_id="{ row }">
          <ShowStatus :type="Number(row.status_id)" />
        </template>

        <template #initial_balance="{ row }">
          {{ formatCurrency(`${row.initial_balance}`) }}
        </template>

        <template #total_balance="{ row }">
          {{ formatCurrency(`${row.total_value}`) }}
        </template>

        <template #interest="{ row }">
          {{ formatCurrency(`${row.late_interest}`) }}
        </template>

        <template #quota_capital="{ row }">
          {{ formatCurrency(`${row.capital_fee}`) }}
        </template>

        <template #final_balance="{ row }">
          {{ formatCurrency(`${row.final_balance}`) }}
        </template>
      </TableList>
    </section>

    <section class="q-mt-xl">
      <TableList
        :title="tablePropsPrincipal.title"
        :loading="tablePropsPrincipal.loading"
        :columns="tablePropsPrincipal.columns"
        :rows="tablePropsPrincipal.rows"
        :pages="tablePropsPrincipal.pages"
        :hideBottom="true"
        :class="'q-pt-lg amounts-table'"
      >
      </TableList>
    </section>

    <div class="q-mb-lg mt-2">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
        Orden de giro
      </p>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-xs-3 col-md-3">
        <CurrencyInput
          v-if="!isViewOrAuthorize"
          v-model="models.total_paid!"
          label="Valor total pagado"
          :currency="'COP'"
          :placeholder="''"
          :rules="[
            (val: string) => useRules().max_length(val, 40),
            (val: string) => useRules().min_length(val, 1),
          ]"
          disabled
          @update:modelValue="models.total_paid = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Valor total pagado</p>
          <p class="text-weight-medium no-margin">
            {{ formatCurrency(`${models.total_paid}`) }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <CurrencyInput
          v-if="!isViewOrAuthorize"
          v-model="models.total_paid!"
          label="Valor a devolver"
          :currency="'COP'"
          :placeholder="''"
          :rules="[
            (val: string) => useRules().max_length(val, 40),
            (val: string) => useRules().min_length(val, 1),
          ]"
          disabled
          @update:modelValue="models.total_paid = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Valor a devolver</p>
          <p class="text-weight-medium no-margin">
            {{ formatCurrency(`${models.total_paid}`) }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <CurrencyInput
          v-if="!isViewOrAuthorize"
          v-model="models.retention_amount"
          label="Valor de retención"
          :currency="'COP'"
          :placeholder="''"
          :rules="[
            (val: string) => useRules().max_length(val, 40),
            (val: string) => useRules().min_length(val, 1),
          ]"
          :required="false"
          @update:modelValue="models.retention_amount = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Valor de retención</p>
          <p class="text-weight-medium no-margin">
            {{ formatCurrency(`${models.retention_amount}`) }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <CurrencyInput
          v-if="!isViewOrAuthorize"
          v-model="models.penalty_amount"
          label="Valor de penalidades"
          :currency="'COP'"
          :placeholder="''"
          :rules="[
            (val: string) => useRules().max_length(val, 40),
            (val: string) => useRules().min_length(val, 1),
          ]"
          :required="false"
          @update:modelValue="models.penalty_amount = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Valor de penalidades</p>
          <p class="text-weight-medium no-margin">
            {{ formatCurrency(`${models.penalty_amount}`) }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <CurrencyInput
          v-if="!isViewOrAuthorize"
          v-model="models.net_refund_amount"
          label="Valor neto a devolver"
          :currency="'COP'"
          :placeholder="''"
          :rules="[
            (val: string) => useRules().max_length(val, 40),
            (val: string) => useRules().min_length(val, 1),
          ]"
          disabled
          @update:modelValue="models.net_refund_amount = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Valor neto a devolver</p>
          <p class="text-weight-medium no-margin">
            {{ formatCurrency(`${models.net_refund_amount}`) }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericSelectorComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.refund_method_id"
          :label="'Forma de pago'"
          map_options
          :manual_option="means_of_payment"
          :required="true"
          :rules="[
              (v:string) => useRules().is_required(v, 'La forma de pago es requerida')
            ]"
          @update:modelValue="models.refund_method_id = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Forma de pago</p>
          <p class="text-weight-medium no-margin">
            {{ models.refund_method_name }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3" v-if="isBankTransaction">
        <GenericSelectorComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.bank_id"
          :label="'Banco'"
          map_options
          :manual_option="banks"
          :required="isBankTransaction"
          :rules="isBankTransaction ? [
              (v:string) => useRules().is_required(v, 'El banco es requerido')
            ] : []"
          @update:modelValue="models.bank_id = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Banco</p>
          <p class="text-weight-medium no-margin">
            {{ models.bank_name }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3" v-if="isBankTransaction">
        <GenericInputComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.bank_account_number"
          label="Cuenta bancaría"
          :type="'text'"
          placeholder=""
          :required="isBankTransaction"
          :rules="isBankTransaction ? [
                (v:string) => useRules().is_required(v, 'La cuenta bancaria es requerida'),
                (v: string) => useRules().only_alphanumeric(v), 
                (v: string) => useRules().max_length(v, 20)
            ] : []"
          @update:modelValue="models.bank_account_number = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Cuenta bancaría</p>
          <p class="text-weight-medium no-margin">
            {{ models.bank_account_number_name }}
          </p>
        </div>
      </div>
    </div>

    <div class="q-mb-lg mt-2">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
        Soporte documental
      </p>
    </div>

    <section class="q-pl-md q-mt-lg">
      <UploadDocument
        v-for="element in dataUpload"
        :key="element.position"
        :file="element.file"
        @update:file="element.file = $event"
        @changeFile="(file: File | null) => handleFileChange(file, element.title)"
        :class="element.class"
        :title="element.title"
        :subtitle="element.subtitle"
        :required="element.required"
        displayMode="file"
        :view-close-file="['create', 'edit'].includes(action)"
      />
    </section>
  </q-form>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType | 'authorize'
    data?: IDiscontinuances
  }>(),
  {}
)

// Emits
const emits = defineEmits(['update:models'])

import { IDiscontinuances } from '@/interfaces/customs'

// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import UploadDocument from '@/components/common/UploadDocument/UploadDocument.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Composables
import { useRules, useUtils } from '@/composables'
const formatCurrency = useUtils().formatCurrency

// Types
import { ActionType } from '@/interfaces/global'

// Logic
import useInformationForm from './InformationForm'

const {
  models,
  formInformation,
  business_trust_real_estate_project,
  project_stage,
  dataUpload,
  business_trusts,
  business_trust_properties,
  tableProps,
  tablePropsPrincipal,
  banks,
  isViewOrAuthorize,
  means_of_payment,
  isBankTransaction,
  isCreate,

  handleFileChange,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: async () =>
    (await formInformation.value?.validate()) &&
    dataUpload.value.every((doc) => doc.file || !doc.required),
})
</script>

<style lang="scss" scoped>
:deep(.amounts-table) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
