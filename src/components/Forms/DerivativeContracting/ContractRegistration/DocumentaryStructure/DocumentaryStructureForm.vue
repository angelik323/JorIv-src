<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <p class="text-black-10 text-weight-bold text-h6 q-mb-md">
        Documentos anexos
      </p>

      <UploadDocument
        v-if="['create', 'edit'].includes(action)"
        v-for="element in dataUpload"
        :key="element.position"
        @changeFile="(file: File) => handleFileChange(file, element.title, element.id as number)"
        :class="element.class"
        :title="element.title"
        :subtitle="element.subtitle"
        :required="element.required"
        :activeButton="element.file !== null"
      />

      <div class="q-mx-md">
        <TableList
          :loading="tableDocumentsProperties.loading"
          :rows="tableDocumentsProperties.rows"
          :columns="tableDocumentsProperties.columns"
          :custom-columns="['actions', 'status_id']"
          hide-pagination
          dense
          customNoDataMessageTitle="No hay datos registrados"
          customNoDataMessageSubtitle=""
        >
          <template #status_id>
            <div class="q-pa-md row items-center">
              <div class="q-mr-md">
                <ShowStatus :type="75" />
              </div>
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              v-if="action !== 'create'"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="viewFile(row.file_path)"
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
              @click="handleOpenAlertModal(row.id)"
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
      </div>
    </section>
  </q-form>

  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 400px"
    :title="alertModalConfig.title"
    @confirm="removeFile(alertModalConfig.id as number)"
    :showCloseBtn="alertModalConfig.showCloseBtn"
  >
    <template #default-body>
      <p class="text-center text-grey-6 mx-4 q-px-lg">
        {{ alertModalConfig.description }}
      </p>

      <p class="text-center text-grey-6 mx-4 q-px-lg">
        {{ alertModalConfig.description2 }}
      </p>
    </template>
  </AlertModalComponent>

  <ViewerFileComponent ref="viewerFileComponentRef" />
</template>

<script lang="ts" setup>
// Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IContractRegistrationGeneralDataForm } from '@/interfaces/customs/derivative-contracting/ContractRegistration'

//Logic form
import useDocumentaryStructureForm from '@/components/Forms/DerivativeContracting/ContractRegistration/DocumentaryStructure/DocumentaryStructureForm'
import ViewerFileComponent from '@/components/common/ViewerFile/ViewerFileComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import UploadDocument from '@/components/common/UploadDocument/UploadDocument.vue'

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IContractRegistrationGeneralDataForm | null): void
}>()

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IContractRegistrationGeneralDataForm | null
  }>(),
  {}
)

const {
  formElementRef,
  viewerFileComponentRef,
  alertModalRef,
  tableDocumentsProperties,
  defaultIconsLucide,
  alertModalConfig,
  dataUpload,

  viewFile,
  removeFile,
  handleOpenAlertModal,
  handleFileChange,
} = useDocumentaryStructureForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
