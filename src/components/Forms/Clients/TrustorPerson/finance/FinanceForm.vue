<template>
  <q-form ref="formFinance">
    <section>
      <div class="q-px-lg q-mt-lg q-pb-lg q-mb-sm">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Información financiera
        </p>
        <p class="text-weight-medium mb-0 text-grey-6">
          Proporcione los datos de la información financiera de su nuevo
          fideicomiso.
        </p>
      </div>
    </section>

    <section>
      <div class="mx-3 mt-0 mb-3">
        <RadioYesNo
          v-model="models.declares_income"
          :hasTitle="true"
          title="¿Declara renta?"
          :hasSubtitle="false"
          class="mt-4"
        />
        <q-separator class="mt-1" />

        <div class="row q-col-gutter-md mt-1" v-if="models.declares_income">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Total ingresos operacionales mensuales{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="models.declares_income"
              :default_value="models.total_operational_income"
              :rules="[
                (v: string) => useRules().is_required(v, 'El total de ingresos es requerido'),
                (v: string) => useRules().only_number(v),
                (v: string) => useRules().length_between(v, 2, 50),
              ]"
              @update:model-value="models.total_operational_income = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.total_operational_income ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Total egresos operacionales mensuales{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="models.declares_income"
              :default_value="models.total_expenses"
              :rules="[
                (v: string) => models.declares_income && !!v || 'El total de egresos es requerido',
                (v: string) => models.declares_income && /^\d+$/.test(v) || 'Solo se permiten números',
                (v: string) => models.declares_income && v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) => models.declares_income &&
                  v.length <= 50 || 'Debe contener como máximo 50 caracteres',
              ]"
              @update:model-value="models.total_expenses = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.total_expenses ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0 ellipsis"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Concepto otros ingresos no operacionales mensuales
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :default_value="models.other_non_operational_income_concept"
              :required="
                models.other_non_operational_income_concept ? true : false
              "
              :rules="
                models.other_non_operational_income_concept
                  ? [
                      (v: string) => useRules().only_letters(v),
                      (v: string) => useRules().max_length(v, 30),
                    ]
                  : []
              "
              @update:model-value="
                models.other_non_operational_income_concept = $event
              "
            />
            <p v-else class="text-grey-6 mb-0">
              {{
                models.other_non_operational_income_concept ?? 'No registrado'
              }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Total ingresos no operacionales mensuales{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="models.declares_income"
              :default_value="models.total_non_operational_income"
              :rules="[
                (v: string) => models.declares_income && !!v || 'El total de ingresos es requerido',
                (v: string) => models.declares_income && /^\d+$/.test(v) || 'Solo se permiten números',
                (v: string) => models.declares_income && v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) => models.declares_income &&
                  v.length <= 50 || 'Debe contener como máximo 50 caracteres',
              ]"
              @update:model-value="models.total_non_operational_income = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.total_non_operational_income ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Total activos{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="models.declares_income"
              :default_value="models.assets"
              :rules="[
                (v: string) => models.declares_income && !!v || 'El total de activos es requerido',
                (v: string) => models.declares_income && /^\d+$/.test(v) || 'Solo se permiten números',
                (v: string) => models.declares_income && v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) => models.declares_income &&
                  v.length <= 50 || 'Debe contener como máximo 50 caracteres',
              ]"
              @update:model-value="models.assets = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.assets ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'
              "
            >
              Total pasivos{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="models.declares_income"
              :default_value="models.liabilities"
              :rules="[
                (v: string) => models.declares_income && !!v || 'El total de pasivos es requerido',
                (v: string) => models.declares_income && /^\d+$/.test(v) || 'Solo se permiten números',
                (v: string) => models.declares_income && v.length >= 2 || 'Debe contener al menos 2 caracteres',
                (v: string) => models.declares_income &&
                  v.length <= 50 || 'Debe contener como máximo 50 caracteres',
              ]"
              @update:model-value="models.liabilities = $event"
            />
            <p v-else class="text-grey-6 mb-0">
              {{ models.liabilities ?? 'No registrado' }}
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

// Composables
import { useRules } from '@/composables'

import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

import useFinanceForm from './FinanceForm'

const { models, formFinance } = useFinanceForm(props)
defineExpose({
  validateForm: () => formFinance.value?.validate(),
})
</script>
