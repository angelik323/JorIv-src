<template>
  <div class="q-mx-xl">
    <TableList
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :custom-columns="['has_business_prefix', 'actions', 'status']"
      selection="single"
      @selected="handleSelection"
      @update-page="updatePage"
      @update-rows-per-page="updateRowsPerPage"
    >
      <template #has_business_prefix="{ row }">
        <!-- Aplica prefijo -->
        <Icon
          v-if="row.has_business_prefix"
          name="CheckCircle2"
          :size="20"
          color="orange"
        />
        <Icon v-else name="XCircle" :size="20" color="grey" />
      </template>
      <template #status="{ row }">
        <!-- Estado -->
        <ShowStatus status-type="accountsPayable" :type="row.status.id ?? 0" />
      </template>
      <template #actions="{ row }">
        <!-- Editar -->
        <Button
          v-if="
            validateRouter(
              'AccountsPayable',
              'SupportDocumentNumberingList',
              'edit'
            )
          "
          :left-icon="defaultIconsLucide.edit"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          tooltip="Editar"
          @click="
            goToURL('SupportDocumentNumberingResolutionsEdit', {
              issuer_id: supportDocumentNumberingId,
              resolution_id: row.id,
            })
          "
        />

        <!-- Eliminar -->
        <Button
          v-if="
            validateRouter(
              'AccountsPayable',
              'SupportDocumentNumberingList',
              'delete'
            )
          "
          :outline="false"
          :left-icon="defaultIconsLucide.trash"
          color="orange"
          :flat="true"
          :class-custom="'custom'"
          tooltip="Eliminar"
          @click="openAlertModal(row)"
        />
      </template>
    </TableList>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 470px"
      :showImgDefault="false"
      :title="alertModalConfig.description"
      :textBtnConfirm="alertModalConfig.textBtnConfirm"
      :textBtnCancel="alertModalConfig.textBtnCancel"
      @confirm="handleDelete()"
    >
      <template #default-img>
        <q-img
          src="@/assets/images/icons/alert_popup_delete.svg"
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
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Icon from '@/components/common/Icon/Icon.vue'

// Logic
import useSupportDocumentNumberingResolutionsList from '@/components/Lists/AccountsPayable/SupportDocumentNumbering/SupportDocumentNumberingResolutions/SupportDocumentNumberingResolutionsList'

const props = withDefaults(
  defineProps<{
    third_party_id: number
  }>(),
  {}
)

const emits = defineEmits<(e: 'selectedResolution', value: number) => void>()

const {
  defaultIconsLucide,
  tableProps,
  alertModalRef,
  alertModalConfig,
  supportDocumentNumberingId,
  handleSelection,
  updatePage,
  updateRowsPerPage,
  openAlertModal,
  handleDelete,
  goToURL,
  validateRouter,
} = useSupportDocumentNumberingResolutionsList(props, emits)
</script>
