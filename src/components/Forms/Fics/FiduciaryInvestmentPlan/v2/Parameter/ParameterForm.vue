<template>
  <q-form ref="formParameter">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <p class="text-bold text-h6">Datos generales</p>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :key="`manager-${
              models.collective_investment_fund_id || 'no-fund'
            }-${models?.parameters?.fic_manager_user_id || 'no-selection'}`"
            label="Usuario Gerente_FIC"
            :default_value="models?.parameters?.fic_manager_user_id"
            :manual_option="fic_manager_profiles"
            :auto_complete="true"
            required
            :map_options="true"
            :rules="[]"
            @update:model-value="
              setParameterValue('fic_manager_user_id', $event)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Usuario Gerente_FIC
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models?.parameters?.fic_manager_user?.name ??
                models?.parameters?.fic_manager_user_name ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Descripción Gerente_FIC"
            placeholder="-"
            type="text"
            required
            :default_value="models.parameters?.fic_manager_user_name"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Descripción Gerente_FIC
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models?.parameters?.fic_manager_user?.name ??
                models?.parameters?.fic_manager_user_name ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :key="`advisor-${
              models.collective_investment_fund_id || 'no-fund'
            }-${models?.parameters?.fic_advisor_user_id || 'no-selection'}`"
            label="Usuario Asesor_FIC"
            :default_value="models?.parameters?.fic_advisor_user_id"
            :manual_option="fic_advisor_profiles"
            :auto_complete="true"
            required
            :map_options="true"
            :rules="[]"
            @update:model-value="
              setParameterValue('fic_advisor_user_id', $event)
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Usuario Asesor_FIC
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models?.parameters?.fic_advisor_user?.name ??
                models?.parameters?.fic_advisor_user_name ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Descripción Asesor_FIC"
            placeholder="-"
            type="text"
            required
            :default_value="models?.parameters?.fic_advisor_user_name"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Descripción Asesor_FIC
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models?.parameters?.fic_advisor_user?.name ??
                models?.parameters?.fic_advisor_user_name ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-my-lg" />

    <section>
      <div class="row">
        <div class="col-12">
          <p class="text-bold text-h6">Operaciones</p>
        </div>

        <div
          class="col-12"
          :class="
            ['create', 'edit'].includes(action)
              ? 'flex justify-between'
              : 'mb-2'
          "
        >
          <div class="col-auto self-center">
            <p class="q-my-none">Realiza operación Web*</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-if="['create', 'edit'].includes(action)"
              v-model="radioHasWebOperations"
              :isDisabled="['view'].includes(action)"
              titleRadioTrue="Si"
              titleRadioFalse="No"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              @update:model-value="
                setParameterValue('has_web_operations', $event)
              "
            />
            <div v-else class="text-black-90">
              <p class="text-weight-medium no-margin">
                {{ radioHasWebOperations ? 'Si' : 'No' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <q-separator
        class="q-my-lg"
        v-if="radioHasWebOperations && ['create', 'edit'].includes(action)"
      />

      <div
        class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-lg"
        v-if="radioHasWebOperations"
      >
        <div
          class="col-12"
          :class="['create', 'edit'].includes(action) ? 'col-md-6' : 'col-md-3'"
        >
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Cantidad de operaciones por aporte/día"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.parameters?.contribution_operations_per_day"
            :rules="[(v) => only_number(v)]"
            @update:modelValue="
              ($event) => {
                setParameterValue('contribution_operations_per_day', $event)
                setParameterValue(
                  'contribution_operations_per_month',
                  $event * 30
                )
              }
            "
          />
          <div v-else class="text-black-90">
            <p
              class="text-weight-bold no-margin"
              :class="['create', 'edit'].includes(action) ? 'ellipsis' : ''"
            >
              Cantidad de operaciones por aporte/día
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.parameters?.contribution_operations_per_day ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['create', 'edit'].includes(action) ? 'col-md-6' : 'col-md-3'"
        >
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Cantidad de operaciones por aporte/mes"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="
              models.parameters?.contribution_operations_per_month
            "
            :rules="[]"
            @update:modelValue="
              setParameterValue('contribution_operations_per_month', $event)
            "
            disabled
          />
          <div v-else class="text-black-90">
            <p
              class="text-weight-bold no-margin"
              :class="['create', 'edit'].includes(action) ? 'ellipsis' : ''"
            >
              Cantidad de operaciones por aporte/mes
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.parameters?.contribution_operations_per_month ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['create', 'edit'].includes(action) ? 'col-md-6' : 'col-md-3'"
        >
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Cantidad de operaciones por retiro/día"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.parameters?.withdrawal_operations_per_day"
            :rules="[(v) => only_number(v)]"
            @update:modelValue="
              ($event) => {
                setParameterValue('withdrawal_operations_per_day', $event)
                setParameterValue(
                  'withdrawal_operations_per_month',
                  $event * 30
                )
              }
            "
          />
          <div v-else class="text-black-90">
            <p
              class="text-weight-bold no-margin"
              :class="['create', 'edit'].includes(action) ? 'ellipsis' : ''"
            >
              Cantidad de operaciones por retiro/día
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.parameters?.withdrawal_operations_per_day ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['create', 'edit'].includes(action) ? 'col-md-6' : 'col-md-3'"
        >
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Cantidad de operaciones por retiro/mes"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.parameters?.withdrawal_operations_per_month"
            :rules="[]"
            @update:modelValue="
              setParameterValue('withdrawal_operations_per_month', $event)
            "
            disabled
          />
          <div v-else class="text-black-90">
            <p
              class="text-weight-bold no-margin"
              :class="['create', 'edit'].includes(action) ? 'ellipsis' : ''"
            >
              Cantidad de operaciones por retiro/mes
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models.parameters?.withdrawal_operations_per_month ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-my-lg" />

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <p class="text-bold text-h6">Detalle de apertura</p>
        </div>

        <div
          class="col-12"
          :class="['create', 'edit'].includes(action) ? 'col-md-6' : 'col-md-3'"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :key="`business-line-${
              models.collective_investment_fund_id || 'no-fund'
            }-${models?.parameters?.fic_business_line_id || 'no-selection'}`"
            label="Línea de negocio"
            :default_value="models?.parameters?.fic_business_line_id"
            :manual_option="filteredBusinessLines"
            :auto_complete="true"
            :required="has_types_participation"
            :map_options="true"
            :rules="[]"
            @update:model-value="
              setParameterValue('fic_business_line_id', $event)
            "
            :disabled="['edit'].includes(action)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Línea de negocio</p>
            <p class="text-weight-medium no-margin">
              {{
                models?.parameters?.fic_business_line?.description ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div
          class="col-12"
          :class="['create', 'edit'].includes(action) ? 'col-md-6' : 'col-md-3'"
        >
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Tipo de participación"
            placeholder="-"
            type="text"
            required
            :default_value="
              models?.parameters?.fic_participation_type?.description
            "
            :rules="[]"
            @update:modelValue=""
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Tipo de participación
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models?.parameters?.fic_participation_type?.description ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Aplica penalización</p>
            <p class="text-weight-medium no-margin">
              {{ radioPenalty ? 'Si' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Porcentaje</p>
            <p class="text-weight-medium no-margin">
              {{
                models.parameters?.percentage
                  ? `${models.parameters?.percentage}%`
                  : 'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Maneja fideicomiso</p>
            <p class="text-weight-medium no-margin">
              {{ radioHasTrustManagement ? 'Si' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Código fideicomiso
            </p>
            <p class="text-weight-medium no-margin">
              {{
                models?.parameters?.business_trust?.business_code ??
                'No registrado'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Valor apertura</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrency(models.parameters?.opening_amount ?? '0') }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3" v-if="['view'].includes(action)">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Saldo plan</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrency(models.parameters?.plan_balance ?? '0') }}
            </p>
          </div>
        </div>
      </div>

      <div class="row" v-if="['create', 'edit'].includes(action)">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">Aplica penalización*</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="radioPenalty"
              :isDisabled="['view'].includes(action) || radioPenaltyDisabled"
              titleRadioTrue="Si"
              titleRadioFalse="No"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              @update:model-value="setParameterValue('penalty', $event)"
            />
          </div>
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
      </div>

      <div
        class="row"
        v-if="radioPenalty && ['create', 'edit'].includes(action)"
      >
        <div class="col-12 col-md-6">
          <GenericInput
            label="Porcentaje"
            placeholder="-"
            type="text"
            :required="false"
            :default_value="models.parameters?.percentage"
            :rules="[
              (v) => only_number_with_max_integers_and_decimals(v, 2, 2),
            ]"
            @update:modelValue="setParameterValue('percentage', $event)"
            :disabled="['create', 'edit'].includes(action)"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
      </div>

      <div class="row" v-if="['create', 'edit'].includes(action)">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">Maneja fideicomiso*</p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="radioHasTrustManagement"
              :isDisabled="['view'].includes(action)"
              titleRadioTrue="Si"
              titleRadioFalse="No"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              @update:model-value="
                setParameterValue('has_trust_management', $event)
              "
              :is-disabled="['edit'].includes(action)"
            />
          </div>
        </div>

        <div class="col-12">
          <q-separator class="q-my-lg" />
        </div>
      </div>

      <div
        class="row"
        v-if="radioHasTrustManagement && ['create', 'edit'].includes(action)"
      >
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            label="Código fideicomiso"
            :default_value="models?.parameters?.business_trust_id"
            :manual_option="business_trusts_with_code"
            :auto_complete="true"
            required
            :map_options="true"
            :rules="[]"
            @update:model-value="setParameterValue('business_trust_id', $event)"
            :disabled="['edit'].includes(action)"
          />
        </div>

        <div class="col-12">
          <q-separator class="q-my-xl" />
        </div>
      </div>

      <div
        class="row q-col-gutter-x-lg q-col-gutter-y-sm"
        v-if="['create', 'edit'].includes(action)"
      >
        <div class="col-12 col-md-4">
          <GenericInput
            label="Valor apertura"
            placeholder="-"
            type="text"
            required
            :default_value="models.parameters?.opening_amount"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInput
            label="Saldo plan"
            placeholder="-"
            type="text"
            required
            :default_value="models.parameters?.plan_balance"
            :rules="[]"
            @update:modelValue=""
            disabled
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

// interfaces
import { IFiduciaryInvestmentPlansPropsForm } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// logic view
import useParameterForm from '@/components/Forms/Fics/FiduciaryInvestmentPlan/v2/Parameter/ParameterForm'

const props = withDefaults(
  defineProps<IFiduciaryInvestmentPlansPropsForm>(),
  {}
)

const {
  models,
  formParameter,
  formatCurrency,
  fic_manager_profiles,
  fic_advisor_profiles,
  filteredBusinessLines,
  business_trusts_with_code,
  radioHasWebOperations,
  radioPenalty,
  radioPenaltyDisabled,
  has_types_participation,
  radioHasTrustManagement,
  only_number,
  only_number_with_max_integers_and_decimals,
  setParameterValue,
} = useParameterForm(props)

defineExpose({
  validateForm: () => formParameter.value?.validate(),
  models,
})
</script>
