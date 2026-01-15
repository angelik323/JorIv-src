<template>
  <q-form
    ref="informationFormRef"
    aria-label="Formulario de información para manejo de cargue de logos"
  >
    <h4>{{ props.action === 'logo' ? 'Logos' : 'Firmas' }}</h4>
    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pa-md">
      <div class="col-12 col-md-2 q-my-sm">
        {{
          props.action === 'logo' ? 'Nombre del logo' : 'Seleccione el usuario'
        }}
      </div>
      <div class="col-12 col-md-5" v-if="props.action === 'logo'">
        <GenericInputComponent
          :default_value="modelsReferenceImages.app_name"
          auto_complete
          placeholder="Ingrese el nombre"
          max_length="80"
          required
          :rules="[
              (val: string) => useRules().is_required(val, 'El nombre es requerido'),
              (val: string) =>
                useRules().max_length(
                  val,
                  80,
                ),

            ]"
          @update:model-value="(val) => (modelsReferenceImages.app_name = val)"
        />
      </div>
      <div class="col-12 col-md-5" v-if="props.action === 'signature'">
        <GenericSelectorComponent
          :default_value="modelsReferenceImages.user_id"
          auto_complete
          placeholder="Seleccione"
          map_options
          :manual_option="users"
          required
          :rules="[
              (val: string) => useRules().is_required(val, 'El usuario es requerido'),
              (val: string) =>
                useRules().max_length(
                  val,
                  80,
                ),

            ]"
          @update:model-value="(val:number) => (modelsReferenceImages.user_id = val)"
        />
      </div>
    </div>

    <VCard
      class="q-mt-md q-pa-xl"
      v-if="
        (props.action === 'logo' && modelsReferenceImages.app_name !== '') ||
        (props.action === 'signature' && modelsReferenceImages.user_id !== null)
      "
    >
      <template #content-card>
        <div class="row justify-center q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12">
            <UploadFile
              ref="attachDocumentRef"
              :title="uploadProps.title"
              :styles-customs="uploadProps.styleCustom"
              :multiple-files="uploadProps.multiple"
              :label-upload-btn="uploadProps.labelBtn"
              :bordered="uploadProps.bordered"
              :accept="uploadProps.accept"
              color-icon="orange"
              @added="validateImportFile"
              @rejected="rejectedFiles"
              @removed="deleteFiles"
            />
          </div>
        </div>
      </template>
    </VCard>
    <TableList
      :columns="tablePropertiesLogo.columns"
      :rows="tablePropertiesLogo.rows"
      :title="tablePropertiesLogo.title"
      :loading="tablePropertiesLogo.loading"
      :pages="tablePropertiesLogo.pages"
      :custom-columns="['status', 'actions']"
      v-if="props.action === 'logo'"
    >
      <template #actions="{ row }">
        <Button
          :right-icon="defaultIconsLucide.eye"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          size=""
          @click="_getShowReportTemplateLogo(row.id)"
        />
        <Button
          :right-icon="defaultIconsLucide.delete"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          size=""
          @click="deleteFile(row.id)"
        />
      </template>

      <template #status="{ row }">
        <RadioYesNo
          :model-value="row.status?.id"
          :is-switch="true"
          :is-radio-button="false"
          :class="'absolute'"
          @update:model-value="() => modifyStatus(row.id)"
        />
      </template>
    </TableList>
    <TableList
      :columns="tablePropertiesSignature.columns"
      :rows="tablePropertiesSignature.rows"
      :title="tablePropertiesSignature.title"
      :loading="tablePropertiesSignature.loading"
      :pages="tablePropertiesSignature.pages"
      :custom-columns="['status', 'actions']"
      v-if="props.action === 'signature'"
    >
      <template #actions="{ row }">
        <Button
          :right-icon="defaultIconsLucide.eye"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          size=""
          @click="_getShowReportTemplateSignature(row.id)"
        />
        <Button
          :right-icon="defaultIconsLucide.delete"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          size=""
          @click="deleteFile(row.id)"
        />
      </template>

      <template #status="{ row }">
        <RadioYesNo
          :model-value="row.status?.id"
          :is-switch="true"
          :is-radio-button="false"
          :class="'absolute'"
          @update:model-value="() => modifyStatus(row.id)"
        />
      </template>
    </TableList>
  </q-form>
</template>
<script setup lang="ts">
//Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

//Interfaces
import { SignatureActions } from '@/interfaces/global/Action'
import { IReportTemplatePayloadLogoAndSignature } from '@/interfaces/customs/accounting/ReportTemplates'

//Composables
import { useRules } from '@/composables/useRules'

//Logic View
import imagesData from '@/components/Forms/Accounting/ReportTemplates/v2/ImagesForm/LogoData/LogoDataForm'

const props = withDefaults(
  defineProps<{
    action: SignatureActions | string
    data?: IReportTemplatePayloadLogoAndSignature
  }>(),
  {}
)

const {
  uploadProps,
  tablePropertiesLogo,
  defaultIconsLucide,
  attachDocumentRef,
  modelsReferenceImages,
  tablePropertiesSignature,
  users,
  rejectedFiles,
  validateImportFile,
  deleteFile,
  deleteFiles,
  modifyStatus,
  _getShowReportTemplateLogo,
  _getShowReportTemplateSignature,
} = imagesData(props)
</script>
