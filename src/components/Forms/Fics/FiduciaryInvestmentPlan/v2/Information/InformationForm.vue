<template>
  <q-form ref="formInformation">
    <section v-if="['create'].includes(action)">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Fondo de inversión"
            :default_value="models.collective_investment_fund_id"
            :manual_option="funts_to_investment_plans"
            :auto_complete="true"
            :required="false"
            :map_options="true"
            :rules="[]"
            @update:model-value="models.collective_investment_fund_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            label="Descripción de fondo"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.fund_description"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            label="Plan de inversión"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.investment_plan"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Oficina apertura"
            :default_value="models.operation_office_id"
            :manual_option="offices"
            :auto_complete="true"
            :required="false"
            :map_options="true"
            :rules="[]"
            @update:model-value="models.operation_office_id = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            label="Fecha de operación"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.operation_date"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            v-if="
              models.collective_investment_fund?.parameters?.[0]
                ?.fund_permanency_agreement
            "
            label="Fecha de vencimiento"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.expiration_date"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
        </div>
      </div>
    </section>

    <section v-if="['edit', 'view'].includes(action)">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div
          class="col-12"
          :class="['edit'].includes(action) ? 'col-md-4' : 'col-md-3'"
        >
          <GenericInput
            v-if="['edit'].includes(action)"
            label="Fondo de inversión"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.collective_investment_fund?.fund_code"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Fondo de inversión
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.collective_investment_fund?.fund_code ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['edit'].includes(action) ? 'col-md-4' : 'col-md-3'"
        >
          <GenericInput
            v-if="['edit'].includes(action)"
            label="Descripción de fondo"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.fund_description"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Descripción de fondo
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.fund_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['edit'].includes(action) ? 'col-md-4' : 'col-md-3'"
        >
          <GenericInput
            v-if="['edit'].includes(action)"
            label="Fecha de operación"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.operation_date"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Fecha de operación
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.operation_date ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['edit'].includes(action) ? 'col-md-4' : 'col-md-3'"
        >
          <GenericInput
            v-if="['edit'].includes(action)"
            label="Oficina apertura"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.operation_office?.office_description"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Oficina apertura</p>
            <p class="text-weight-medium no-margin">
              {{
                models.operation_office?.office_description ?? 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['edit'].includes(action) ? 'col-md-4' : 'col-md-3'"
        >
          <GenericInput
            v-if="['edit'].includes(action)"
            label="Usuario"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="`${models?.user_created?.name} ${models?.user_created?.last_name}`"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Usuario</p>
            <p class="text-weight-medium no-margin">
              {{
                models?.user_created?.name
                  ? `${models?.user_created?.name} ${models?.user_created?.last_name}`
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['edit'].includes(action) ? 'col-md-4' : 'col-md-3'"
        >
          <GenericInput
            v-if="['edit'].includes(action)"
            label="Plan de inversión"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.code"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Plan de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ models.code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['edit'].includes(action) ? 'col-md-6' : 'col-md-3'"
        >
          <GenericInput
            v-if="['edit'].includes(action)"
            label="Estado del plan de inversión"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.status?.status"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Estado del plan de inversión
            </p>
            <p class="text-weight-medium no-margin">
              <ShowStatus :type="Number(models.status?.status_id ?? 1)" />
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['edit'].includes(action) ? 'col-md-6' : 'col-md-3'"
        >
          <GenericInput
            v-if="
              models.collective_investment_fund?.parameters?.[0]
                ?.fund_permanency_agreement && ['edit'].includes(action)
            "
            label="Fecha de vencimiento"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.expiration_date"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div
            v-if="
              models.collective_investment_fund?.parameters?.[0]
                ?.fund_permanency_agreement && ['view'].includes(action)
            "
            class="text-black-90"
          >
            <p class="text-weight-bold no-margin ellipsis">
              Fecha de vencimiento
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.expiration_date ?? 'No registrado' }}
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
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Interfaces
import { IFiduciaryInvestmentPlansPropsForm } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// logic view
import useInformationForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/v2/Information/InformationForm'

const props = withDefaults(
  defineProps<IFiduciaryInvestmentPlansPropsForm>(),
  {}
)

const { models, formInformation, funts_to_investment_plans, offices } =
  useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
