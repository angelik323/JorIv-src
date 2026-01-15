<template>
  <q-expansion-item
    :model-value="isOpenExpansionItem"
    class="q-mb-md expansion-item-fp"
    expand-icon-class="text-black expansion-icon"
    @update:model-value="isOpenExpansionItem = $event"
  >
    <template v-slot:header>
      <q-item-section>
        <div class="column">
          <span class="text-h6 text-weight-bold">{{
            tableProperties.title
          }}</span>
          <span class="text-subtitle1 text-grey-14">
            Haz click sobre Columnas de los registros para desplegar la tabla
          </span>
        </div>
      </q-item-section>
      <q-item-section side>
        <Button
          v-if="validateRouter('Treasury', 'BankStructuresList', 'create')"
          :left-icon="defaultIconsLucide.plusCircle"
          :outline="false"
          color="white"
          color-icon="white"
          label="Crear"
          :tooltip="
            canCreateRecordColumns
              ? 'Añadir columna de registro'
              : 'Primero debes seleccionar un tipo de registro'
          "
          :stop-propagation="true"
          @click="handleOptions('create')"
          :disabled="!canCreateRecordColumns"
        />
      </q-item-section>
    </template>
    <TableList
      :loading="tableProperties.loading"
      :rows="tableProperties.rows"
      :columns="tableProperties.columns"
      :pages="tableProperties.pages"
      :custom-columns="['actions']"
      @update-page="updatePage"
      @update-rows-per-page="updateRowsPerPage"
    >
      <template #actions="{ row }">
        <!-- Ver -->
        <Button
          v-if="row.id && validateRouter('Treasury', 'BankStructuresList', 'show')"
          :left-icon="defaultIconsLucide.eye"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Ver'"
          @click="handlerGoTo('RecordColumnsView', row.id)"
        />
        <!-- Editar -->
        <Button
          v-if="row.id && validateRouter('Treasury', 'BankStructuresList', 'edit')"
          :left-icon="defaultIconsLucide.edit"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Editar'"
          @click="handleOptions('edit', row.id)"
        />
        <!-- Eliminar -->
        <Button
          v-if="row.id && validateRouter('Treasury', 'BankStructuresList', 'delete')"
          :left-icon="defaultIconsLucide.trash"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Eliminar'"
          @click="handleOptions('delete', row.id)"
        />
      </template>
    </TableList>
  </q-expansion-item>
  <AlertModalComponent
    ref="formModalRef"
    styleModal="min-width: 822px"
    :show-img-default="false"
    :text-btn-confirm="textActionOnFormModal"
    :title-header="`${textActionOnFormModal} ${formModalConfig.title.toLowerCase()}`"
    margin-top-body="mt-0"
    @confirm="onSubmit"
  >
    <template #default-body>
      <RecordColumnsForm
        ref="formRecordColumns"
        :action="formModalConfig.action"
        :id="formModalConfig.id"
      />
    </template>
  </AlertModalComponent>
  <AlertModalComponent
    ref="deleteModalRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="deleteModalConfig.description"
    :description_message="''"
    @confirm="handleDelete()"
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
  </AlertModalComponent>
</template>

<script lang="ts" setup>
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import useRecordColumnsList from './RecordColumnsList'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import RecordColumnsForm from '@/components/Forms/Treasury/BankStuctures/RecordColumns/RecordColumnsForm.vue'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  tableProperties,
  isOpenExpansionItem,
  canCreateRecordColumns,
  formModalRef,
  formModalConfig,
  formRecordColumns,
  deleteModalRef,
  deleteModalConfig,
  textActionOnFormModal,
  updatePage,
  updateRowsPerPage,
  onSubmit,
  handleOptions,
  handleDelete,
  handlerGoTo,
  validateRouter
} = useRecordColumnsList()
</script>
