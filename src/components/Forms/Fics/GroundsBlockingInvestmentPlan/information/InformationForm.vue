<template>
  <q-form ref="formElementRef">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código"
            :default_value="models.code"
            required
            placeholder="Inserte"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código es requerido'),
              (val: string) => useRules().min_value(val, 1),
              (val: string) => useRules().max_value(val, 9999),
            ]"
            :disabled="action === 'edit'"
            @update:model-value="models.code = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">code</p>
            <p class="text-weight-medium no-margin">
              {{ models.code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción"
            :default_value="models.description"
            required
            placeholder="Inserte"
            :rules="[
              (val: string) => useRules().is_required(val, 'La descripción es requerida')
            ]"
            @update:model-value="models.description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción</p>
            <p class="text-weight-medium no-margin">
              {{ models.description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estado"
            :default_value="String(models.status_id)"
            required
            :disabled="action === 'edit'"
            :rules="[(val: string) => useRules().is_required(val, 'El estado es requerido')]"
            @update:model-value="models.status_id = $event"
            :manual_option="grounds_blocking_investment_status"
            :map_options="true"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              {{ models.status_id ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Interfaces - Constants
import { IGroundsBlockingInvestmentPlanItemList } from '@/interfaces/customs/fics/GroundsBlockingInvestmentPlan'
import { ActionType } from '@/interfaces/global'
import { useRules } from '@/composables'

// Logic view
import useInformationForm from '@/components/Forms/Fics/GroundsBlockingInvestmentPlan/information/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IGroundsBlockingInvestmentPlanItemList | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const { models, formElementRef, grounds_blocking_investment_status } =
  useInformationForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
