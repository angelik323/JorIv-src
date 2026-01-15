<template>
  <q-form ref="formInformation" class="q-pa-lg">
    <section>
      <p class="text-black-10 text-weight-bold text-h6">Información Trader</p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div :class="['col-12', 'col-md-6']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Trader"
            map_options
            required
            :disabled="action === 'edit'"
            :default_value="models.trader_id"
            :manual_option="users"
            :placeholder="'Seleccione'"
            :rules="[
              (val: string) => is_required(val, 'El trader es requerido'),
            ]"
            @update:model-value="(val: number) => (models.trader_id = val)"
          />
        </div>
        <div :class="['col-12', 'col-md-6']">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción"
            :default_value="models.description_trader"
            :placeholder="'-'"
            required
            :disabled="true"
            :rules="[
              (val: string) => is_required(val, 'El trader es requerido'),
            ]"
          />
        </div>
      </div>
      <q-separator class="q-mt-md q-mb-md" color="grey-4" />
      <p class="text-black-10 text-weight-bold text-h6">Cupo Trader</p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div :class="['col-12', 'col-md-6']">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Cupo general"
            :default_value="models.general_quota"
            :placeholder="'Inserte'"
            :rules="
              models.general_quota
                ? [
                    (value: string) =>
                      only_number_with_max_integers_and_decimals(value, 13, 2),
                  ]
                : []
            "
            @update:model-value="(val: number) => (models.general_quota = val)"
          />
        </div>
        <div :class="['col-12', 'col-md-6']">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            ref="individualQuotaInputRef"
            label="Cupo individual"
            :default_value="models.individual_quota"
            :placeholder="'Inserte'"
            :rules="
              models.individual_quota
                ? [
                    (value: string) =>
                      only_number_with_max_integers_and_decimals(value, 13, 2),
                    (value: string) =>
                      not_greater_than(
                        value,
                        models.general_quota ?? 0,
                        'El cupo individual no puede ser mayor al cupo general',
                      ),
                  ]
                : []
            "
            @update:model-value="
              (val: number) => (models.individual_quota = val)
            "
          />
        </div>
      </div>
      <q-separator class="q-mt-md q-mb-md" color="grey-4" />
      <p class="text-black-10 text-weight-bold text-h6">Permisos</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Código portafolio"
            :default_value="models.investment_portfolio_id"
            :manual_option="investment_portfolio"
            map_options
            :placeholder="'Seleccione'"
            auto_complete
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El código de portafolio es requerido'),
            ]"
            @update:model-value="
              (val: number) => (models.investment_portfolio_id = val)
            "
          />
        </div>
        <div :class="['col-12', 'col-md-3']">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción portafolio"
            :default_value="models.description_portfolio_name"
            :placeholder="'-'"
            required
            :disabled="true"
            :rules="[]"
          />
        </div>
        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="ID emisor"
            :default_value="models.emitter_id"
            :manual_option="third_party_issuers_selector"
            map_options
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) => is_required(val, 'El ID emisor es requerido'),
            ]"
            @update:model-value="(val: number) => (models.emitter_id = val)"
          />
        </div>
        <div :class="['col-12', 'col-md-3']">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción emisor"
            :default_value="models.description_emitter_name"
            :placeholder="'-'"
            required
            :disabled="true"
            :rules="[]"
          />
        </div>
        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="ID contraparte"
            :default_value="models.counterpart_id"
            :manual_option="third_party_issuers_selector"
            map_options
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El ID contraparte es requerido'),
            ]"
            @update:model-value="(val: number) => (models.counterpart_id = val)"
          />
        </div>
        <div :class="['col-12', 'col-md-3']">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            label="Descripción contraparte"
            :default_value="models.description_counterpart_name"
            :placeholder="'-'"
            required
            :disabled="true"
            :rules="[]"
          />
        </div>
        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Tipo inversión"
            :default_value="models.type_investment"
            :manual_option="inversion_types"
            map_options
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El tipo de inversión es requerido'),
            ]"
            @update:model-value="
              (val: number) => (models.type_investment = val)
            "
          />
        </div>
        <div :class="['col-12', 'col-md-3']">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Papeles"
            :default_value="models.paper_type_id"
            :manual_option="paper_type"
            map_options
            :placeholder="'Seleccione'"
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El tipo de papel es requerido'),
            ]"
            @update:model-value="(val: number) => (models.paper_type_id = val)"
          />
        </div>
      </div>
      <q-separator class="q-mt-md q-mb-md" color="grey-4" />
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { ITradePermitQuota } from '@/interfaces/customs/investment-portfolio/TradePermitQuota'
import { useInformationForm } from './InformationForm'
import { WriteActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: WriteActionType
    data?: ITradePermitQuota[]
  }>(),
  {}
)

defineExpose({
  validateForm: async () => formInformation.value?.validate(),
  getFormValues: () => models.value,
})

const {
  models,
  formInformation,
  individualQuotaInputRef,
  paper_type,
  investment_portfolio,
  third_party_issuers_selector,
  users,
  inversion_types,
  // Validations
  is_required,
  only_number_with_max_integers_and_decimals,
  not_greater_than,
} = useInformationForm(props)
</script>
