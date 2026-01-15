<template>
  <q-form ref="cashGeneretingUnitRef">
    <div class="row q-mt-sm q-mb-md q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <!-- Fecha -->
        <GenericDateInputComponent
          v-if="['create', 'edit'].includes(action)"
          label="Fecha de creación"
          :required="false"
          :rules="[]"
          disabled
          mask="YYYY-MM-DD HH:mm"
          :default_value="defaultDateValue"
        />
        <div v-else>
          <label class="text-weight-bold no-margin">Fecha de creación</label>
          <p class="text-weight-medium no-margin">
            {{ models.created_at ?? 'Sin fecha' }}
          </p>
        </div>
      </div>
      <div
        class="col-12 col-sm-6 col-md-3"
        v-if="['edit', 'view'].includes(action)"
      >
        <GenericInputComponent
          v-if="['edit'].includes(action)"
          label="Creado por"
          :required="true"
          auto_complete
          disabled
          :default_value="models.created_by"
          @update:model-value="models.created_by = $event"
        />
        <div v-else>
          <label class="text-weight-bold no-margin">Creado por</label>
          <p class="text-weight-medium no-margin">
            {{ models.created_by ?? 'Sin fecha' }}
          </p>
        </div>
      </div>
      <div
        class="col-12 col-sm-6 col-md-3"
        v-if="['edit', 'view'].includes(action)"
      >
        <GenericDateInputComponent
          v-if="['edit'].includes(action)"
          label="Fecha de actualizacion"
          :required="false"
          :rules="[]"
          disabled
          mask="YYYY-MM-DD HH:mm"
          :default_value="models.updated_at"
        />
        <div v-else>
          <label class="text-weight-bold no-margin"
            >Fecha de actualizacion</label
          >
          <p class="text-weight-medium no-margin">
            {{ models.updated_at ?? 'Sin fecha' }}
          </p>
        </div>
      </div>
      <div
        class="col-12 col-sm-6 col-md-3"
        v-if="['edit', 'view'].includes(action)"
      >
        <GenericInputComponent
          v-if="['edit'].includes(action)"
          label="Actualizado por"
          :required="true"
          auto_complete
          disabled
          :default_value="models.updated_by?.name"
          @update:model-value="models.updated_by = $event"
        />
        <div v-else>
          <label class="text-weight-bold no-margin">Actualizado por</label>
          <p class="text-weight-medium no-margin">
            {{ models.updated_by ?? 'Sin fecha' }}
          </p>
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <GenericSelectorComponent
          v-if="['create', 'edit'].includes(action)"
          label="Negocio"
          :required="true"
          :map_options="true"
          :manual_option="business_trusts"
          auto_complete
          :default_value="models.business_trust_id"
          @update:model-value="models.business_trust_id = $event"
          :disabled="isDisabled"
          :rules="[(v) => useRules().is_required(v, 'El campo es requerido')]"
        />
        <div v-else>
          <label class="text-weight-bold no-margin">Negocio</label>
          <p class="text-weight-medium no-margin">
            {{ models.business_trust ?? 'Sin información' }}
          </p>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-3" v-if="['edit'].includes(action)">
        <GenericInputComponent
          v-if="['edit'].includes(action)"
          label="Codigo UGE"
          :required="true"
          auto_complete
          :default_value="models.code"
          @update:model-value="models.code = $event"
          disabled
          :rules="[(v) => useRules().is_required(v, 'El campo es requerido')]"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <GenericInputComponent
          v-if="['create', 'edit'].includes(action)"
          label="Descripcion UGE"
          :required="true"
          auto_complete
          :default_value="models.description"
          @update:model-value="models.description = $event"
          :rules="[(v) => useRules().is_required(v, 'El campo es requerido')]"
        />
        <div v-else>
          <label class="text-weight-bold no-margin">Descripcion UGE</label>
          <p class="text-weight-medium no-margin">
            {{ models ?? 'Sin información' }}
          </p>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <GenericSelectorComponent
          v-if="['create', 'edit'].includes(action)"
          label="Tipo UGE"
          :required="true"
          :map_options="true"
          :manual_option="configuration_type"
          auto_complete
          :default_value="models.configuration_type_id"
          @update:model-value="models.configuration_type_id = $event"
          :rules="[(v) => useRules().is_required(v, 'El campo es requerido')]"
        />
        <div v-else>
          <label class="text-weight-bold no-margin">Tipo UGE</label>
          <p class="text-weight-medium no-margin">
            {{ models ?? 'Sin información' }}
          </p>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <GenericInputComponent
          v-if="['create', 'edit'].includes(action)"
          label="Descripcion tipo UGE"
          :required="true"
          auto_complete
          :default_value="models.description_type"
          @update:model-value="models.description_type = $event"
          :rules="[(v) => useRules().is_required(v, 'El campo es requerido')]"
        />
        <div v-else>
          <label class="text-weight-bold no-margin">Descripcion tipo UGE</label>
          <p class="text-weight-medium no-margin">
            {{ models ?? 'Sin información' }}
          </p>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <GenericDateInputComponent
          v-if="['create', 'edit'].includes(action)"
          label="Fecha de generacion de flujos"
          :required="false"
          :default_value="models.cash_flow_generation_date"
          @update:model-value="models.cash_flow_generation_date = $event"
          :disabled="isDisabled"
          :rules="[
              (val: string) => useRules().is_required(val, 'Fecha de generacion de flujos'),
              (val) => useRules().is_after_or_equal_today(val, 'La fecha de inicio debe ser igual o posterior a hoy')
            ]"
        />
        <div v-else>
          <label class="text-weight-bold no-margin"
            >Fecha de generacion de flujos</label
          >
          <p class="text-weight-medium no-margin">
            {{ models ?? 'Sin información' }}
          </p>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <CurrencyInput
          v-if="['create', 'edit'].includes(action)"
          v-model="models.initial_value"
          label="Valor Inicial UGE"
          :currency="'COP'"
          :placeholder="''"
          required
          :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El valor asegurado es requerido'),
                (val: string) => useRules().max_length(val, 15),
                (val: string) => useRules().min_length(val, 2),
              ]"
          @update:modelValue="models.initial_value = $event"
        />
        <div v-else>
          <label class="text-weight-bold no-margin">Valor incial UGE</label>
          <p class="text-weight-medium no-margin">
            {{ models ?? 'Sin información' }}
          </p>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <GenericSelectorComponent
          v-if="['create', 'edit'].includes(action)"
          label="Moneda UGE"
          :required="true"
          :map_options="true"
          :manual_option="business_currency"
          auto_complete
          :default_value="models.currency"
          @update:model-value="models.currency = $event"
          :disabled="isDisabled"
          :rules="[(v) => useRules().is_required(v, 'El campo es requerido')]"
        />
        <div v-else>
          <label class="text-weight-bold no-margin">Moneda UGE</label>
          <p class="text-weight-medium no-margin">
            {{ models ?? 'Sin información' }}
          </p>
        </div>
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

//  interfaces- constans

import { ActionType } from '@/interfaces/global'
import { ICashUnitForm } from '@/interfaces/customs/fixed-assets/CashGeneratingUnit'

// composables
import { useRules } from '@/composables'

// logic
import useCashUnitForm from '@/components/Forms/FixedAssets/CashGeneratingUnit/Informationform'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

const props = defineProps<{
  action: ActionType
  data?: ICashUnitForm | null
}>()

const emits = defineEmits<(e: 'update:data', value: ICashUnitForm) => void>()

const {
  models,
  business_trusts,

  configuration_type,
  business_currency,
  defaultDateValue,
  isDisabled,
  cashGeneretingUnitRef,
} = useCashUnitForm(props, emits)

defineExpose({
  validateForm: () => cashGeneretingUnitRef.value?.validate(),
})
</script>
