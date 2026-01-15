<template>
  <ModalComponent
    :openDialog="openVariableModal"
    @update:openDialog="(val) => emit('update:openVariableModal', val)"
  >
    <template #content-modal>
      <div class="q-gutter-lg">
        <div class="col-12 col-md-10">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">
            {{ sectionTitles.generales }}
          </div>

          <q-list bordered class="rounded-borders">
            <q-item
              v-for="opt in optionsBySection.generales"
              :key="opt.value"
              clickable
              v-ripple
              @click="pickFromList('generales', opt.value)"
            >
              <q-item-section>
                <div class="text-body2">{{ opt.label }}</div>
              </q-item-section>
            </q-item>
            <q-item v-if="!optionsBySection.generales.length" dense>
              <q-item-section class="text-grey">Sin variables</q-item-section>
            </q-item>
          </q-list>
        </div>

        <q-separator spaced class="q-my-md" />

        <div class="col-12 col-md-10">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">
            {{ sectionTitles.fuente_pagadora }}
          </div>

          <q-list bordered class="rounded-borders">
            <q-item
              v-for="opt in optionsBySection.fuente_pagadora"
              :key="opt.value"
              clickable
              v-ripple
              @click="pickFromList('fuente_pagadora', opt.value)"
            >
              <q-item-section>
                <div class="text-body2">{{ opt.label }}</div>
              </q-item-section>
            </q-item>
            <q-item v-if="!optionsBySection.fuente_pagadora.length" dense>
              <q-item-section class="text-grey">Sin variables</q-item-section>
            </q-item>
          </q-list>
        </div>

        <q-separator spaced class="q-my-md" />

        <div class="col-12 col-md-10">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">
            {{ sectionTitles.destino }}
          </div>

          <q-list bordered class="rounded-borders">
            <q-item
              v-for="opt in optionsBySection.destino"
              :key="opt.value"
              clickable
              v-ripple
              @click="pickFromList('destino', opt.value)"
            >
              <q-item-section>
                <div class="text-body2">{{ opt.label }}</div>
              </q-item-section>
            </q-item>
            <q-item v-if="!optionsBySection.destino.length" dense>
              <q-item-section class="text-grey">Sin variables</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </template>
  </ModalComponent>

  <ModalComponent
    :openDialog="openTableModal"
    @update:openDialog="(val) => emit('update:openTableModal', val)"
    title="Tablas"
  >
    <template #content-modal>
      <q-form ref="tableFormRef" class="q-gutter-md">
        <div class="col-12 col-md-10">
          <div class="row items-center q-col-gutter-sm">
            <div class="col">
              <GenericSelectorComponent
                label="Variables"
                :default_value="selectedVariables"
                :manual_option="allVariableOptions"
                :required="true"
                :rules="[]"
                :map_options="true"
                multiple
                show_as_checkbox
                :clearable="true"
                placeholder="Seleccione"
                @update:model-value="handleSelectVariables"
              />
            </div>
          </div>
        </div>

        <TableList
          class="q-mt-md"
          :rows="tableProps.rows"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :custom-columns="['variable', 'alias', 'actions']"
          row-key="id"
          hide-bottom
        >
          <template #variable="{ row }">
            {{ getVariableLabel(row.variable) }}
          </template>

          <template #alias="{ row, index }">
            <GenericInputComponent
              :default_value="row.alias"
              placeholder="Inserte alias"
              @update:model-value="
                (val) => (tableProps.rows[index].alias = val)
              "
            />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.trash"
              label=""
              outline
              @click="handleRemoveRow(row.id)"
            />
          </template>
        </TableList>

        <div class="row justify-center q-gutter-sm q-mt-md">
          <Button
            label="Cancelar"
            color="orange"
            outline
            @click="() => handleCancel('table')"
          />
          <Button
            label="Agregar"
            color="orange"
            :outline="false"
            :disable="tableProps.rows.length === 0 || !isValid"
            @click="handleAddTable"
          />
        </div>
      </q-form>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import useListLetterFormatModal from './ListLetterFormatModal'
import { ILetterFormatTablePayload } from '@/interfaces/customs'
import { defaultIconsLucide } from '@/utils'

const props = defineProps<{
  openVariableModal: boolean
  openTableModal: boolean
  onAddVariable?: (row: {
    code: string
    name: string
    type: string
    section?: string
  }) => void
  onAddTable?: (row: ILetterFormatTablePayload) => void

  presetTableItems?: Array<{ variable: string; alias?: string }>
}>()

const emit = defineEmits<{
  (e: 'update:openVariableModal', value: boolean): void
  (e: 'update:openTableModal', value: boolean): void
}>()

const {
  optionsBySection,
  sectionTitles,
  selectedVariables,
  allVariableOptions,
  tableFormRef,
  isValid,
  tableProps,
  handleSelectVariables,
  handleRemoveRow,
  handleAddTable,
  getVariableLabel,
  pickFromList,
  handleLoadPreset,
  handleCancel,
} = useListLetterFormatModal({
  onAddVariable: (row) => props.onAddVariable?.(row),
  onAddTable: props.onAddTable,
  emit: emit as (
    e: 'update:openVariableModal' | 'update:openTableModal',
    value: boolean
  ) => void,
})

watch(
  () => props.openTableModal,
  (open) => {
    if (open && props.presetTableItems?.length) {
      handleLoadPreset(props.presetTableItems)
    }
  }
)
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>
