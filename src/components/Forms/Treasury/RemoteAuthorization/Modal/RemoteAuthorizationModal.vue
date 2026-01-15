<template>
  <ModalComponent
    :openDialog="props.openDialog"
    :showImgDefault="true"
    imageWidth="80px"
    :imageSrc="alertIcon"
    minWidth="1200px"
    @update:openDialog="$emit('update:openDialog', $event)"
  >
    <template #content-modal>
      <div class="q-mt-xl">
        <q-form ref="formElementRef" greedy>
          <div class="q-mb-lg">
            <p class="text-center text-body1 q-mb-md">
              {{ confirmationMessage }}
            </p>
            <TableList
              class="custom-table table-title-center"
              :title="title"
              :loading="false"
              :rows="rows"
              :columns="displayColumns"
              :pages="pages"
              :custom-columns="
                mode === 'authorize'
                  ? ['selection', 'rejection_reason']
                  : ['rejection_reason']
              "
              :rows-per-page-options="[100, 50, 25, 10, 5]"
              @update-page="updatePage"
              @update-rows-per-page="updatePerPage"
            >
              <template v-if="mode === 'authorize'" #header-selection>
                <q-checkbox
                  :model-value="selectAll"
                  @update:model-value="toggleSelectAll"
                  title="Seleccionar/Deseleccionar todo"
                />
              </template>
              <template v-if="mode === 'authorize'" #selection="{ row }">
                <q-checkbox
                  :model-value="isItemSelected(row.id)"
                  @update:model-value="toggleItemSelection(row.id)"
                />
              </template>
              <template #rejection_reason="{ row }">
                <GenericInput
                  label=""
                  required
                  placeholder="Escriba el motivo del rechazo"
                  :default_value="rejectionReasons[row.id] || ''"
                  :rules="[
                    (val: string) => no_special_characters_extended(val),
                    (val: string) => max_length(val, 120)
                  ]"
                  @update:model-value="updateRejectionReason(row.id, $event)"
                />
              </template>
            </TableList>
          </div>
        </q-form>

        <div class="row justify-center q-mt-md">
          <Button
            label="Cancelar"
            color="orange"
            class="q-mr-sm"
            outline
            @click="cancel"
          />
          <Button
            :label="'Aceptar'"
            :class-custom="'custom'"
            size="md"
            color="orange"
            :outline="false"
            :disabled="isProcessing"
            @click="confirm"
          />
        </div>
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import './RemoteAuthorizationModal.scss'
import alertIcon from '@/assets/images/icons/alert_popup.svg'
import { defineProps, defineEmits } from 'vue'
import {
  IRemoteAuthorizationItem,
  Mode,
  RemoteAuthorizationModalEmit,
} from '@/interfaces/customs'
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import useRemoteAuthorizationModal from './RemoteAuthorizationModal'

const props = defineProps<{
  openDialog: boolean
  mode: Mode
  selected: IRemoteAuthorizationItem[]
}>()

const emit = defineEmits<RemoteAuthorizationModalEmit>()

const {
  isProcessing,
  formElementRef,
  rows,
  pages,
  updatePage,
  updatePerPage,
  confirm,
  cancel,
  title,
  displayColumns,
  rejectionReasons,
  updateRejectionReason,
  no_special_characters_extended,
  max_length,
  selectAll,
  toggleItemSelection,
  toggleSelectAll,
  isItemSelected,
  confirmationMessage,
} = useRemoteAuthorizationModal(props, emit)

defineExpose({ formElementRef })
</script>
