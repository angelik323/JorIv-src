<template>
  <q-form ref="information_form_ref">
    <!-- section: add items form -->
    <section v-if="isEditable">
      <q-form ref="item_form_ref">
        <div class="row q-col-gutter-md q-mb-md">
          <!-- business -->
          <div class="col-12 col-md-3">
            <GenericSelector
              :default_value="currentItem.business_trust_id"
              label="Negocio"
              :required="true"
              :manual_option="businessTrustOptions"
              :map_options="true"
              :auto_complete="true"
              placeholder="Seleccione negocio"
              :rules="[
                  (v: number) =>
                    useRules().is_required(String(v ?? ''), 'El negocio es requerido')
                ]"
              @update:model-value="currentItem.business_trust_id = $event"
            />
          </div>

          <!-- third party -->
          <div class="col-12 col-md-3">
            <GenericSelector
              :default_value="currentItem.third_party_id"
              label="Tercero/Proveedor"
              :required="true"
              :manual_option="thirdPartyOptions"
              :map_options="true"
              :auto_complete="true"
              placeholder="Buscar por documento o nombre"
              :rules="[
                  (v: number) =>
                    useRules().is_required(String(v ?? ''), 'El tercero/proveedor es requerido')
                ]"
              @update:model-value="currentItem.third_party_id = $event"
            />
          </div>

          <!-- quantity -->
          <div class="col-12 col-md-3">
            <GenericInput
              :default_value="currentItem.quantity"
              label="Cantidad"
              :required="true"
              type="number"
              placeholder="Ingrese cantidad (1-1000)"
              :rules="[
                  (v: number) =>
                    useRules().is_required(String(v ?? ''), 'La cantidad es requerida'),
                  (v: number) =>
                    useRules().only_number(String(v ?? '')),
                  (v: number) => useRules().max_value(v ?? 0, 1000),
                  (v: number) => useRules().min_value(v ?? 0, 1)
                ]"
              @update:model-value="currentItem.quantity = $event != null ? Number($event) : null"
            />
          </div>
          <!-- type -->
          <div class="col-12 col-md-3">
            <GenericSelector
              :default_value="currentItem.configuration_type_id"
              label="Tipo activo fijo/bien"
              :required="true"
              :manual_option="configurationTypeOptions"
              :map_options="true"
              :auto_complete="true"
              placeholder="Seleccione tipo"
              :rules="[
                  (v: number) =>
                    useRules().is_required(String(v ?? ''), 'El tipo es requerido')
                ]"
              @update:model-value="currentItem.configuration_type_id = $event"
            />
          </div>

          <!-- subtype -->
          <div class="col-12 col-md-3">
            <GenericSelector
              :default_value="currentItem.configuration_subtype_id"
              label="Subtipo activo fijo/bien"
              :required="true"
              :manual_option="filteredSubtypes"
              :map_options="true"
              :auto_complete="true"
              placeholder="Seleccione subtipo"
              :disabled="!currentItem.configuration_type_id"
              :rules="[
                  (v: number) =>
                    useRules().is_required(String(v ?? ''), 'El subtipo es requerido')
                ]"
              @update:model-value="currentItem.configuration_subtype_id = $event"
            />
          </div>

          <!-- value -->
          <div class="col-12 col-md-3">
            <GenericInput
              :default_value="currentItem.value"
              label="Valor"
              :required="true"
              type="number"
              additional_characters="."
              placeholder="Ej: 1500.75"
              :rules="[
                  (v: number) =>
                    useRules().is_required(String(v ?? ''), 'El valor es requerido'),
                  (v: number) =>
                    useRules().only_number_with_max_integers_and_decimals_with_dot(
                      String(v ?? ''),
                      MAX_VALUE_INTEGERS,
                      MAX_VALUE_DECIMALS
                    ),
                  (v: number) =>
                    useRules().not_less_or_equal_to_zero(String(v ?? ''))
                ]"
              @update:model-value="currentItem.value = $event != null ? Number($event) : null"
            />
          </div>
          <!-- detail -->
          <div class="col-12 col-md-3">
            <GenericInput
              :default_value="currentItem.detail"
              label="Detalle"
              :required="false"
              type="text"
              :max_length="String(MAX_DETAIL_LENGTH)"
              placeholder="Descripción del item (opcional, máx. 300 caracteres)"
              :rules="[
                  (v: string) => {
                    if (v && v.length > 0 && v.length < MIN_DETAIL_LENGTH) {
                      return `El detalle debe tener al menos ${MIN_DETAIL_LENGTH} caracteres`
                    }
                    return true
                  },
                  (v: string) => useRules().max_length(v || '', MAX_DETAIL_LENGTH)
                ]"
              @update:model-value="currentItem.detail = $event"
            />
          </div>
        </div>

        <!-- button add -->
        <div class="col-12 col-md-4 flex items-end justify-end">
          <Button
            no-caps
            unelevated
            label="Agregar"
            :leftIcon="defaultIconsLucide.plusCircle"
            :color-icon="'white'"
            :text-color="'white'"
            :outline="false"
            :color="'primary'"
            :tooltip="canAddMoreItems ? 'Agregar item' : `Máximo ${MAX_ITEMS} items permitidos`"
            :disable="!canAddMoreItems"
            @click="addItem"
          />
        </div>
      </q-form>

      <q-separator class="q-my-md" />
    </section>

    <!-- section: items table -->
    <section>
      <div class="row items-center justify-between q-mb-md">
        <div class="col-auto">
          <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
            Listado de items de la orden de compra
            <span class="text-grey-6 text-body2">({{ items.length }}/{{ MAX_ITEMS }})</span>
          </p>
        </div>
      </div>
      <TableList
        :loading="itemsTableProps.loading"
        :columns="itemsTableProps.columns"
        :rows="itemsTableProps.rows"
        :custom-columns="[
          'index',
          'business_trust',
          'third_party',
          'quantity',
          'configuration_type',
          'configuration_subtype',
          'value',
          'detail',
          ...(isEditable ? ['actions'] : [])
        ]"
        :row-key="'_uid'"
        custom-no-data-message-title="No hay items agregados"
        custom-no-data-message-subtitle="Agregue items utilizando el formulario superior"
        class="q-mx-md"
        :hide-pagination="true"
      >
        <template #index="{ index }">
          <div class="q-pa-sm text-center">
            <span>{{ index + 1 }}</span>
          </div>
        </template>

        <template #business_trust="{ row }">
          <div class="q-pa-sm">
            <span>{{ row.business_trust_label || '-' }}</span>
          </div>
        </template>

        <template #third_party="{ row }">
          <div class="q-pa-sm">
            <span>{{ row.third_party_label || '-' }}</span>
          </div>
        </template>

        <template #quantity="{ row }">
          <div class="q-pa-sm text-center">
            <span>{{ row.quantity }}</span>
          </div>
        </template>

        <template #configuration_type="{ row }">
          <div class="q-pa-sm">
            <span>{{ row.configuration_type_label || '-' }}</span>
          </div>
        </template>

        <template #configuration_subtype="{ row }">
          <div class="q-pa-sm">
            <span>{{ row.configuration_subtype_label || '-' }}</span>
          </div>
        </template>

        <template #value="{ row }">
          <div class="q-pa-sm text-right">
            <span>{{ formatCurrency(row.value) }}</span>
          </div>
        </template>

        <template #detail="{ row }">
          <div class="q-pa-sm">
            <span class="ellipsis-2-lines">{{ row.detail || '-' }}</span>
          </div>
        </template>

        <template #actions="{ row }">
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Eliminar item'"
            @click="openDeleteItemModal(row)"
          />
        </template>
      </TableList>
    </section>

    <!-- section: total value -->
    <section class="q-mt-lg">
      <div class="row items-center">
        <div class="column">
          <span class="text-weight-bold"> Valor total </span>
          <span class="text-body26">{{ formatCurrency(totalValue) }} </span>
        </div>
      </div>
    </section>
  </q-form>

  <!-- modal delete -->
  <AlertModalComponent
    ref="deleteModalRef"
    styleModal="max-width: 470px"
    :showImgDefault="true"
    title="¿Está seguro de eliminar este item?"
    :description_message="''"
    @confirm="confirmDeleteItem"
  />
</template>

<script setup lang="ts">
// components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import {
  IBuyOrderFixedAssetsForm,
  IBuyOrderFixedAssetsList
} from '@/interfaces/customs/fixed-assets/BuyOrderFixedAssets'

// composables
import { useRules } from '@/composables'

// logic
import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBuyOrderFixedAssetsList | null
  }>(),
  {}
)

const emits = defineEmits<(e: 'update:model', value: IBuyOrderFixedAssetsForm | null) => void>()

const {
  // Refs
  information_form_ref,
  item_form_ref,
  deleteModalRef,
  model,
  currentItem,

  // Options
  businessTrustOptions,
  thirdPartyOptions,
  configurationTypeOptions,
  filteredSubtypes,

  // Computed
  isEditable,
  items,
  canAddMoreItems,
  totalValue,
  hasChanges,

  // Table
  itemsTableProps,

  // Utils
  defaultIconsLucide,

  // Constants
  MAX_ITEMS,
  MAX_VALUE_INTEGERS,
  MAX_VALUE_DECIMALS,
  MAX_DETAIL_LENGTH,
  MIN_DETAIL_LENGTH,

  // Methods
  addItem,
  openDeleteItemModal,
  confirmDeleteItem,
  validateForm,
  getRequestData,
  formatCurrency
} = useInformationForm(props, emits)

defineExpose({
  validateForm,
  model,
  getRequestData,
  hasChanges
})
</script>
