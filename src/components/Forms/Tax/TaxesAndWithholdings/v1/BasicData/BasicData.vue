<template>
  <q-form ref="formInformationRef">
    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <Input
            v-if="['create', 'edit'].includes(action)"
            label="Nombre del impuesto"
            required
            :rules="[
            (val: string) => rules.is_required(val),
            (val: string) => rules.only_alphanumeric(val),
            (val: string) => rules.min_length(val, 2),
            (val: string) => rules.max_length(val, 150),
          ]"
            :default_value="models.name"
            @update:model-value="models.name = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del impuesto</p>
            <p class="text-weight-medium no-margin">
              {{ models.name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Selector
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de impuesto"
            map_options
            :manual_option="tax_types"
            required
            :rules="[
              (val: string) => rules.is_required(val),
            ]"
            :default_value="models.tax_type_id"
            @update:model-value="update_tax_type"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de impuesto</p>
            <p class="text-weight-medium no-margin">
              {{
                tax_types.find((e) => e.value === models.tax_type_id)?.label ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Input
            v-if="['create', 'edit'].includes(action)"
            label="Signo"
            :rules="[]"
            :default_value="models.tax_sign"
            disabled
            placeholder="-"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Signo</p>
            <p class="text-weight-medium no-margin">
              {{ models.tax_sign ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Input
            v-if="['create', 'edit'].includes(action)"
            label="Alcance"
            :rules="[]"
            :default_value="models.tax_scope"
            disabled
            placeholder="-"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Alcance</p>
            <p class="text-weight-medium no-margin">
              {{ models.tax_scope ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Input
            v-if="['create', 'edit'].includes(action)"
            label="Uso"
            :rules="[]"
            :default_value="models.tax_usage"
            disabled
            placeholder="-"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Uso</p>
            <p class="text-weight-medium no-margin">
              {{ models.tax_usage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Selector
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de impuesto DIAN"
            map_options
            :manual_option="dian_tax_types"
            required
            :rules="[
              (val: string) => rules.is_required(val),
            ]"
            :default_value="models.dian_tax_type_id"
            @update:model-value="models.dian_tax_type_id = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de impuesto DIAN</p>
            <p class="text-weight-medium no-margin">
              {{
                dian_tax_types.find((e) => e.value === models.dian_tax_type_id)
                  ?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Selector
            v-if="['create', 'edit'].includes(action)"
            label="Ámbito"
            map_options
            :manual_option="tax_ambits"
            required
            :rules="[
              (val: string) => rules.is_required(val),
            ]"
            :default_value="models.ambit"
            @update:model-value="models.ambit = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Ámbito</p>
            <p class="text-weight-medium no-margin">
              {{ models.ambit ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Selector
            v-if="['create', 'edit'].includes(action)"
            label="Base gravable (DIAN)"
            map_options
            :manual_option="dian_tax_base"
            required
            :rules="[
              (val: string) => rules.is_required(val),
            ]"
            :default_value="models.dian_tax_base"
            @update:model-value="models.dian_tax_base = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Base gravable (DIAN)</p>
            <p class="text-weight-medium no-margin">
              {{ models.dian_tax_base ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Selector
            v-if="['create', 'edit'].includes(action)"
            label="Calculo de impuesto"
            map_options
            :manual_option="tax_calculations"
            required
            :rules="[
              (val: string) => rules.is_required(val),
            ]"
            :default_value="models.calculation"
            @update:model-value="models.calculation = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Calculo de impuesto</p>
            <p class="text-weight-medium no-margin">
              {{ models.calculation ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Input
            v-if="['create', 'edit'].includes(action)"
            label="Importe"
            :required="models.calculation !== 'valor_fijo'"
            :rules="models.calculation !== 'valor_fijo' ? [
              (val: string) => rules.is_required(val),
              (val: string) => rules.only_number_with_decimals(val, 2),
              (val: string) => rules.max_length(val, 15),
            ] : []"
            :default_value="models.rate_percentage"
            @update:model-value="models.rate_percentage = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Importe</p>
            <p class="text-weight-medium no-margin">
              {{ models.rate_percentage ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Input
            v-if="['create', 'edit'].includes(action)"
            label="Valor base"
            required
            :rules="[
              (val: string) => rules.is_required(val),
              (val: string) => rules.only_number_with_decimals(val, 2),
              (val: string) => rules.max_length(val, 15),
            ]"
            :default_value="models.base_value"
            @update:model-value="models.base_value = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor base</p>
            <p class="text-weight-medium no-margin">
              {{ models.base_value ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Selector
            v-if="['create', 'edit'].includes(action)"
            label="Redondeo"
            map_options
            :manual_option="tax_rounding_modes"
            required
            :rules="[
              (val: string) => rules.is_required(val),
            ]"
            :default_value="models.rounding_step"
            @update:model-value="models.rounding_step = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Redondeo</p>
            <p class="text-weight-medium no-margin">
              {{
                tax_rounding_modes.find((e) => e.value === models.rounding_step)
                  ?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Selector
            v-if="['create', 'edit'].includes(action)"
            label="Jurisdicción"
            map_options
            :manual_option="jurisdictions"
            required
            :rules="[
              (val: string) => rules.is_required(val),
            ]"
            :default_value="models.jurisdiction_id"
            @update:model-value="models.jurisdiction_id = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Jurisdicción</p>
            <p class="text-weight-medium no-margin">
              {{
                jurisdictions.find((e) => e.value === models.jurisdiction_id)
                  ?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Radio
            v-if="['create', 'edit'].includes(action)"
            title="Maneja vigencias*"
            has-title
            is-radio-button
            v-model="models.manage_periods"
            @update:model-value="models.manage_periods = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Maneja vigencias</p>
            <p class="text-weight-medium no-margin">
              {{ models.manage_periods ? 'Si' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Date
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.valid_from"
            label="Válido desde"
            required
            :rules="[(val) => rules.is_required(val)]"
            @update:model-value="(val) => (models.valid_from = val)"
            :disabled="!models.manage_periods"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Válido desde</p>
            <p class="text-weight-medium no-margin">
              {{ models.valid_from ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Date
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.valid_to"
            label="Válido hasta"
            required
            :rules="[(val) => rules.is_required(val)]"
            @update:model-value="(val) => (models.valid_to = val)"
            :disabled="!models.manage_periods"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Válido hasta</p>
            <p class="text-weight-medium no-margin">
              {{ models.valid_to ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <Selector
            v-if="['create', 'edit'].includes(action)"
            label="Moneda"
            map_options
            :manual_option="coins"
            :required="false"
            :rules="[]"
            :default_value="models.currency_code"
            @update:model-value="update_currency"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Moneda</p>
            <p class="text-weight-medium no-margin">
              {{ models.currency_code ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-mt-md">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <Input
            v-if="['create', 'edit'].includes(action)"
            type="textarea"
            label="Observaciones"
            :required="false"
            :rules="models.observations ? [
              (val: string) => rules.max_length(val, 250), 
              (val: string) => rules.only_alphanumeric(val)
            ] : []"
            :default_value="models.observations"
            @update:model-value="models.observations = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Observaciones</p>
            <p class="text-weight-medium no-margin">
              {{ models.observations ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import Selector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Input from '@/components/common/GenericInput/GenericInputComponent.vue'
import Date from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import Radio from '@/components/common/RadioYesNo/RadioYesNo.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { ITaxesAndWithholdingsForm } from '@/interfaces/customs/tax/TaxesAndWithholdings'

// Logic
import useInformationForm from '@/components/Forms/Tax/TaxesAndWithholdings/v1/BasicData/BasicData'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: ITaxesAndWithholdingsForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ITaxesAndWithholdingsForm | null): void
}>()

const {
  formInformationRef,
  models,
  rules,
  dian_tax_types,
  jurisdictions,
  tax_types,
  coins,
  dian_tax_base,
  tax_ambits,
  tax_calculations,
  tax_rounding_modes,
  update_tax_type,
  update_currency,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formInformationRef.value?.validate(),
})
</script>
