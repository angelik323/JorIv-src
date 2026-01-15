<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-90 text-weight-bold text-h6">Bloque contable</p>

        <div class="row q-col-gutter-lg">
          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericInput
              v-if="!isView"
              label="Sistema"
              :default_value="models.system_code"
              :required="true"
              placeholder="Inserte"
              :disabled="action === 'edit'"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Sistema es requerido'),
              ]"
              @update:model-value="models.system_code = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Sistema</p>
              <p class="text-weight-medium no-margin">
                {{ models.system_code ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericSelector
              v-if="!isView"
              label="Grupo de negocio"
              :default_value="models.business_group"
              :manual_option="business_trust_types"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="true"
              :disabled="action === 'edit'"
              :rules="[
                (v: string) =>
                  useRules().is_required(
                    v,
                    'El campo Grupo de negocio es requerido',
                  ),
              ]"
              @update:model-value="handleSelectBusinessGroup($event)"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Grupo de negocio</p>
              <p class="text-weight-medium no-margin">
                {{ models.business_group ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericSelector
              v-if="!isView"
              label="Estructura contable"
              :default_value="models.accounting_structure"
              :manual_option="account_structures_available"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="true"
              :disabled="action === 'edit'"
              :rules="[
                (v: string) =>
                  useRules().is_required(
                    v,
                    'El campo Estructura contable es requerido',
                  ),
              ]"
              @update:model-value="models.accounting_structure = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Estructura contable</p>
              <p class="text-weight-medium no-margin">
                {{ models.accounting_structure ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3">
            <GenericSelector
              v-if="!isView"
              label="Centro de costo"
              :default_value="models.cost_center"
              :manual_option="cost_center"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="false"
              :disabled="action === 'edit'"
              :rules="[]"
              @update:model-value="models.cost_center = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Centro de costo</p>
              <p class="text-weight-medium no-margin">
                {{ models.cost_center ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>

        <q-separator class="q-mt-md q-mb-lg" />
        <p class="text-black-90 text-weight-bold text-h6">Empresa</p>

        <div class="row q-col-gutter-lg">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericSelector
              v-if="!isView"
              label="Código"
              :default_value="models.company_code"
              :manual_option="business_trusts_value_is_code"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              auto_complete
              :required="true"
              :disabled="action === 'edit' || models.business_group === null"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El campo Código es requerido'),
              ]"
              @update:model-value="handleSelectCompanyCode($event)"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Código</p>
              <p class="text-weight-medium no-margin">
                {{ models.company_code ?? 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6">
            <GenericInput
              v-if="!isView"
              label="Descripción"
              disabled
              placeholder="-"
              :default_value="models.bussiness_description"
              :required="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(
                    v,
                    'El campo Descripción es requerido',
                  ),
              ]"
              @update:model-value="models.bussiness_description = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Descripción</p>
              <p class="text-weight-medium no-margin">
                {{ models.bussiness_description ?? 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { useRules } from '@/composables'
import { IDefinitionAccountingParametersForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import useBasicDataForm from './BasicDataForm'

const props = defineProps<{
  action: ActionType
  data?: IDefinitionAccountingParametersForm | null
}>()

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})

const {
  models,
  formElementRef,
  isView,
  business_trust_types,
  business_trusts_value_is_code,
  account_structures_available,
  cost_center,
  handleSelectBusinessGroup,
  handleSelectCompanyCode,
} = useBasicDataForm(props)
</script>
