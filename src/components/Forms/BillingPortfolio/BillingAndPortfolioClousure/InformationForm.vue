<template>
  <q-form ref="formInformationRef">
    <section>
      <div class="mx-3 mt-2 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div
            class="col-12"
            :class="'create'.includes(props.action) ? 'col-md-6' : 'col-md-4'"
          >
            <GenericDateInputComponent
              v-if="['create'].includes(action)"
              :default_value="models.period"
              :required="true"
              :rules="[(val: string) => useRules().is_required(val)]"
              label="Periodo a cerrar"
              placeholder="AAAA-MM"
              mask="YYYY-MM"
              @update:model-value="models.period = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Periodo a cerrar</p>
              <p class="text-weight-medium no-margin">
                {{ models.period }}
              </p>
            </div>
          </div>
          <div
            class="col-12"
            :class="'create'.includes(props.action) ? 'col-md-6' : 'col-md-4'"
          >
            <GenericDateInputComponent
              v-if="['create'].includes(action)"
              :default_value="models.closing_date"
              :required="true"
              :disabled="true"
              :rules="[(val: string) => useRules().is_required(val)]"
              @update:modelValue="models.closing_date = $event"
              label="Fecha de cierre"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha de cierre</p>
              <p class="text-weight-medium no-margin">
                {{ models.closing_date }}
              </p>
            </div>
          </div>

          <div
            v-if="props.action !== 'create'"
            class="col-12"
            :class="'create'.includes(props.action) ? ' col-md-6' : 'col-md-4'"
          >
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">Estado del cierre</p>
              <p class="text-weight-medium no-margin">
                <ShowStatus
                  :type="Number(models.status?.id)"
                  status-type="billingPortfolio"
                />
              </p>
            </div>
          </div>
          <div class="col-12">
            <GenericInput
              :default_value="models.observations"
              label="Observaciones"
              placeholder="Inserte"
              :required="false"
              :rules="[(val: string) => useRules().max_length(val, 100)]"
              @update:model-value="models.observations = $event"
              v-if="['create'].includes(action)"
              type="textarea"
            />
            <div v-else class="text-black-90 mb-4">
              <p class="mb-0 text-weight-bold">Observaciones</p>
              <p class="text-weight-medium">
                {{ models?.observations }}
              </p>
            </div>
          </div>

          <div class="col-12 row">
            <div
              :class="
                'edit'.includes(props.action)
                  ? 'col-md-6'
                  : 'col-md-12  q-w-full'
              "
            >
              <RadioYesNo
                v-model="radioValidatePendingRequirements"
                :isRadioButton="false"
                :hasTitle="false"
                label="Validar requisitos pendientes"
                :hasSubtitle="false"
                :isDisabled="props.action !== 'create'"
                @update:model-value="
                  models.validate_requirements_checked = $event
                "
              />
            </div>

            <div
              :class="'edit'.includes(props.action) ? 'col-md-6' : 'col-md-12'"
              v-show="'edit'.includes(props.action)"
            >
              <RadioYesNo
                v-model="radioReValidatePendingRequirements"
                :isRadioButton="false"
                :hasTitle="false"
                label="Revalidar los requisitos pendientes"
                :hasSubtitle="false"
                @update:model-value="
                  models.revalidate_requirements_checked = $event
                "
              />
            </div>
          </div>

          <div class="col-12">
            <GenericInput
              :default_value="models.validations"
              label="Validaciones"
              placeholder="Inserte"
              required
              :rules="[]"
              :disabled="true"
              @update:model-value="models.validations = $event"
              v-if="['create'].includes(action)"
            />
            <div v-else class="text-black-90 mb-4">
              <p class="mb-0 text-weight-bold">Validaciones</p>
              <p class="text-weight-medium">
                {{ models?.validations }}
              </p>
            </div>
          </div>
          <div class="col-12">
            <RadioYesNo
              v-model="radioConfirmPeriodValid"
              :isRadioButton="false"
              :hasTitle="false"
              label="Confirmo que el periodo está validado"
              :hasSubtitle="false"
              @update:model-value="models.confirmed_validated = $event"
              :isDisabled="
                props.action === 'view' ||
                !billing_portfolio_clouser_validated_response.requirements_validated
              "
            />
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// composables
import { useRules } from '@/composables'
// logic
import useInformationForm from './InformationForm'
import { IBillingAndPortfolioClousureInformationForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBillingAndPortfolioClousureInformationForm | null
  }>(),
  {}
)
const emits = defineEmits<{
  (e: 'validate:form'): void
  (
    e: 'update:data',
    value: IBillingAndPortfolioClousureInformationForm | null
  ): void
}>()

const {
  models,
  formInformationRef,
  radioValidatePendingRequirements,
  radioReValidatePendingRequirements,
  radioConfirmPeriodValid,
  billing_portfolio_clouser_validated_response,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formInformationRef.value?.validate(),
})
</script>
