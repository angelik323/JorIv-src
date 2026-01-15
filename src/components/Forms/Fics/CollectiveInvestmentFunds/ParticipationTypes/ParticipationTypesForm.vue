<template>
  <q-form
    ref="participationTypesFormRef"
    class="q-pa-lg"
    aria-label="Formulario de tipos de participación"
  >
    <section>
      <div
        class="flex justify-between items-start q-mb-md"
        aria-label="Tabla de línea de negocio"
      >
        <p class="text-weight-bold text-h6">
          {{ tablePropsBusiness.title }}
        </p>

        <Button
          v-if="!isView"
          no-caps
          unelevated
          label="Agregar"
          :leftIcon="defaultIconsLucide.plusCircleOutline"
          :color-icon="'white'"
          :text-color="'white'"
          :outline="false"
          :color="'primary'"
          :tooltip="'Agregar'"
          @click="handleOpenModal('business')"
        />
      </div>

      <VCard>
        <template #content-card>
          <div class="q-pa-lg">
            <TableList
              hidePagination
              :loading="tablePropsBusiness.loading"
              :columns="tablePropsBusiness.columns"
              :rows="tablePropsBusiness.rows"
              :custom-columns="['checkbox', 'actions']"
            >
              <template #checkbox="{ row }">
                <q-radio
                  v-model="selectedRowIdBusiness"
                  :val="row.business_line_id"
                  dense
                  color="orange"
                />
              </template>
              <template #actions="{ row }">
                <Button
                  :disabled="isView || isEdit"
                  :left-icon="defaultIconsLucide.delete"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Eliminar"
                  @click="deleteBusinessLinesTable(row)"
                />
              </template>
            </TableList>
          </div>
        </template>
      </VCard>

      <NoDataState
        v-if="!selectedRowIdBusiness && tablePropsTypes.rows.length === 0"
        type="empty"
      />

      <div v-else>
        <div class="flex justify-between items-start q-mb-md">
          <p class="text-weight-bold text-h6">
            {{ tablePropsTypes.title }}
          </p>

          <Button
            v-if="!isView"
            no-caps
            unelevated
            :label="'Agregar'"
            :leftIcon="defaultIconsLucide.plusCircleOutline"
            :color-icon="'white'"
            :text-color="'white'"
            :outline="false"
            :color="'primary'"
            :tooltip="'Agregar'"
            @click="handleOpenModal('types')"
          />
        </div>

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <TableList
                hidePagination
                :loading="tablePropsTypes.loading"
                :columns="tablePropsTypes.columns"
                :rows="tablePropsTypes.rows"
                :custom-columns="['actions']"
              >
                <template #actions="{ row, index }">
                  <Button
                    flat
                    left-icon="Pencil"
                    Collective
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    colorIcon="#f45100"
                    :tooltip="'Editar'"
                    @click="handleOpenModal('types', 'edit', row.id)"
                  />

                  <Button
                    v-if="index === tablePropsTypes.rows.length - 1 && !isEdit"
                    flat
                    left-icon="Trash"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    colorIcon="#f45100"
                    :tooltip="'Eliminar'"
                    @click="handleDeleteRow(index)"
                  />
                </template>
              </TableList>
            </div>
          </template>
        </VCard>
      </div>

      <AlertModalComponent
        ref="addModalRef"
        styleModal="max-width: 500px; width: 100%;"
        :showBtnConfirm="false"
        :showBtnCancel="false"
        :showImgDefault="false"
        :showCloseBtn="true"
      >
        <template #default-body>
          <q-form ref="modalFormRef">
            <div class="q-mx-lg q-col-gutter-md">
              <p class="text-h5 text-weight-bold">
                {{
                  modalType === 'business'
                    ? 'Agregar línea de negocio'
                    : isEditing
                    ? 'Editar tipo de participación'
                    : 'Agregar tipo de participación'
                }}
              </p>

              <div class="col q-col-gutter-sm">
                <GenericSelectorComponent
                  :label="
                    modalType === 'business'
                      ? 'Línea de negocio'
                      : 'Tipo de participación'
                  "
                  :default_value="
                    modalType === 'business'
                      ? modalData.business_line_id
                      : modalData.participation_types[0].participation_type_id
                  "
                  placeholder="Seleccione"
                  required
                  :manual_option="
                    modalType === 'business'
                      ? business_lines_active
                      : pt_not_consolidated_without_fund
                  "
                  map_options
                  first_filter_option="label"
                  second_filter_option="label"
                  auto_complete
                  :disabled="isEditing && isEdit"
                  :rules="[
                    (val: string) => useRules().is_required(val, modalType === 'business' ? 'La línea de negocio es requerida' : 'El tipo de participación es requerido'),
                    (val: string) => useRules().only_alphanumeric(val)
                  ]"
                  @update:modelValue="
                    modalType === 'business'
                      ? (modalData.business_line_id = $event)
                      : (modalData.participation_types[0].participation_type_id =
                          $event)
                  "
                />

                <GenericInputComponent
                  v-if="modalType === 'types'"
                  label="Saldo mínimo"
                  :default_value="
                    modalData.participation_types[0].minimun_balance
                  "
                  placeholder="0"
                  class_name="q-pt-none"
                  type="text"
                  required
                  disabled
                  :rules="[
                    (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 2),
                    (val: string) => useRules().is_required(val, 'El saldo mínimo es requerido')
                  ]"
                  @update:model-value="
                    modalData.participation_types[0].minimun_balance = $event
                  "
                />
                <GenericInputComponent
                  v-if="modalType === 'types'"
                  label="Saldo máximo"
                  :default_value="
                    modalData.participation_types[0].maximun_balance
                  "
                  placeholder="Inserte"
                  class_name="q-pt-none"
                  type="text"
                  required
                  :disabled="isEditing && isEdit"
                  :rules="[
                    (val: string) => useRules().only_number_with_max_integers_and_decimals(val, 15, 2),
                    (val: string) => useRules().is_required(val, 'El saldo máximo es requerido')
                  ]"
                  @update:model-value="
                    modalData.participation_types[0].maximun_balance = $event
                  "
                />
                <GenericInputComponent
                  v-if="
                    modalType === 'types' &&
                    participation_types_term_days_active
                  "
                  label="Días de plazo"
                  :default_value="modalData.participation_types[0].term_days"
                  placeholder="Inserte"
                  class_name="q-pt-none"
                  type="text"
                  required
                  :rules="[
                    (val: string) => useRules().is_required(val, 'Los días de plazo son requeridos'),
                    (val: string) => useRules().only_number(val)
                  ]"
                  :disabled="isEditing && isEdit"
                  @update:model-value="
                    modalData.participation_types[0].term_days = $event
                  "
                />

                <GenericSelectorComponent
                  v-if="modalType === 'types'"
                  label="Comisión"
                  :default_value="
                    modalData.participation_types[0].commission_id
                  "
                  placeholder="Seleccione"
                  map_options
                  required
                  :manual_option="fiduciary_commissions_fixed"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'La comisión es requerida')
                  ]"
                  @update:modelValue="
                    modalData.participation_types[0].commission_id = $event
                  "
                />
              </div>

              <div class="row q-mt-lg flex justify-center">
                <Button
                  outline
                  label="Cancelar"
                  color="orange"
                  class="text-capitalize btn-filter custom q-mr-md"
                  @click="handleCloseModal"
                />

                <Button
                  :outline="false"
                  :label="isEditing ? 'Actualizar' : 'Agregar'"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleAddRow"
                  :disabled="!isFormValid"
                />
              </div>
            </div>
          </q-form>
        </template>
      </AlertModalComponent>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { IBusinessParticipationType } from '@/interfaces/customs/fics/CollectiveInvestmentFunds'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import useParticipationTypesForm from '@/components/Forms/Fics/CollectiveInvestmentFunds/ParticipationTypes/ParticipationTypesForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IBusinessParticipationType[]
  }>(),
  {}
)

const {
  isView,
  isEdit,
  modalData,
  isEditing,
  modalType,
  getValues,
  isFormValid,
  addModalRef,
  validateForm,
  handleAddRow,
  modalFormRef,
  tablePropsTypes,
  handleOpenModal,
  handleCloseModal,
  handleDeleteRow,
  defaultIconsLucide,
  tablePropsBusiness,
  selectedRowIdBusiness,
  business_lines_active,
  participationTypesFormRef,
  fiduciary_commissions_fixed,
  pt_not_consolidated_without_fund,
  participation_types_term_days_active,
  deleteBusinessLinesTable,
} = useParticipationTypesForm(props)

defineExpose({
  getValues,
  validateForm,
})
</script>
