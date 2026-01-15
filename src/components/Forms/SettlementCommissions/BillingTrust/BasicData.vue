<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <div v-if="['view'].includes(action)" class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información general
        </p>
      </div>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Código negocio fiduciario"
            :default_value="models.business_code"
            required
            type="number"
            :rules="[
              (val: string) =>
                is_required(val),
              () => isValidBusiness || 'El código negocio no es válido'

            ]"
            @update:modelValue="handleBusinessCode($event)"
            :disabled="['edit'].includes(action)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código negocio fiduciario</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Nombre negocio fiduciario"
            :default_value="models.business_name"
            :rules="[]"
            disabled
            @update:model-value="models.business_name = $event"
            :placeholder="isLoadingBusiness ? 'Cargando...' : ''"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre negocio fiduciario</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha inicial"
            :default_value="models.start_date"
            required
            :rules="[
              (val: string) => is_required(val),
            ]"
            @update:modelValue="models.start_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha inicial</p>
            <p class="text-weight-medium no-margin">
              {{ models.start_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Fecha final"
            :default_value="models.end_date"
            :required="true"
            :rules="[
                (val: string) => is_required(val),
              ]"
            @update:modelValue="models.end_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha final</p>
            <p class="text-weight-medium no-margin">
              {{ models.end_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6 q-mt-md">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Periodicidad'"
            :manual_option="periodicity_billing_trust"
            :map_options="false"
            :required="true"
            :default_value="models?.periodicity"
            :auto_complete="false"
            :clearable="false"
            :placeholder="'Seleccione'"
            :rules="[(val: string) => is_required(val)]"
            @update:modelValue="models.periodicity = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Periodicidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.periodicity ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          v-if="models.periodicity === 'Otro'"
          class="col-12 col-md-6 q-mt-md"
        >
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="¿Cuál?"
            :default_value="models.other"
            required
            :rules="[
              (val: string) =>
                is_required(val),
              (val: string) => max_length(val, 20),
              (val: string) => only_alphanumeric(val),
            ]"
            @update:model-value="models.other = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">¿Cuál?</p>
            <p class="text-weight-medium no-margin">
              {{ models.other ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { IBillingTrustForm } from '@/interfaces/customs'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useBasicDataForm from '@/components/Forms/SettlementCommissions/BillingTrust/BasicData'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IBillingTrustForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IBillingTrustForm | null): void
}>()

const {
  formElementRef,
  models,
  periodicity_billing_trust,
  handleBusinessCode,
  isValidBusiness,
  isLoadingBusiness,
  is_required,
  max_length,
  only_alphanumeric,
} = useBasicDataForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
