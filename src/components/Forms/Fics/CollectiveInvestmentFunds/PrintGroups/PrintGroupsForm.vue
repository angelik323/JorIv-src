<template>
  <q-form
    ref="printGroupsFormRef"
    class="q-pa-lg"
    aria-label="Formulario de grupos de impresión"
  >
    <section>
      <div
        class="flex justify-between items-start q-mb-md"
        aria-label="Tabla de grupos de impresión"
      >
        <p class="text-weight-bold text-h6">
          {{ tableProps.title }}
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
          @click="handleOpenModal('create')"
        />
      </div>

      <VCard>
        <template #content-card>
          <div
            v-if="tableProps.rows.length === 0"
            class="flex column justify-center items-center items-center q-py-xl"
          >
            <img
              src="@/assets/images/icons/no_data_accounting.svg"
              class="q-mb-lg"
              alt="Sin datos disponibles"
            />

            <p class="text-weight-bold text-h6 text-center">
              Actualmente no hay grupos de impresión
            </p>

            <p class="text-weight-light text-h6 text-center">
              Por favor, agregue uno para continuar con el proceso
            </p>
          </div>

          <div class="q-pa-lg" v-else>
            <TableList
              hidePagination
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :custom-columns="['actions']"
            >
              <template #actions="{ row }">
                <Button
                  flat
                  left-icon="Pencil"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  colorIcon="#f45100"
                  :tooltip="'Editar'"
                  @click="handleOpenModal('edit', row.code)"
                />
              </template>
            </TableList>
          </div>
        </template>
      </VCard>

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
                  isEditing
                    ? 'Editar grupo de impresión'
                    : 'Agregar grupo de impresión'
                }}
              </p>

              <div class="col q-col-gutter-sm">
                <GenericInputComponent
                  label="Código"
                  :default_value="modalData.code"
                  placeholder="Inserte"
                  class_name="q-pt-none"
                  type="text"
                  required
                  disabled
                  :rules="[
                    (val: string) => useRules().is_required(val, 'El codigo es requerido'),
                    (val: string) => useRules().max_length(val, 3),
                    (val: string) => useRules().min_length(val, 1),
                    (val: string) => useRules().only_number(val),
                  ]"
                  @update:model-value="modalData.code = $event"
                />

                <GenericInputComponent
                  label="Descripción"
                  :default_value="modalData.description"
                  placeholder="Inserte"
                  class_name="q-pt-none"
                  type="text"
                  required
                  :disabled="isEditing && isEdit"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'La descripción es requerida'),
                    (val: string) => useRules().only_alphanumeric(val),
                    (val: string) => useRules().max_length(val,20),
                  ]"
                  @update:model-value="modalData.description = $event"
                />

                <GenericSelectorComponent
                  label="Tipos de envío"
                  :default_value="modalData.send_type"
                  placeholder="Seleccione"
                  required
                  :manual_option="send_types"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'El tipo de envío es requerido'),
                  ]"
                  @update:model-value="modalData.send_type = $event"
                />
              </div>

              <div class="row q-mt-lg flex justify-center">
                <Button
                  label="Cancelar"
                  color="orange"
                  class="text-capitalize btn-filter custom q-mr-md"
                  :outline="true"
                  @click="handleCloseModal"
                />

                <Button
                  :outline="false"
                  :label="isEditing ? 'Actualizar' : 'Agregar'"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  :disabled="isFormValid"
                  @click="handleAddRow"
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
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { IPrintGroup } from '@/interfaces/customs/fics/CollectiveInvestmentFunds'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import usePrintGroupsForm from '@/components/Forms/Fics/CollectiveInvestmentFunds/PrintGroups/PrintGroupsForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPrintGroup[]
  }>(),
  {}
)

const {
  isView,
  isEdit,
  getValues,
  modalData,
  isEditing,
  send_types,
  tableProps,
  isFormValid,
  addModalRef,
  validateForm,
  handleAddRow,
  modalFormRef,
  handleOpenModal,
  handleCloseModal,
  defaultIconsLucide,
  printGroupsFormRef,
} = usePrintGroupsForm(props)

defineExpose({ getValues, validateForm })
</script>
