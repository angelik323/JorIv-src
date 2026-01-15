<template>
  <q-form ref="formElementRef" aria-label="Formulario de datos básicos">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
          Datos de moneda
        </p>
      </div>

      <div
        class="row"
        :class="
          action === 'view'
            ? 'q-col-gutter-lg'
            : 'q-col-gutter-x-lg q-col-gutter-y-sm'
        "
      >
        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.code"
            label="Código"
            required
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código es requerido'),
              (val: string) => useRules().max_length(val, 3)
            ]"
            @update:model-value="
              (val: string) => {
                models.code = val.replace(/[^a-zA-Z]/g, '').toUpperCase()
              }
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código</p>
            <p class="text-weight-medium no-margin">
              {{ models.code || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.description"
            label="Descripción"
            required
            :disabled="action === 'edit'"
            :rules="[
                (val: string) => useRules().is_required(val, 'La descripción es requerida'),
                (val: string) => useRules().max_length(val, 50)
              ]"
            @update:model-value="models.description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción</p>
            <p class="text-weight-medium no-margin">
              {{ models.description || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.currency_type"
            label="Tipo de moneda"
            auto_complete
            map_options
            :manual_option="type_of_coins"
            required
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de moneda es requerido'),
            ]"
            @update:model-value="models.currency_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de moneda</p>
            <p class="text-weight-medium no-margin">
              {{ models.currency_type || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.value"
            label="Valor"
            inputmode="decimal"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor es requerido'),
              (val: string) => useRules().max_integer_decimal(val, 7, 6),
              (val: string) => useRules().only_number_greater_than_zero_with_decimal(val),
            ]"
            @update:model-value="
              (val:string) => {
                models.value = sanitizeNumericInput(val) || null
              }
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor</p>
            <p class="text-weight-medium no-margin">
              {{ formatUnitsString(models.value) || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-separator :class="action === 'view' ? 'q-mt-lg' : 'q-mt-sm'" />
    </section>

    <section v-if="action === 'view'" class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black text-weight-bold text-h6 q-mb-none">
          Historial de moneda
        </p>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-3">
          <p class="text-weight-bold no-margin">Fecha de creación</p>
          <p class="text-weight-medium no-margin">
            {{ models.created_at || 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p class="text-weight-bold no-margin">Creado por</p>
          <p class="text-weight-medium no-margin">
            {{ models.created_by || 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p class="text-weight-bold no-margin">Modificación</p>
          <p class="text-weight-medium no-margin">
            {{ models.updated_at || 'No registrado' }}
          </p>
        </div>

        <div class="col-12 col-md-3">
          <p class="text-weight-bold no-margin">Modificado por</p>
          <p class="text-weight-medium no-margin">
            {{ models.updated_by || 'No registrado' }}
          </p>
        </div>
      </div>
      <q-separator class="q-mt-lg" />
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import { ActionType } from '@/interfaces/global'
import { ICurrencyInformationForm } from '@/interfaces/customs/investment-portfolio/Currency'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import useInformationForm from './CurrencyForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: ICurrencyInformationForm | null
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:data', value: ICurrencyInformationForm | null) => void
  >()

const {
  type_of_coins,
  formElementRef,
  models,
  sanitizeNumericInput,
  formatUnitsString,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
