<template>
  <q-form ref="formInvestor" class="q-pa-lg">
    <section>
      <p class="text-black-10 text-weight-bold text-h6">
        {{ investorTitle }}
      </p>

      <template v-if="!clientNaturalTypeDirect">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericInput
            v-if="['edit', 'create'].includes(action)"
            label="Calificación del inversionista"
            :default_value="models.investor.investor_rating"
              :required="false"
              :rules="[
                (v: string) => useRules().max_length(v, 60)
              ]"
              @update:model-value="models.investor.investor_rating = $event"
              />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Calificación del inversionista</p>
              <p class="text-weight-medium no-margin">
                {{ models.investor.investor_rating ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
  
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericInput
            v-if="['edit', 'create'].includes(action)"
            label="Calificación de riesgo cuantitativo"
            :default_value="models.investor.quantitative_risk_rating"
            :required="false"
            :rules="[
              (v:string) => !v || useRules().only_number(v),
              (v: string) => useRules().max_length(v, 10)
            ]"
            @update:model-value="models.investor.quantitative_risk_rating = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Calificación de riesgo cuantitativo</p>
              <p class="text-weight-medium no-margin">
                {{ models.investor.quantitative_risk_rating ?? 'No registrado' }}
              </p>
            </div>
          </div>
  
          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericInput
            v-if="['edit', 'create'].includes(action)"
            label="Calificación de riesgo cualitativo"
            :default_value="models.investor.qualitative_risk_rating"
              :required="false"
              :rules="[
                (v: string) => useRules().max_length(v, 60)
              ]"
              @update:model-value="models.investor.qualitative_risk_rating = $event"
              />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Calificación de riesgo cualitativo</p>
              <p class="text-weight-medium no-margin">
                {{ models.investor.qualitative_risk_rating ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </section>
  </q-form>
</template>

<script setup lang="ts">
//Components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

//Logic Form
import useInvestorForm from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/Investor/InvestorForm'

//Interfaces
import { ActionType } from '@/interfaces/global'
import { IClientIndirectNaturalInvestorForm } from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'

const props = withDefaults(
  defineProps<{
    action: ActionType,
    data?: IClientIndirectNaturalInvestorForm | null
  }>(),
  {}
)

const emits = defineEmits(['update:investor-indirect-data-form'])

const {
  formInvestor,
  models,
  useRules,

  investorTitle,
  clientNaturalTypeDirect
} = useInvestorForm(props, emits)

defineExpose({
  validateForm: () => formInvestor.value?.validate(),
})
</script>
