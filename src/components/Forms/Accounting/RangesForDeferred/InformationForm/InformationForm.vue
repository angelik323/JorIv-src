<template>
  <q-form ref="informationFormRef">
    <section>
      <FiltersComponent
        v-if="isCreate"
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <VCard>
        <template #content-card>
          <div v-if="isCreate" class="q-pa-lg">
            <TableList
              :loading="tablePropertiesStructure.loading"
              :rows="tablePropertiesStructure.rows"
              :columns="tablePropertiesStructure.columns"
              :custom-columns="['radio_button']"
            >
              <template #radio_button="{ row }">
                <q-radio
                  v-model="selectedRowId"
                  :val="row.id"
                  color="orange"
                  @update:model-value="
                    (val) => handleRadioSelection(row.id, val)
                  "
                />
              </template>
            </TableList>
          </div>

          <VCard v-else>
            <template #content-card>
              <div class="q-pa-lg">
                <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                  <div class="col-12 col-md-6">
                    <p class="text-weight-bold q-mb-none">
                      {{ isEdit ? 'Estructura contable' : 'Código estructura' }}
                    </p>
                    <p class="text-grey-8">{{ structureLabel }}</p>
                  </div>

                  <div v-if="isView" class="col-12 col-md-6">
                    <p class="text-weight-bold q-mb-none">Finalidad</p>
                    <p class="text-grey-8">{{ purposeLabel }}</p>
                  </div>
                </div>

                <q-separator class="q-mt-md q-mb-lg" />

                <p class="text-weight-bold text-h6">
                  {{ tablePropertiesBusiness.title }}
                </p>
                <VCard>
                  <template #content-card>
                    <div class="q-pa-lg">
                      <TableList
                        :loading="tablePropertiesBusiness.loading"
                        :rows="tablePropertiesBusiness.rows"
                        :columns="tablePropertiesBusiness.columns"
                      />
                    </div>
                  </template>
                </VCard>
              </div>
            </template>
          </VCard>
        </template>
      </VCard>

      <NoDataState
        v-if="tablePropertiesBusiness.rows.length === 0"
        type="empty"
      />

      <section v-else>
        <div v-if="isCreate">
          <p class="text-weight-bold text-h6">
            {{ tablePropertiesBusiness.title }}
          </p>
          <VCard>
            <template #content-card>
              <div class="q-pa-lg">
                <TableList
                  :loading="tablePropertiesBusiness.loading"
                  :rows="tablePropertiesBusiness.rows"
                  :columns="tablePropertiesBusiness.columns"
                />
              </div>
            </template>
          </VCard>
        </div>

        <div class="flex justify-between items-start q-mb-md">
          <p class="text-weight-bold text-h6">
            {{ tablePropertiesRanges.title }}
          </p>

          <Button
            v-if="!isView"
            no-caps
            unelevated
            label="Agregar"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            color-icon="white"
            text-color="white"
            :outline="false"
            color="primary"
            @click="handleAddRow"
          />
        </div>
        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <TableList
                :loading="tablePropertiesRanges.loading"
                :rows="tablePropertiesRanges.rows"
                :columns="tablePropertiesRanges.columns"
                :custom-columns="[
                  'range_type',
                  'receipt_type',
                  'sub_receipt_types',
                  'nature',
                  'account_from',
                  'account_from_name',
                  'account_to',
                  'account_to_name',
                  'delete_button',
                ]"
              >
                <template #range_type="{ row }">
                  <div class="flex items-center justify-center">
                    <GenericSelectorComponent
                      v-if="isCreate || isEdit"
                      :manual_option="range_types"
                      map_options
                      required
                      auto_complete
                      :default_value="row.range_type"
                      @update:modelValue="row.range_type = $event"
                      :disabled="isView"
                      placeholder="Seleccione"
                      :rules="[]"
                    />
                    <p v-else class="text-grey-10 mb-0">
                      {{ row.range_type ?? '-' }}
                    </p>
                  </div>
                </template>

                <template #receipt_type="{ row }">
                  <div class="flex items-center justify-center">
                    <GenericSelectorComponent
                      v-if="isCreate || isEdit"
                      :manual_option="receipt_types"
                      map_options
                      required
                      auto_complete
                      :default_value="row.receipt_type"
                      @update:modelValue="
                        (val) => handleSelectReceiptType(row, val)
                      "
                      :disabled="isView"
                      :rules="[]"
                    />
                    <p v-else class="text-grey-10 mb-0">
                      {{ row.receipt_type ?? '-' }}
                    </p>
                  </div>
                </template>

                <template #sub_receipt_types="{ row }">
                  <div class="flex items-center justify-center">
                    <GenericSelectorComponent
                      v-if="isCreate || isEdit"
                      :manual_option="sub_receipt_types"
                      map_options
                      required
                      auto_complete
                      :default_value="row.sub_receipt_types"
                      @update:modelValue="row.sub_receipt_types = $event"
                      :disabled="isView"
                      :rules="[]"
                    />
                    <p v-else class="text-grey-10 mb-0">
                      {{ row.sub_receipt_types ?? '-' }}
                    </p>
                  </div>
                </template>

                <template #nature="{ row }">
                  <div class="flex items-center justify-center">
                    <GenericSelectorComponent
                      v-if="isCreate || isEdit"
                      :manual_option="natures"
                      map_options
                      required
                      auto_complete
                      :default_value="row.nature"
                      @update:modelValue="row.nature = $event"
                      :disabled="isView"
                      :rules="[]"
                    />
                    <p v-else class="text-grey-10 mb-0">
                      {{ row.nature ?? '-' }}
                    </p>
                  </div>
                </template>

                <template #account_from="{ row }">
                  <div class="flex items-center justify-center">
                    <GenericSelectorComponent
                      v-if="isCreate || isEdit"
                      :manual_option="accounts_from"
                      map_options
                      required
                      auto_complete
                      :default_value="row.account_from"
                      @update:modelValue="
                        (val) => handleSelectAccountFrom(row, val)
                      "
                      :disabled="isView"
                      :rules="[]"
                    />
                    <p v-else class="text-grey-10 mb-0">
                      {{ row.account_from ?? '-' }}
                    </p>
                  </div>
                </template>

                <template #account_from_name="{ row }">
                  <div class="flex items-center justify-center">
                    <GenericInputComponent
                      v-if="isCreate || isEdit"
                      :default_value="row.account_from_name"
                      placeholder="Nombre de cuenta"
                      type="text"
                      disabled
                      :class_name="'q-pb-none'"
                    />
                    <p v-else class="text-grey-10 mb-0">
                      {{ row.account_from_name ?? '-' }}
                    </p>
                  </div>
                </template>

                <template #account_to="{ row }">
                  <div class="flex items-center justify-center">
                    <GenericSelectorComponent
                      v-if="isCreate || isEdit"
                      :manual_option="accounts_to"
                      map_options
                      required
                      auto_complete
                      :default_value="row.account_to"
                      @update:modelValue="
                        (val) => handleSelectAccountTo(row, val)
                      "
                      :disabled="isView"
                      :rules="[]"
                    />
                    <p v-else class="text-grey-10 mb-0">
                      {{ row.account_to ?? '-' }}
                    </p>
                  </div>
                </template>

                <template #account_to_name="{ row }">
                  <div class="flex items-center justify-center">
                    <GenericInputComponent
                      v-if="isCreate || isEdit"
                      :default_value="row.account_to_name"
                      placeholder="Nombre de cuenta"
                      type="text"
                      disabled
                      :class_name="'q-pb-none'"
                    />
                    <p v-else class="text-grey-10 mb-0">
                      {{ row.account_to_name ?? '-' }}
                    </p>
                  </div>
                </template>

                <template #delete_button="{ row }" v-if="isCreate || isEdit">
                  <Button
                    :left-icon="defaultIconsLucide.trash"
                    color-icon="#f45100"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    :tooltip="'Eliminar'"
                    @click="handleDeleteRow(row.id)"
                  />
                </template>
              </TableList>

              <div
                class="row justify-end q-gutter-md q-mt-xl"
                aria-label="Botones"
              >
                <Button
                  :outline="false"
                  :label="
                    isCreate ? 'Crear' : isEdit ? 'Actualizar' : 'Finalizar'
                  "
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  :disabled="!isFormValid"
                  @click="handleSubmitForm"
                />
              </div>
            </div>
          </template>
        </VCard>
      </section>
    </section>
  </q-form>
</template>

<script setup lang="ts">
//Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
//Interfaces
import { ActionType } from '@/interfaces/global'
//Logic
import useInformationForm from '@/components/Forms/Accounting/RangesForDeferred/InformationForm/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    id?: string
  }>(),
  {}
)

const {
  isView,
  isEdit,
  natures,
  isCreate,
  isFormValid,
  accounts_to,
  range_types,
  purposeLabel,
  filterConfig,
  accounts_from,
  receipt_types,
  selectedRowId,
  tablePropertiesRanges,
  structureLabel,
  sub_receipt_types,
  informationFormRef,
  defaultIconsLucide,
  tablePropertiesStructure,
  tablePropertiesBusiness,

  handleDeleteRow,
  handleSubmitForm,
  handleClearFilters,
  handleRadioSelection,
  handleSelectAccountTo,
  handleFilter,
  handleAddRow,
  handleSelectReceiptType,
  handleSelectAccountFrom,
} = useInformationForm(props)

defineExpose({
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
