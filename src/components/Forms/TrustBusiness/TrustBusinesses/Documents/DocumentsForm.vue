<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <template v-if="['create', 'edit'].includes(action)">
        <div class="q-mb-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Cargar documentos creación de negocio
          </p>
        </div>

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
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['actions']"
        :hide-bottom="['create', 'edit'].includes(action)"
      >
        <template #actions="{ row }">
          <Button
            v-if="['view'].includes(action)"
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
            @click="removeFile(row.id, row.isNew)"
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
    </section>
  </q-form>
</template>

<script setup lang="ts">
import { ITrustBusinessResponse } from '@/interfaces/customs'
import useDocumentsForm from '@/components/Forms/TrustBusiness/TrustBusinesses/Documents/DocumentsForm'
import Button from '@/components/common/Button/Button.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'

// Utils
import { defaultIconsLucide } from '@/utils'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: ITrustBusinessResponse | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  formElementRef,
  attachDocumentRef,
  uploadProps,
  tableProps,
  addedFiles,
  rejectedFiles,
  removeFile,
  viewFile,
} = useDocumentsForm(props)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
