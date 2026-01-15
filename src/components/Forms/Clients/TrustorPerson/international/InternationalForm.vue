<template>
  <q-form ref="formInternational">
    <section>
      <div class="q-px-lg q-mt-lg q-pb-lg q-mb-sm">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Operaciones internacionales
        </p>
        <p class="text-weight-medium mb-0 text-grey-6">
          Proporcione los datos sobre las transacciones internacionales de
          fideicomiso.
        </p>
      </div>
    </section>

    <section>
      <div class="mx-3 mt-1 mb-3">
        <RadioYesNo
          v-model="models.can_performs_transactions"
          :hasTitle="true"
          title="¿Realiza transacciones en moneda extranjera?"
          :hasSubtitle="false"
          class="mt-4"
        />
        <q-separator class="mt-1" />

        <div
          class="row q-col-gutter-md mt-1"
          v-if="models.can_performs_transactions"
        >
          <div class="col-xs-12 col-sm-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Transacción que realiza{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="[]"
              :map_options="true"
              :required="models.can_performs_transactions"
              :default_value="models.transaction_type"
              :auto_complete="true"
              @update:modelValue="models.transaction_type = $event"
              :rules="[(val: string) => !!val && models.can_performs_transactions || 'La transacción es requerida']"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.transaction_type ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              País{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="[]"
              :map_options="true"
              :required="models.can_performs_transactions"
              :default_value="models.operation_country_id"
              :auto_complete="true"
              @update:modelValue="models.operation_country_id = $event"
              :rules="[(val: string) => !!val && models.can_performs_transactions || 'El país es requerido']"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.operation_country_id ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Moneda{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="[]"
              :map_options="true"
              :required="models.can_performs_transactions"
              :default_value="models.currency"
              :auto_complete="true"
              @update:modelValue="models.currency = $event"
              :rules="[(val: string) => !!val && models.can_performs_transactions || 'La moneda es requerida']"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.currency ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: any | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

import useInternationalForm from './InternationalForm'

const { models, formInternational } = useInternationalForm(props)
defineExpose({
  validateForm: () => formInternational.value?.validate(),
})
</script>
