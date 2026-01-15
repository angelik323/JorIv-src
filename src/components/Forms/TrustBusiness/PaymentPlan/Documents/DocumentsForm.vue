<template>
  <q-form ref="formElementRef">
    <template v-if="['create', 'edit'].includes(action)">
      <UploadFile
        ref="attachDocumentRef"
        :title="uploadProps.title"
        :styles-customs="uploadProps.styleCustom"
        :multiple-files="uploadProps.multiple"
        :label-upload-btn="uploadProps.labelBtn"
        :bordered="uploadProps.bordered"
        :accept="uploadProps.accept"
        :class-name-title="uploadProps.classNameTitle"
        :show-preview="false"
        color-icon="orange"
        @added="addedFiles"
        @rejected="rejectedFiles"
      />
    </template>

    <TableList
      v-show="Array.isArray(tableProps.rows) && tableProps.rows.length > 0"
      :title="tableProps.title"
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :custom-columns="['item', 'actions']"
      hide-pagination
      dense
    >
      <template #item="{ index }">
        <span>{{ index + 1 }}</span>
      </template>

      <template #actions="{ row }">
        <Button
          :left-icon="defaultIconsLucide.download"
          color="orange"
          class-custom="custom"
          :outline="false"
          flat
          colorIcon="#f45100"
          tooltip="Descargar"
          @click="viewFile(row)"
        />

        <Button
          v-if="['create', 'edit'].includes(action)"
          :left-icon="defaultIconsLucide.trash"
          color="orange"
          class-custom="custom"
          :outline="false"
          flat
          colorIcon="#f45100"
          tooltip="Eliminar"
          @click="openModalDelete(row)"
        />
      </template>

      <template #custom-no-data>
        <div
          class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
        >
          <img
            src="@/assets/images/icons/no_data_2.svg"
            alt="No hay datos para mostrar"
            width="180px"
          />
          <p class="text-weight-bold text-h5 text-center">
            No hay datos para mostrar
          </p>
        </div>
      </template>
    </TableList>
  </q-form>

  <AlertModalComponent
    ref="deleteModalRef"
    styleModal="min-width: 470px"
    :title="alertModalConfig.description"
    :showImgDefault="false"
    @confirm="handleDeletePaymentFile"
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

<script setup lang="ts">
import { ActionType } from '@/interfaces/global'
import { IPaymentPlanResponse } from '@/interfaces/customs'
import Button from '@/components/common/Button/Button.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import { defaultIconsLucide } from '@/utils'
import useDocumentsForm from '@/components/Forms/TrustBusiness/PaymentPlan/Documents/DocumentsForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IPaymentPlanResponse | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  formElementRef,
  attachDocumentRef,
  uploadProps,
  tableProps,
  alertModalConfig,
  deleteModalRef,
  addedFiles,
  rejectedFiles,
  viewFile,
  openModalDelete,
  handleDeletePaymentFile,
} = useDocumentsForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
