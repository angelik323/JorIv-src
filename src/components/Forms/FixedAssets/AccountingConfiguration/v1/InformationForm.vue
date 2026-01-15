<template>
  <section>
    <q-form ref="informationFormRef">
      <div class="row q-col-gutter-md">
        <div
          class="col-xs-12 col-sm-12 col-md-4"
          :class="showAudit ? 'col-lg-3' : 'col-lg-4'"
        >
          <GenericDateInputComponent
            v-if="action !== 'view'"
            disabled
            label="Fecha de creación"
            :default_value="models.created_at"
            :rules="[]"
          />
          <div v-else>
            <p class="q-mb-sm text-weight-bold">Fecha de creación</p>
            <p>{{ models.created_at ?? 'Sin fecha' }}</p>
          </div>
        </div>
        <template v-if="showAudit">
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
            <GenericInputComponent
              v-if="action !== 'view'"
              disabled
              label="Creado por"
              placeholder="N/A"
              :default_value="models.created_by_user?.full_name"
              :rules="[]"
            />
            <div v-else>
              <p class="q-mb-sm text-weight-bold">Creado por</p>
              <p>{{ models.created_by_user?.full_name ?? 'Sin usuario' }}</p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
            <GenericDateInputComponent
              v-if="action !== 'view'"
              disabled
              label="Fecha de actualización"
              :default_value="models.updated_at"
              :rules="[]"
            />
            <div v-else>
              <p class="q-mb-sm text-weight-bold">Fecha de actualización</p>
              <p>{{ models.updated_at ?? 'Sin fecha' }}</p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
            <GenericInputComponent
              v-if="action !== 'view'"
              disabled
              label="Actualizado por"
              placeholder="N/A"
              :default_value="models.updated_by_user?.full_name"
              :rules="[]"
            />
            <div v-else>
              <p class="q-mb-sm text-weight-bold">Actualizado por</p>
              <p>{{ models.updated_by_user?.full_name ?? 'Sin usuario' }}</p>
            </div>
          </div>
        </template>
        <div class="flex col-12 items-center justify-between">
          <div>
            <p class="text-h7 q-mb-none">Fuente</p>
          </div>
          <div>
            <RadioYesNo
              v-model="models.source"
              :is-disabled="showAudit"
              :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
              :has-title="false"
              :options="type"
            />
          </div>
        </div>
      </div>

      <q-separator class="q-mb-md" />

      <section class="q-mt-lg">
        <div class="q-mb-md">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Listado de negocios
          </p>
        </div>
        <Card customStyle="margin-bottom: 0">
          <template #content-card>
            <div class="row q-col-gutter-md q-px-lg q-pb-lg q-pt-lg">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
                <GenericSelectorComponent
                  required
                  label="Negocio"
                  map_options
                  auto_complete
                  first_filter_option="label"
                  :disabled="disableAllForm"
                  :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
                  :default_value="models.business_trust_code"
                  :manual_option="business_trusts"
                  @update:modelValue="models.business_trust_id = $event"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
                <GenericInputComponent
                  label="Descripción negocio"
                  disabled
                  type="text"
                  placeholder="Seleccione un negocio"
                  :default_value="models.business_description"
                />
              </div>
            </div>
          </template>
        </Card>
      </section>

      <q-separator class="q-my-md" />

      <section class="q-mt-lg">
        <div class="q-mb-md">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Bloque contable y centro de costo
            <q-spinner v-if="isLoadingStructures" color="primary" size="20px" />
          </p>
        </div>
        <Card customStyle="margin-bottom: 0">
          <template #content-card>
            <div class="row q-col-gutter-md q-px-lg q-pb-lg q-pt-lg">
              <div
                v-if="models.code"
                class="col-xs-12 col-sm-12 col-md-6 col-lg-4"
              >
                <GenericInputComponent
                  v-if="action !== 'view'"
                  required
                  disabled
                  label="Consecutivo"
                  :rules="[]"
                  :default_value="models.code"
                />
                <div v-else>
                  <p class="text-weight-bold q-mb-sm">Consecutivo</p>
                  <p>
                    {{ models.code ?? '-' }}
                  </p>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                <GenericInputComponent
                  v-if="action !== 'view'"
                  required
                  disabled
                  label="Estructura contable"
                  :rules="[]"
                  :default_value="models.account_structures_description"
                  :placeholder="isLoadingStructures ? 'Cargando...' : 'N/A'"
                />
                <div v-else>
                  <p class="text-weight-bold q-mb-sm">Estructura contable</p>
                  <p>
                    {{ models.account_structures_description ?? '-' }}
                  </p>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                <GenericInputComponent
                  v-if="action !== 'view'"
                  required
                  disabled
                  label="Estructura centro de costos"
                  :placeholder="isLoadingStructures ? 'Cargando...' : 'N/A'"
                  :rules="[]"
                  :default_value="models.cost_centers_structures_description"
                />
                <div v-else>
                  <p class="text-weight-bold q-mb-sm">
                    Estructura centro de costos
                  </p>
                  <p>
                    {{ models.cost_centers_structures_description ?? '-' }}
                  </p>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                <GenericSelectorComponent
                  v-if="action !== 'view'"
                  required
                  label="Tipo de comprobante"
                  :placeholder="
                    isLoadingStructures ? 'Cargando...' : 'Seleccione'
                  "
                  :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
                  :default_value="models.receipt_type_description"
                  :manual_option="receipt_types_with_sub_types"
                  @update:modelValue="models.receipt_type_id = $event"
                />
                <div v-else>
                  <p class="text-weight-bold q-mb-sm">Tipo de comprobante</p>
                  <p>
                    {{ models.receipt_type_description ?? '-' }}
                  </p>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                <GenericSelectorComponent
                  v-if="action !== 'view'"
                  required
                  label="Subtipo de comprobante"
                  :placeholder="
                    isLoadingStructures ? 'Cargando...' : 'Seleccione'
                  "
                  :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
                  :default_value="models.receipt_subtype_description"
                  :manual_option="filteredReceiptSubtypes"
                  @update:modelValue="models.receipt_subtype_id = $event"
                />
                <div v-else>
                  <p class="text-weight-bold q-mb-sm">Subtipo de comprobante</p>
                  <p>
                    {{ models.receipt_subtype_description ?? '-' }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </section>

      <q-separator class="q-my-md" />

      <section class="q-mt-lg">
        <div class="q-mb-md">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Tipo y subtipo de activo fijo o bien
          </p>
        </div>
        <Card customStyle="margin-bottom: 0">
          <template #content-card>
            <div class="row q-col-gutter-md q-px-lg q-pb-lg q-pt-lg">
              <div class="col-xs-12 col-sm-6 col-lg-3">
                <GenericSelectorComponent
                  v-if="action !== 'view'"
                  required
                  label="Código tipo"
                  map_options
                  auto_complete
                  first_filter_option="label"
                  :disabled="disableAllForm"
                  :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
                  :default_value="models.configuration_type_code"
                  :manual_option="configuration_type"
                  @update:modelValue="models.configuration_type_id = $event"
                />
                <div v-else>
                  <p class="text-weight-bold q-mb-sm">Código tipo</p>
                  <p>
                    {{ models.configuration_type_code ?? '-' }}
                  </p>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6 col-lg-3">
                <GenericInputComponent
                  v-if="action !== 'view'"
                  required
                  disabled
                  label="Descripción"
                  type="text"
                  placeholder="Seleccione un tipo"
                  :default_value="models.type_description"
                />
                <div v-else>
                  <p class="text-weight-bold q-mb-sm">Descripción tipo</p>
                  <p>
                    {{ models.type_description ?? '-' }}
                  </p>
                </div>
              </div>

              <div class="col-xs-12 col-sm-6 col-lg-3">
                <GenericSelectorComponent
                  v-if="action !== 'view'"
                  required
                  label="Código subtipo"
                  map_options
                  auto_complete
                  first_filter_option="label"
                  :disabled="disableAllForm || !models.configuration_type_id"
                  :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
                  :default_value="models.configuration_subtype_code"
                  :manual_option="filteredSubtypes"
                  @update:modelValue="models.configuration_subtype_id = $event"
                />
                <div v-else>
                  <p class="text-weight-bold q-mb-sm">Código subtipo</p>
                  <p>
                    {{ models.configuration_subtype_code ?? '-' }}
                  </p>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6 col-lg-3">
                <GenericInputComponent
                  v-if="action !== 'view'"
                  required
                  disabled
                  label="Descripción subtipo"
                  type="text"
                  placeholder="Seleccione un subtipo"
                  :default_value="models.subtype_description"
                />
                <div v-else>
                  <p class="text-weight-bold q-mb-sm">Descripción subtipo</p>
                  <p>
                    {{ models.subtype_description ?? '-' }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </section>
    </q-form>

    <q-separator class="q-my-md" />

    <AccountingParametersList
      v-if="models.accounting_parameters"
      ref="accountingParametersListRef"
      v-model="models.accounting_parameters"
      showAccountingSettingsError
      :action
      :show_errors="showAccountingSettingsError"
      :disableAllForm
      :configuration_novelty_types="novelty"
      :debit_nature="transaction_side"
      class="q-mb-md"
    />
  </section>
</template>

<script setup lang="ts">
// interfaces
import { ActionType } from '@/interfaces/global'
import { IAccountingConfigurationForm } from '@/interfaces/customs/fixed-assets/v1/AcountingConfiguration'

// components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import Card from '@/components/common/VCard/VCard.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

import AccountingParametersList from '@/components/Forms/FixedAssets/AccountingConfiguration/v1/AccountingParametersList/AccountingParametersList.vue'

// logic
import useInformationForm from '@/components/Forms/FixedAssets/AccountingConfiguration/v1/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IAccountingConfigurationForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IAccountingConfigurationForm | null): void
}>()

const {
  models,
  showAudit,
  disableAllForm,
  accountingParametersListRef,
  informationFormRef,
  showAccountingSettingsError,
  isLoadingStructures,

  type,
  configuration_type,
  transaction_side,
  novelty,
  business_trusts,
  filteredSubtypes,
  receipt_types_with_sub_types,
  filteredReceiptSubtypes,

  is_required,
  hasAtLeastOneCompletedSetting,
  validateAllForms,
} = useInformationForm(props, emits)

defineExpose({
  validateAllForms,
  hasAtLeastOneCompletedSetting,
})
</script>
