<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-lg">
        <!-- 1) Código de portafolio -->
        <div class="col-xs-12 col-sm-6 col-md-4">
          <GenericSelector
            v-if="!isView"
            label="Código de portafolio"
            :default_value="models.investment_portfolio_id"
            :manual_option="permission_user_portfolio"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :disabled="action === 'edit'"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'El código de portafolio es requerido'
                ),
            ]"
            @update:model-value="models.investment_portfolio_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código de portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ models.investment_portfolio_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 2) Descripción de portafolio -->
        <div class="col-xs-12 col-sm-6 col-md-4">
          <GenericInput
            v-if="!isView"
            label="Descripción de portafolio"
            :default_value="models.investment_portfolio_description"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'La descripción del portafolio es requerida'
                ),
            ]"
            @update:model-value="
              models.investment_portfolio_description = $event
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción de portafolio</p>
            <p class="text-weight-medium no-margin">
              {{ models.investment_portfolio_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 3) Fecha de operación de portafolio -->
        <div class="col-xs-12 col-sm-6 col-md-4">
          <GenericDateInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.operation_date"
            :placeholder="''"
            :label="'Fecha de operación de portafolio'"
            required
            disabled
            :auto_complete="true"
            :rules="[
              (val) =>
                useRules().is_required(
                  val,
                  'La fecha de operación es requerida'
                ),
            ]"
            @update:model-value="models.operation_date = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Fecha de operación de portafolio
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.operation_date ?? 'No registrado' }}
            </p>
          </div>
        </div>
        <!-- Información operador -->
        <div class="col-12">
          <p class="text-weight-bold text-black-90 q-mt-md q-mb-none">
            Información operador
          </p>
          <q-separator spaced class="q-mt-sm q-mb-md" />
        </div>

        <!-- 4) Emisor -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Emisor"
            :default_value="models.issuer_id"
            :manual_option="fic_participation_emitter_foreign_currency"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :disabled="action === 'edit'"
            :rules="[
              (v) => useRules().is_required(v, 'El campo Emisor es requerido'),
            ]"
            @update:model-value="models.issuer_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Emisor</p>
            <p class="text-weight-medium no-margin">
              {{ models.issuer_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 5) Descripción emisor -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Descripción emisor"
            :default_value="models.issuer_description"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'La descripción del emisor es requerida'
                ),
            ]"
            @update:model-value="models.issuer_description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción emisor</p>
            <p class="text-weight-medium no-margin">
              {{ models.issuer_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 6) Contraparte -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericSelector
            v-if="!isView"
            label="Contraparte"
            :default_value="models.counterparty_id"
            :manual_option="fic_participation_counterparty_foreign_currency"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :disabled="action === 'edit'"
            :rules="[
              (v) =>
                useRules().is_required(v, 'El campo Contraparte es requerido'),
            ]"
            @update:model-value="models.counterparty_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Contraparte</p>
            <p class="text-weight-medium no-margin">
              {{ models.counterparty_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 7) Descripción contraparte -->
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            v-if="!isView"
            label="Descripción contraparte"
            :default_value="models.counterparty_description"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'La descripción de la contraparte es requerida'
                ),
            ]"
            @update:model-value="models.counterparty_description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción contraparte</p>
            <p class="text-weight-medium no-margin">
              {{ models.counterparty_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 8) Administrador -->
        <div class="col-xs-12 col-sm-6 col-md-6">
          <GenericSelector
            v-if="!isView"
            label="Administrador"
            :default_value="models.administrator_id"
            :manual_option="fic_participation_administrator_foreign_currency"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :required="true"
            :disabled="action === 'edit'"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'El campo Administrador es requerido'
                ),
            ]"
            @update:model-value="models.administrator_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Administrador</p>
            <p class="text-weight-medium no-margin">
              {{ models.administrator_id ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <!-- 8) Descripción Administrador -->
        <div class="col-xs-12 col-sm-6 col-md-6">
          <GenericInput
            v-if="!isView"
            label="Descripción administrador"
            :default_value="models.administrator_description"
            :required="true"
            disabled
            placeholder="-"
            :rules="[
              (v) =>
                useRules().is_required(
                  v,
                  'La descripción del administrador es requerida'
                ),
            ]"
            @update:model-value="models.administrator_description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Descripción administrador</p>
            <p class="text-weight-medium no-margin">
              {{ models.administrator_description ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import { useRules } from '@/composables'
import { IForeignCurrencyWithdrawalParticipationForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import useBasicDataForm from './BasicDataForm'

const props = defineProps<{
  action: ActionType
  data?: IForeignCurrencyWithdrawalParticipationForm | null
}>()

const {
  models,
  formElementRef,
  isView,
  resetForm,
  fic_participation_administrator_foreign_currency,
  permission_user_portfolio,
  fic_participation_counterparty_foreign_currency,
  fic_participation_emitter_foreign_currency,
} = useBasicDataForm(props)
defineExpose({
  resetForm,
  validateForm: () => formElementRef.value?.validate(),
})
</script>
