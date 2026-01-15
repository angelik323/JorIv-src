<template>
  <div class="mx-3 mt-2 mb-3">
    <TableList
      :title="tableProps.rows.length > 0 ? tableProps.title : ''"
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :hideHeader="tableProps.rows.length === 0"
      :custom-columns="['checked', 'transfer_percentage']"
      :class="'q-pt-lg amounts-table'"
    >
      <template #checked="{ row }">
        <div class="px-1 flex justify-center">
          <q-radio
            :val="row.id"
            v-model="selectedThirdId"
            dense
            size="sm"
            color="orange"
            :disable="!['create', 'edit'].includes(action)"
          />
        </div>
      </template>
      <template #transfer_percentage="{ row }">
        <GenericInput
          v-if="['create', 'edit'].includes(action)"
          :type="'text'"
          :required="row.id === selectedThirdId"
          :default_value="participations[row.id]"
          placeholder="%"
          :rules="
            row.id === selectedThirdId
              ? [
                  (v: string) =>
                    useRules().is_required(v, 'El porcentaje es requerido'),
                  (v: string) => useRules().not_less_or_equal_to_zero(v),
                  (v: string) => useRules().has_maximum_n_decimals(v, 10),
                  (v: string) => useRules().max_value(v, 100),
                ]
              : []
          "
          :min_value="1"
          :max_value="100"
          :readonly="row.id !== selectedThirdId"
          @update:model-value="
            (val) => {
              const formatted = val?.replace(/,/g, '.')
              onChangeParticipation(row.id, formatted)
            }
          "
        />
        <div class="flex justify-center items-center" v-else>
          <p class="q-my-none">
            {{ participations[row.id] }}
          </p>
        </div>
      </template>
    </TableList>
  </div>

  <div v-if="selectedThirdId && participations[selectedThirdId] && participations[selectedThirdId] > 0 && participations[selectedThirdId] <= 100">
    <div class="mx-3 mt-0 mb-3">
      <TableList
        :title="tablePropsAssignees.title"
        :loading="tablePropsAssignees.loading"
        :columns="tablePropsAssignees.columns"
        :rows="paginatedAssignees"
        :pages="tablePropsAssignees.pages"
        @updatePage="(val) => (tablePropsAssignees.pages.currentPage = val)"
        @updateRowsPerPage="
          (val) => {
            pageSizeAssignees = val
            tablePropsAssignees.pages.currentPage = 1
          }
        "
        :custom-columns="['id', 'received_percentage', 'actions']"
        :class="'q-pt-lg amounts-table'"
      >
        <template
          #custom-header-action
          v-if="['create', 'edit'].includes(props.action)"
        >
          <div class="row q-gutter-sm">
            <Button
              :label="'Agregar'"
              :size="'md'"
              :unelevated="true"
              :outline="false"
              :left-icon="defaultIconsLucide.plusCircle"
              :color-icon="'white'"
              :class="'text-capitalize btn-filter custom'"
              @click="addRow"
            />
            <Button
              :label="'Carga masiva'"
              :size="'md'"
              :unelevated="true"
              :outline="false"
              :color="'orange'"
              :class="'text-capitalize btn-filter custom'"
              @click="openAlertModal"
            />
          </div>
        </template>

        <template #id="{ row }">
          <GenericSelector
            v-if="['create', 'edit'].includes(action)"
            auto_complete
            :class_name="'full-width'"
            class_custom_popup="custom"
            first_filter_option="label"
            second_filter_option="value"
            :manual_option="business_trust_third_parties"
            :map_options="true"
            :required="true"
            :disabled="false"
            :default_value="row.id"
            @update:modelValue=";(row.id = $event), changeDataTable(row.id)"
            :rules="[
              (v: string) => useRules().is_required(v),
              (v: string) => useRules().validate_not_same(`${v}`, `${selectedThird?.third_party_id}`, 'El cesionario no puede ser el mismo cedente') ,
              (v: number) => useRules().not_exist_in_array(
                  v,
                  idsAssigns as number[],
                  'El cesionario ya ha sido agregado'
                )
            ]"
          />

          <div class="flex justify-center items-center" v-else>
            <p class="q-my-none">
              {{ row.id }}
            </p>
          </div>
        </template>

        <template #received_percentage="{ row }">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :type="'text'"
            :required="true"
            :default_value="row.received_percentage"
            placeholder="%"
            :rules="
              row.id
                ? [
                    (v: string) =>
                      useRules().is_required(v, 'El porcentaje es requerido'),
                    (v: string) => useRules().only_number_with_decimals(v, 10),
                    (v: string) => useRules().min_value(v, 0),
                    (v: string) => useRules().max_value(v, 100),
                  ]
                : []
            "
            :min_value="1"
            :max_value="100"
            @update:model-value="row.received_percentage = $event"
          />

          <div class="flex justify-center items-center" v-else>
            <p
              class="q-my-none"
              v-percentage="{
                value: row.received_percentage,
                decimals: 10,
              }"
            ></p>
          </div>
        </template>

        <template #actions="{ row }">
          <!-- Eliminar -->
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Eliminar'"
            @click="deleteRow(row)"
          />
        </template>
      </TableList>
    </div>

    <section class="mx-3 mt-0 mb-3" v-if="isImport">
      <Statistics :stats="statsProps ?? []" />

      <Button
        outline
        class-custom="custom"
        label="Descargar archivo de salida"
        color="orange"
        :noCaps="true"
        :disabled="!data_import_response?.failed.count"
        :styleContent="{
          'place-items': 'center',
          color: 'black',
        }"
        :left-img="imgButtonHeaderTable"
        @click="downloadErrorsFile"
      />
    </section>

    <div class="mx-3 mt-0 mb-3">
      <TableList
        v-if="tablePropsAssignees.rows.length"
        :title="tablePropsFinal.title"
        :loading="tablePropsFinal.loading"
        :columns="tablePropsFinal.columns"
        :rows="paginatedFinal"
        :pages="tablePropsFinal.pages"
        @updatePage="(val) => (tablePropsFinal.pages.currentPage = val)"
        @updateRowsPerPage="
          (val) => {
            pageSizeFinal = val
            tablePropsFinal.pages.currentPage = 1
          }
        "
        :class="'q-pt-lg amounts-table'"
        :custom-columns="['percentage_participation']"
      >
        <template #percentage_participation="{ row }">
          <div class="flex justify-center items-center">
            <p
              class="q-my-none"
              v-percentage="{
                value: row.percentage_participation,
                decimals: 10,
              }"
            ></p>
          </div>
        </template>
      </TableList>

      <div class="px-1 flex justify-end">
        <!-- TODO: Por ahora solo se muestran 10 decimales mientras el equipo de requerimientos define el formato y precisión definitiva para la visualización de números decimales además de las reglas de redondeo-->
        <GenericInput
          :type="'number'"
          :required="true"
          :default_value="parseFloat(Number(total_percentaje).toFixed(10))" 
          readonly
          placeholder="%"
          :rules="
            tablePropsFinal.rows.length &&
            tablePropsAssignees.rows.length &&
            ['create', 'edit'].includes(action)
              ? [
                  (v: string) => useRules().min_value(v, 100),
                  (v: string) => useRules().max_value(v, 100),
                ]
              : []
          "
          :min_value="100"
          :max_value="100"
        />
      </div>
    </div>

    <AlertModalComponent
      ref="alertModalRef"
      :titleHeader="'Carga masiva'"
      :description_message="''"
      :show-btn-cancel="false"
      :show-close-btn="true"
      :show-img-default="false"
      :show-btn-confirm="false"
      styleModal="min-width: 90%; margin-top: 0px"
      :margin-top-body="'mt-0'"
    >
      <template #default-body>
        <UploadData
          :action="props.action"
          @close="closeAlertModal"
          @save="uploadDataTable"
        />
      </template>
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import UploadData from '../UploadData/UploadData.vue'
import Statistics from '@/components/common/Statistics/Statistics.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// logic
import useTablesInformationForm from './TablesInformation'

// composables
import { useRules } from '@/composables'

import { defaultIconsLucide } from '@/utils'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view' | 'authorize'
    status?: number
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  tableProps,
  tablePropsAssignees,
  business_trust_third_parties,
  alertModalRef,
  isImport,
  statsProps,
  tablePropsFinal,
  total_percentaje,
  selectedThirdId,
  selectedThird,
  participations,
  idsAssigns,
  paginatedAssignees,
  paginatedFinal,
  pageSizeAssignees,
  pageSizeFinal,
  data_import_response,

  addRow,
  changeDataTable,
  deleteRow,
  closeAlertModal,
  openAlertModal,
  uploadDataTable,
  downloadErrorsFile,
  onChangeParticipation,
} = useTablesInformationForm(props)

defineExpose({
  validateForm: () => {
    if (!selectedThirdId.value) return false
    if (!participations.value[selectedThirdId.value]) return false
    if (!tablePropsAssignees.value.rows.length) return false
    if (
      tablePropsAssignees.value.rows.some(
        (v) => v.id === selectedThird.value?.third_party_id
      )
    )
      return false
    if (!tablePropsFinal.value.rows.length) return false
    const total = Number(total_percentaje.value)
    if (isNaN(total) || total !== 100) return false
    return true
  },
  total_percentaje,
})
</script>

<style lang="scss" scoped>
:deep(.amounts-table) {
  .q-field {
    margin-top: 1.5rem;
    padding-bottom: 1.5rem !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
