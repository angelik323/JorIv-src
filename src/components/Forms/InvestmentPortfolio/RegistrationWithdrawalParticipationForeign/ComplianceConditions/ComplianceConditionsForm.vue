<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-lg">
        <div class="col-xs-12 col-sm-6 col-md-3">
          <CurrencyInput
            v-if="!isView"
            label="Valor moneda"
            :model-value="models.currency_value ?? null"
            :currency="'COP'"
            placeholder="-"
            :disabled="true"
            currencyLabel=""
            :rules="[
              (val) =>
                useRules().is_required(val, 'El valor de moneda es requerido'),
              (val) => useRules().max_length(val, 17),
              (val) => useRules().min_length(val, 1),
            ]"
            @update:model-value="(val) => (models.currency_value = val ?? null)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor moneda</p>
            <p class="text-weight-medium no-margin">
              {{ models.currency_value ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Factor de conversión"
            :default_value="models.conversion_factor ?? null"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'El factor de conversión es requerido'
                ),
            ]"
            @update:model-value="
              (val) => (models.conversion_factor = val ?? null)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Factor de conversión</p>
            <p class="text-weight-medium no-margin">
              {{ models.conversion_factor ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-3">
          <CurrencyInput
            v-if="!isView"
            label="Valor retiro moneda origen"
            :model-value="
              models.compliance?.withdrawal_value_origin_currency ?? null
            "
            :currency="'COP'"
            placeholder="0"
            :disabled="false"
            currencyLabel=""
            :rules="[
              (val) =>
                useRules().is_required(val, 'El valor de retiro es requerido'),
              (val) => useRules().max_length(val, 17),
              (val) => useRules().min_length(val, 1),
            ]"
            @update:model-value="(val) => {
              models.compliance!.withdrawal_value_origin_currency = val ?? null
            }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor retiro moneda origen</p>
            <p class="text-weight-medium no-margin">
              {{
                models.compliance?.withdrawal_value_origin_currency ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Cantidad unidades retiro"
            :default_value="models.withdrawal_units_count ?? null"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'La cantidad de unidades es requerida'
                ),
            ]"
            @update:model-value="
              (val) => (models.withdrawal_units_count = val ?? null)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Cantidad unidades retiro</p>
            <p class="text-weight-medium no-margin">
              {{ models.withdrawal_units_count ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.compliance?.compliance_date ?? null"
            :placeholder="''"
            :label="'Fecha de cumplimiento'"
            required
            :auto_complete="true"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'La fecha de cumplimiento es requerida'
                ),
            ]"
            @update:model-value="(val) => {
              models.compliance!.compliance_date = val ?? null
            }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de cumplimiento</p>
            <p class="text-weight-medium no-margin">
              {{ models.compliance?.compliance_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.compliance?.placement_resource_date ?? null"
            :placeholder="''"
            :label="'Fecha de colocación de recursos'"
            required
            :auto_complete="true"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'La fecha de colocación es requerida'
                ),
            ]"
            @update:model-value="(val) => {
              models.compliance!.placement_resource_date = val ?? null
            }"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Fecha de colocación de recursos
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.compliance?.placement_resource_date ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Valor cumplimiento moneda origen"
            :default_value="models.compliance_value_currency_origin ?? null"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'El valor de cumplimiento es requerido'
                ),
            ]"
            @update:model-value="
              (val) => (models.compliance_value_currency_origin = val ?? null)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Valor cumplimiento moneda origen
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.compliance_value_currency_origin ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Giro moneda cumplimiento local"
            :default_value="models.local_currency_compliance ?? null"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'El giro en moneda local es requerido'
                ),
            ]"
            @update:model-value="
              (val) => (models.local_currency_compliance = val ?? null)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Giro moneda cumplimiento local
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.local_currency_compliance ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import { useRules } from '@/composables'
import { IForeignCurrencyWithdrawalParticipationForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import useComplianceConditionsForm from './ComplianceConditionsForm'

const props = defineProps<{
  action: ActionType
  data?: IForeignCurrencyWithdrawalParticipationForm | null
}>()

const { models, formElementRef, isView, resetForm } =
  useComplianceConditionsForm(props)
defineExpose({
  resetForm,
  validateForm: () => formElementRef.value?.validate(),
})
</script>
