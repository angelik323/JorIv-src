<template>
  <div class="q-px-lg">
    <div class="q-mb-xs">
      <p
        v-if="models.signature == null"
        class="text-weight-medium text-black-90 q-mb-sm"
      >
        Firma
      </p>
      <UploadFile
        v-if="models.signature == null"
        ref="signatureRef"
        title=""
        :styles-customs="uploadProps.styleCustom"
        :multiple-files="uploadProps.multiple"
        :label-upload-btn="uploadProps.labelBtn"
        :bordered="uploadProps.bordered"
        :accept="uploadProps.accept"
        color-icon="orange"
        :show-border="true"
        @added="handleSignatureFiles"
        @rejected="rejectedFiles($event)"
        @removed="deleteSignatureFiles"
      />
      <div v-else>
        <TableList
          :loading="UploadSignatureTableProps.loading"
          :columns="UploadSignatureTableProps.columns"
          :rows="UploadSignatureTableProps.rows"
          :pages="UploadSignatureTableProps.pages"
          :custom-columns="['actions', 'status_id', 'name']"
          :hide-bottom="true"
          row-key="id"
        >
          <template #name="{ row }">
            <div class="q-pa-md row items-center justify-center">
              <img
                class="image-excel q-mr-sm"
                src="@/assets/images/txt.svg"
                alt="Excel Icon"
              />
              {{ row.name }}
            </div>
          </template>

          <template #status_id="{ row }">
            <div
              class="q-pa-md row items-center"
              :class="row.status_id !== 20 ? 'justify-center' : ''"
            >
              <div class="q-mr-md">
                <ShowStatus :type="Number(row?.status_id ?? 20)" />
              </div>
              <q-linear-progress
                v-if="row.status_id === 20"
                :value="progressSignatureValue"
                :color="'primary_fiduciaria'"
                size="7px"
                style="flex: 1; border-radius: 9999px; overflow: hidden"
              />
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              v-if="row.status_id === 30 || row.status_id === 29"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="deleteSignatureFiles()"
            /> </template
        ></TableList>
      </div>
    </div>

    <div class="q-mb-xs">
      <p
        v-if="models.watermark == null"
        class="text-weight-medium text-black-90 q-mb-sm"
      >
        Marca de agua
      </p>
      <UploadFile
        v-if="models.watermark == null"
        ref="waterMarkRef"
        title=""
        :styles-customs="uploadProps.styleCustom"
        :multiple-files="uploadProps.multiple"
        :label-upload-btn="uploadProps.labelBtn"
        :bordered="uploadProps.bordered"
        :accept="uploadProps.accept"
        color-icon="orange"
        :show-border="true"
        @added="handleWaterMarkFiles"
        @rejected="rejectedFiles($event)"
        @removed="deleteWaterMarkFiles"
      />
      <div v-else>
        <TableList
          :loading="UploadWaterMarkTableProps.loading"
          :columns="UploadWaterMarkTableProps.columns"
          :rows="UploadWaterMarkTableProps.rows"
          :pages="UploadWaterMarkTableProps.pages"
          :custom-columns="['actions', 'status_id', 'name']"
          :hide-bottom="true"
          row-key="id"
        >
          <template #name="{ row }">
            <div class="q-pa-md row items-center justify-center">
              <img
                class="image-excel q-mr-sm"
                src="@/assets/images/txt.svg"
                alt="Excel Icon"
              />
              {{ row.name }}
            </div>
          </template>

          <template #status_id="{ row }">
            <div
              class="q-pa-md row items-center"
              :class="row.status_id !== 20 ? 'justify-center' : ''"
            >
              <div class="q-mr-md">
                <ShowStatus :type="Number(row?.status_id ?? 20)" />
              </div>
              <q-linear-progress
                v-if="row.status_id === 20"
                :value="progressWaterMarkValue"
                :color="'primary_fiduciaria'"
                size="7px"
                style="flex: 1; border-radius: 9999px; overflow: hidden"
              />
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              v-if="row.status_id === 30 || row.status_id === 29"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="deleteWaterMarkFiles()"
            /> </template
        ></TableList>
      </div>
    </div>

    <div class="q-mb-xs">
      <p
        v-if="models.logo == null"
        class="text-weight-medium text-black-90 q-mb-sm"
      >
        Logo
      </p>
      <UploadFile
        v-if="models.logo == null"
        ref="logoRef"
        title=""
        :styles-customs="uploadProps.styleCustom"
        :multiple-files="uploadProps.multiple"
        :label-upload-btn="uploadProps.labelBtn"
        :bordered="uploadProps.bordered"
        :accept="uploadProps.accept"
        color-icon="orange"
        :show-border="true"
        @added="handleLogoFiles"
        @rejected="rejectedFiles($event)"
        @removed="deleteLogoFiles"
      />
      <div v-else>
        <TableList
          :loading="UploadLogoTableProps.loading"
          :columns="UploadLogoTableProps.columns"
          :rows="UploadLogoTableProps.rows"
          :pages="UploadLogoTableProps.pages"
          :custom-columns="['actions', 'status_id', 'name']"
          :hide-bottom="true"
          row-key="id"
        >
          <template #name="{ row }">
            <div class="q-pa-md row items-center justify-center">
              <img
                class="image-excel q-mr-sm"
                src="@/assets/images/txt.svg"
                alt="Excel Icon"
              />
              {{ row.name }}
            </div>
          </template>

          <template #status_id="{ row }">
            <div
              class="q-pa-md row items-center"
              :class="row.status_id !== 20 ? 'justify-center' : ''"
            >
              <div class="q-mr-md">
                <ShowStatus :type="Number(row?.status_id ?? 20)" />
              </div>
              <q-linear-progress
                v-if="row.status_id === 20"
                :value="progressLogoValue"
                :color="'primary_fiduciaria'"
                size="7px"
                style="flex: 1; border-radius: 9999px; overflow: hidden"
              />
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              v-if="row.status_id === 30 || row.status_id === 29"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="deleteLogoFiles()"
            /> </template
        ></TableList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
// logic
import useUploadVariablesForm from '@/components/Forms/Normative/UploadVariablesForm/UploadVariablesForm'

const {
  signatureRef,
  waterMarkRef,
  logoRef,
  models,
  progressSignatureValue,
  progressWaterMarkValue,
  progressLogoValue,

  uploadProps,
  UploadWaterMarkTableProps,
  UploadLogoTableProps,
  UploadSignatureTableProps,

  handleSignatureFiles,
  handleWaterMarkFiles,
  handleLogoFiles,

  deleteSignatureFiles,
  deleteWaterMarkFiles,
  deleteLogoFiles,

  rejectedFiles,
  validateForm,
  getFiles,
  defaultIconsLucide,
} = useUploadVariablesForm()

defineExpose({
  deleteSignatureFiles,
  deleteWaterMarkFiles,
  deleteLogoFiles,
  validateForm,
  getFiles,
})
</script>

<style lang="scss" src="@/components/Forms/Normative/UploadVariablesForm/UploadVariablesForm.scss" scoped />
