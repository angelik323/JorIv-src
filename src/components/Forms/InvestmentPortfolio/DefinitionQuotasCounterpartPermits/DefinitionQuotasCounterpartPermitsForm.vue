<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isView"
            :disabled="action === 'edit'"
            label="ID contraparte"
            :default_value="models.counterpart_id"
            :manual_option="third_party_issuers_selector_to_counterparty"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                  (v: string) =>
                    useRules().is_required(v, 'El campo ID contraparte es requerido'),
                ]"
            @update:model-value="handleSelectCounterpart($event)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">ID contraparte</p>
            <p class="text-weight-medium no-margin">
              {{ models.document_counterpart ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Descripción"
            :default_value="models.description_counterpart_name"
            placeholder="-"
            disabled
            :required="true"
            :rules="[
                  (v: string) =>
                    useRules().is_required(v, 'El campo Descripción es requerido'),
                ]"
            @update:model-value="models.description_counterpart_name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción</p>
            <p class="text-weight-medium no-margin">
              {{ models.description_counterpart_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Cupo general"
            :default_value="models.general_quota"
            placeholder="Inserte"
            :required="true"
            :rules="[
                  (v: string) =>
                    useRules().is_required(v, 'El campo Cuota general es requerido'),
                    (v: string) =>useRules().only_number_with_decimals(v),
                    (v: string) =>useRules().only_number_with_max_integers_and_decimals(v, 15, 2),
                ]"
            @update:model-value="models.general_quota = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Cuota general</p>
            <p class="text-weight-medium no-margin">
              {{ models.general_quota ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator class="q-mt-md q-mb-lg" />
      <p class="text-black-90 text-weight-bold text-h6">
        Información del portafolio
      </p>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isView"
            label="Código portafolio"
            :default_value="models.investment_portfolio_id"
            :manual_option="selectable_portfolios_with_code_and_name"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                  (v: string) =>
                    useRules().is_required(v, 'El campo Codigo portafolio es requerido'),
                ]"
            @update:model-value="handleSelectPortfolio($event)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ models.portfolio_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Descripción"
            :default_value="models.description_portfolio_name"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
                  (v: string) =>
                    useRules().is_required(v, 'El campo Descripción es requerido'),
                ]"
            @update:model-value="models.description_portfolio_name = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción</p>
            <p class="text-weight-medium no-margin">
              {{ models.description_portfolio_name ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator v-if="isView" class="q-mt-md q-mb-lg" />
      <div class="q-mt-md">
        <p class="text-black-90 text-weight-bold text-h6">
          Tipo de inversión y papeles
        </p>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isView"
            label="Tipo inversión"
            :default_value="models.type_of_investment"
            :manual_option="inversion_types"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
              (v: string) => useRules().is_required(v, 'El campo tipo inversión es requerido'),
            ]"
            @update:model-value="handleSelectInvestmentType($event)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo inversión</p>
            <p class="text-weight-medium no-margin">
              {{ models.type_of_investment ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="!isView"
            label="Papeles"
            :default_value="models.paper_type_id"
            :manual_option="paper_type"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :rules="[
                  (v: string) =>
                    useRules().is_required(v, 'El campo Papeles es requerido'),
                ]"
            @update:model-value="models.paper_type_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Papeles</p>
            <p class="text-weight-medium no-margin">
              {{ models.paper_type_id ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator class="q-mt-md q-mb-lg" />

      <template v-if="isView">
        <p class="text-black-90 text-weight-bold text-h6">
          Historial de cupos y permisos contraparte
        </p>
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold no-margin">Fecha de creación</p>
            <p class="text-weight-medium no-margin">
              {{
                models.history_permits_quotas_counterpart.created_at ??
                'No registrado'
              }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold no-margin">Creado por</p>
            <p class="text-weight-medium no-margin">
              {{
                models.history_permits_quotas_counterpart.creator_data ??
                'No registrado'
              }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold no-margin">Fecha de modificación</p>
            <p class="text-weight-medium no-margin">
              {{
                models.history_permits_quotas_counterpart.updated_at ??
                'No registrado'
              }}
            </p>
          </div>

          <div class="col-12 col-md-3 text-black-90">
            <p class="text-weight-bold no-margin">Modificado por</p>
            <p class="text-weight-medium no-margin">
              {{
                models.history_permits_quotas_counterpart.update_data ??
                'No registrado'
              }}
            </p>
          </div>
        </div>
      </template>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import { IDefinitionQuotaCounterpartPermitForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import useDefinitionQuotasCounterpartPermitsForm from './DefinitionQuotasCounterpartPermitsForm'

const props = defineProps<{
  action: ActionType
  data?: IDefinitionQuotaCounterpartPermitForm | null
}>()

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})

const {
  models,
  formElementRef,
  isView,
  third_party_issuers_selector_to_counterparty,
  selectable_portfolios_with_code_and_name,
  inversion_types,
  paper_type,
  handleSelectCounterpart,
  handleSelectPortfolio,
  handleSelectInvestmentType,
} = useDefinitionQuotasCounterpartPermitsForm(props)
</script>
