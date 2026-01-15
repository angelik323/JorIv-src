<template>
  <q-form ref="formValidateElementRef" class="hide-arrows-number-input">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            required
            auto_complete
            clearable
            map_options
            display_value="id"
            :label="'Banco'"
            :manual_option="banks"
            :placeholder="'Seleccione'"
            :rules="[
              (val) => useRules().is_required(val, 'El banco es requerido'),
            ]"
            :default_value="models.bank_id"
            @update:modelValue="models.bank_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Banco</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.bank_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Nombre del banco"
            placeholder="Nombre del banco"
            :default_value="models.bank_name"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre del banco</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.bank_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            required
            auto_complete
            clearable
            map_options
            :label="'Ciudad'"
            :manual_option="cities"
            :placeholder="'Seleccione'"
            :rules="[
              (val) => useRules().is_required(val, 'La ciudad es requerida'),
            ]"
            :default_value="models.city_id"
            @update:modelValue="models.city_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Ciudad</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.city_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            required
            auto_complete
            clearable
            map_options
            :label="'Sucursal'"
            :manual_option="branches"
            :placeholder="'Seleccione'"
            :rules="[
              (val) => useRules().is_required(val, 'La sucursal es requerida'),
            ]"
            :default_value="models.branch_id"
            @update:modelValue="models.branch_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Sucursal</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.branch_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(props.action)"
            required
            auto_complete
            clearable
            map_options
            :label="'Tipo de cuenta'"
            :manual_option="type_accounts"
            :placeholder="'Seleccione'"
            :rules="[
              (val) =>
                useRules().is_required(val, 'El tipo de cuenta es requerido'),
            ]"
            :default_value="models.account_type"
            @update:modelValue="models.account_type = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de cuenta</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.account_type ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(props.action)"
            label="Número de cuenta"
            placeholder="Ingrese número de cuenta"
            type="number"
            :max_length="'25'"
            :min_length="'1'"
            required
            :default_value="models.account_number"
            :rules="[
              (val) =>
                useRules().is_required(val, 'El número de cuenta es requerido'),
              (val) => useRules().only_positive_value(val),
            ]"
            @update:modelValue="models.account_number = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de cuenta</p>
            <p class="text-weight-medium no-margin">
              {{ viewModel.account_number ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
// Interfaces & types
import { ActionType } from '@/interfaces/global'
import { IResourceBankAccountForm } from '@/interfaces/customs/budget/ResourceBudget'
// Composables
import { useRules } from '@/composables'
// logic view
import useResourceBankAccountForm from '@/components/Forms/Budget/ResourceBudget/ResourceBankAccount/ResourceBankAccountForm'

const emit = defineEmits(['update:modelValue'])
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IResourceBankAccountForm
  }>(),
  { action: 'create' }
)

const {
  models,
  viewModel,
  banks,
  cities,
  branches,
  type_accounts,
  formValidateElementRef,
} = useResourceBankAccountForm(props, emit)

defineExpose({
  validateForm: () => formValidateElementRef.value?.validate(),
  getFormData: () => models.value,
})
</script>
