<template>
  <section
    class="q-mt-sm justify-center q-gutter-md ml-2 mr-4 mt-0 editable-table"
  >
    <TableList
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :custom-columns="[
        'third_party_id',
        'percentage_participation',
        'actions',
      ]"
      :rows="paginated"
      :pages="tableProps.pages"
      @updatePage="(val) => (tableProps.pages.currentPage = val)"
      @updateRowsPerPage="
        (val) => {
          pageSize = val
          tableProps.pages.currentPage = 1
        }
      "
    >
      <template #custom-header>
        <div class="row q-col-gutter-sm" style="width: 100%">
          <div class="col-12">
            <div class="row justify-end">
              <Button
                label="Agregar"
                size="md"
                unelevated
                outline
                class="text-capitalize btn-filter custom"
                :disabled="
                  models.business_resources.some(
                    (item) =>
                      !item.third_party_id ||
                      item.third_party_id === 0 ||
                      !item.percentage_participation
                  ) ||
                  Number(total_percentaje) >= 100 ||
                  hasInvalidRows
                "
                @click="addRowTable"
              />
            </div>
          </div>
        </div>
      </template>

      <template #third_party_id="{ row }">
        <div class="flex items-center justify-center">
          <GenericSelectorComponent
            :key="row.third_party_id"
            v-if="['create', 'edit'].includes(action)"
            class_custom_popup="custom"
            :manual_option="data_select"
            :map_options="true"
            :required="true"
            :class_name="'full-width'"
            :default_value="row.third_party_id"
            :auto_complete="true"
            @update:modelValue="row.third_party_id = $event"
            :rules="[
              (v: string) => useRules().is_required(v, 'El cliente es requerido'),
              (v: string) => {
                const id = Number(v)
                return !models.business_resources.some(
                  item => item.third_party_id === id && item !== row
                ) || 'El cliente ya fue elegido'
              }
            ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ row.third_party_id ?? 'No registrado' }}
          </p>
        </div>
      </template>

      <template #percentage_participation="{ row }">
        <div class="flex items-center justify-center">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="row.percentage_participation"
            :placeholder="''"
            type="number"
            :class_name="'full-width'"
            additional_characters="."
            @update:modelValue="row.percentage_participation = $event"
            :required="true"
            :rules="[
                (v: string) => useRules().is_required(v, 'El porcentaje es requerido'),
                (v: string) => useRules().max_value(v, 100) ,
                (v: string) => useRules().only_number_with_decimals(v, 10)
              ]"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ row.percentage_participation ?? 'No registrado' }}
          </p>
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
          :tooltip="'Eliminar'"
          @click="deleteRegister(row)"
        />
      </template>
    </TableList>
  </section>
  <div class="q-mt-md">
    <div class="row items-center justify-end q-gutter-md mr-4">
      <div class="col-3">
        <div class="text-right">
          <p class="text-weight-medium text-orange-10 mb-0">
            Total % de participación
          </p>
        </div>
      </div>

      <div class="col-3">
        <div>
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            :default_value="total_percentaje"
            :placeholder="''"
            @update:modelValue="total_percentaje = $event"
            :required="true"
            :rules="[
                (v: string) => useRules().max_value(v, 100),
                (v: string) => useRules().min_value(v, 100)
              ]"
            :readonly="true"
          />
          <p v-else class="text-grey-6 mb-0">
            {{ total_percentaje ?? 'No registrado' }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="q-mt-lg">
    <section class="q-px-md q-mb-md">
      <div class="row justify-between items-center">
        <div class="row q-gutter-sm ml-2">
          <Button
            label="Descargar plantilla"
            :size="'md'"
            :unelevated="true"
            :outline="true"
            :color="'orange'"
            :class="'text-capitalize btn-filter custom'"
            @click="downloadTemplate"
            :style-text="'color:black;'"
            :left-img="imgButtonHeaderTable"
          />
          <Button
            label="Carga masiva"
            :size="'md'"
            :unelevated="true"
            :outline="false"
            :color="'orange'"
            :class="'text-capitalize btn-filter custom'"
            @click="triggerFileUpload"
          />

          <input
            ref="fileInput"
            type="file"
            accept=".xlsx"
            style="display: none"
            @change="handleFileChange"
          />
        </div>

        <div class="row q-gutter-sm mr-2">
          <Button
            label="Cancelar"
            :size="'md'"
            :unelevated="true"
            :outline="true"
            :color="'orange'"
            :class="'text-capitalize btn-filter custom'"
            @click="cancel"
          />
          <Button
            label="Guardar"
            :size="'md'"
            :unelevated="true"
            :outline="false"
            :color="'orange'"
            :class="'text-capitalize btn-filter custom'"
            :disabled="Number(total_percentaje) !== 100 || hasInvalidRows"
            @click="onSubmit"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import { useDefaultDataRegister } from './DefaultDataRegister'
import TableList from '@/components/table-list/TableList.vue'

// Composables
import { useRules } from '@/composables'

// Utils
import { defaultIconsLucide } from '@/utils'
import { ITrustBusinessRequest } from '@/interfaces/customs'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import { ActionType } from '@/interfaces/global'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: ITrustBusinessRequest[] | null
    title?: string
    type_resource?: number
  }>(),
  {}
)

const emit = defineEmits<{
  (e: 'save'): void
}>()

const {
  tableProps,
  total_percentaje,
  models,
  fileInput,
  data_select,
  hasInvalidRows,
  pageSize,
  paginated,

  handleFileChange,
  triggerFileUpload,
  downloadTemplate,
  addRowTable,
  deleteRegister,
  onSubmit,
  cancel,
} = useDefaultDataRegister(props, emit)
</script>
