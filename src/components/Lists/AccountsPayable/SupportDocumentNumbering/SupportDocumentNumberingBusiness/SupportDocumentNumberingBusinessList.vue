<template>
  <div class="q-mx-xl">
    <TableList
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :custom-columns="['handles_issuer_data', 'actions', 'status']"
      @update-page="updatePage"
      @update-rows-per-page="updateRowsPerPage"
    >
      <template #handles_issuer_data="{ row }">
        <div class="flex justify-center q-mt-lg">
          <SwitchComponent
            :label-right="row.handles_issuer_data ? 'Si' : 'No'"
            color="orange"
            :model-value="row.handles_issuer_data"
            @update:model-value="handleChangeIssuerData(row)"
          />
        </div>
      </template>
      <template #status="{ row }">
        <!-- Cambiar estado -->
        <CustomToggle
          :value="isRowActive(row.status.id)"
          :width="100"
          :height="30"
          checked-text="Activo"
          unchecked-text="Inactivo"
          readonly
          @click="openAlertModal(row)"
        />
      </template>
      <template #actions="{ row }">
        <!-- Ver -->
        <Button
          v-if="
            validateRouter(
              'AccountsPayable',
              'SupportDocumentNumberingList',
              'show'
            )
          "
          v-show="!row.handles_issuer_data"
          :left-icon="defaultIconsLucide.eye"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          tooltip="Ver"
          @click="
            goToURL('SupportDocumentNumberingBusinessView', {
              issuer_id: supportDocumentNumberingId,
              resolution_id: props.resolutionId,
              business_id: row.id,
            })
          "
        />

        <!-- Editar -->
        <Button
          v-if="
            validateRouter(
              'AccountsPayable',
              'SupportDocumentNumberingList',
              'edit'
            )
          "
          v-show="!row.handles_issuer_data"
          :left-icon="defaultIconsLucide.edit"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          tooltip="Editar"
          @click="
            goToURL('SupportDocumentNumberingBusinessEdit', {
              issuer_id: supportDocumentNumberingId,
              resolution_id: props.resolutionId,
              business_id: row.id,
            })
          "
        />
      </template>
    </TableList>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 470px"
      :showImgDefault="false"
      :title="alertModalConfig.title"
      :textBtnConfirm="alertModalConfig.textBtnConfirm"
      :textBtnCancel="alertModalConfig.textBtnCancel"
      @confirm="toggleStatus()"
    >
      <template #default-img>
        <q-img
          src="@/assets/images/icons/alert_popup.svg"
          max-width="80px"
          width="80px"
          fit="contain"
          alt="Imagen de alerta"
        />
      </template>
    </AlertModalComponent>
  </div>
</template>

<script lang="ts" setup>
//Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import SwitchComponent from '@/components/common/Switch/SwitchComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic
import useSupportDocumentNumberingBusinessList from '@/components/Lists/AccountsPayable/SupportDocumentNumbering/SupportDocumentNumberingBusiness/SupportDocumentNumberingBusinessList'

const props = withDefaults(
  defineProps<{
    resolutionId: number | null
    third_party_id: null | number
  }>(),
  {}
)
const {
  defaultIconsLucide,
  tableProps,
  supportDocumentNumberingId,
  alertModalRef,
  alertModalConfig,
  isRowActive,
  openAlertModal,
  toggleStatus,
  handleChangeIssuerData,
  updatePage,
  updateRowsPerPage,
  goToURL,
  validateRouter,
} = useSupportDocumentNumberingBusinessList(props)
</script>
