<template>
  <section>
    <q-form ref="additional_form_ref">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Datos adicionales
        </p>
      </div>

      <div class="row q-col-gutter-md">
        <div
          class="col-xs-12 col-sm-12 col-md-4 col-lg-4"
          v-if="!props.isSociety"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Periodicidad rendición de cuentas'"
            :default_value="models.accountability_period"
            :manual_option="business_trust_periodicity_accountability"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :readonly="is_edit"
            :required="props.isSociety ? false : true"
            :rules="[
              (val: string) =>
                is_required(val, 'La periodicidad del negocio es requerida'),
            ]"
            @update:modelValue="models.accountability_period = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Periodicidad rendición de cuentas
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.accountability_period ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Responsable negocio'"
            :default_value="models.business_manager_id"
            :manual_option="users_with_document_and_abbreviation"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El responsable del negocio es requerido'),
            ]"
            @update:modelValue="models.business_manager_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Responsable negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_manager_id ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Contador negocio'"
            :default_value="models.business_accountant_id"
            :manual_option="users_with_document_and_abbreviation"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :rules="[
              (val: string) =>
                is_required(val, 'El contador del negocio es requerido'),
            ]"
            @update:modelValue="models.business_accountant_id = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Contador negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.business_accountant_id ?? '-' }}
            </p>
          </div>
        </div>

        <div
          class="col-xs-12 col-sm-12 col-md-4 col-lg-4"
          v-if="!props.isSociety"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Maneja consorcio'"
            :default_value="models.consortium"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            :readonly="is_edit"
            :required="props.isSociety ? false : true"
            :rules="[
              (val: boolean) => is_required_boolean(val, 'El campo es requerido'),
            ]"
            @update:modelValue="models.consortium = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Maneja consorcio</p>
            <p class="text-weight-medium no-margin">
              {{ models.consortium ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Maneja presupuesto'"
            :default_value="models.has_budget"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :readonly="is_edit"
            :rules="[
              (val: boolean) => is_required_boolean(val, 'El campo es requerido'),
            ]"
            @update:modelValue="models.has_budget = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Maneja presupuesto</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_budget ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Maneja contratación derivada'"
            :default_value="models.derivate_contracting"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :readonly="is_edit"
            :rules="[
              (val: boolean) => is_required_boolean(val, 'El campo es requerido'),
            ]"
            @update:modelValue="models.derivate_contracting = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Maneja contratación derivada
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.derivate_contracting ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div
          class="col-xs-12 col-sm-12"
          :class="!is_view ? 'col-md-6 col-lg-6' : 'col-md-4 col-lg-4'"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Maneja cuentas por pagar'"
            :default_value="models.has_accounts_payable"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :readonly="is_edit"
            :rules="[
              (val: boolean) => is_required_boolean(val, 'El campo es requerido'),
            ]"
            @update:modelValue="models.has_accounts_payable = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Maneja cuentas por pagar</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_accounts_payable ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div
          class="col-xs-12 col-sm-12"
          :class="!is_view ? 'col-md-6 col-lg-6' : 'col-md-4 col-lg-4'"
        >
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Maneja facturación'"
            :default_value="models.has_billing"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :readonly="is_edit"
            :rules="[
              (val: boolean) => is_required_boolean(val, 'El campo es requerido'),
            ]"
            @update:modelValue="models.has_billing = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Maneja facturación</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_billing ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Maneja activos'"
            :default_value="models.has_assets"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :readonly="is_edit"
            :rules="[
              (val: boolean) => is_required_boolean(val, 'El campo es requerido'),
            ]"
            @update:modelValue="models.has_assets = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Maneja activos</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_assets ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Maneja pólizas'"
            :default_value="models.has_policy"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :readonly="is_edit"
            :rules="[
              (val: boolean) => is_required_boolean(val, 'El campo es requerido'),
            ]"
            @update:modelValue="models.has_policy = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Maneja pólizas</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_policy ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Maneja garantías'"
            :default_value="models.has_guarantee"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :readonly="is_edit"
            :rules="[
              (val: boolean) => is_required_boolean(val, 'El campo es requerido'),
            ]"
            @update:modelValue="models.has_guarantee = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Maneja garantías</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_guarantee ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Maneja proyectos inmobiliarios'"
            :default_value="models.has_real_estate_project"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :readonly="is_edit"
            :rules="[
              (val: boolean) => is_required_boolean(val, 'El campo es requerido'),
            ]"
            @update:modelValue="models.has_real_estate_project = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Maneja proyectos inmobiliarios
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.has_real_estate_project ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Maneja acreedor garantizado'"
            :default_value="models.has_secured_creditor"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :readonly="is_edit"
            :rules="[
              (val: boolean) => is_required_boolean(val, 'El campo es requerido'),
            ]"
            @update:modelValue="models.has_secured_creditor = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Maneja acreedor garantizado
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.has_secured_creditor ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :label="'Maneja normativo'"
            :default_value="models.has_normative"
            :manual_option="default_yes_no"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            auto_complete
            required
            :readonly="is_edit"
            :rules="[
              (val: boolean) => is_required_boolean(val, 'El campo es requerido'),
            ]"
            @update:modelValue="models.has_normative = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Maneja normativo</p>
            <p class="text-weight-medium no-margin">
              {{ models.has_normative ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
      </div>
    </q-form>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITrustBusinessAdditionalInformation | null
    isSociety: boolean
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:models', value: ITrustBusinessAdditionalInformation) => void
  >()

// components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// logic
import useAdditionalInformation from './AdditionalInformation'

// interfaces
import { ActionType } from '@/interfaces/global'
import { ITrustBusinessAdditionalInformation } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

const {
  models,
  additional_form_ref,
  default_yes_no,
  business_trust_periodicity_accountability,
  users_with_document_and_abbreviation,
  is_view,
  is_edit,
  // rules
  is_required,
  is_required_boolean,
} = useAdditionalInformation(props, emits)

defineExpose({
  validateForm: async () => await additional_form_ref.value?.validate(),
})
</script>
