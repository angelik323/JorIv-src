<template>
  <div class="q-mx-xl">
    <ContentComponent
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      indentation
      content-indentation
      @on-back="goToURL('SarlaftRemoteMassAuthorization')"
    >
      <div class="q-mt-md">
        <div class="q-mb-lg">
          <span class="text-weight-bold text-h6">Listado de terceros</span>
        </div>
        <TableList
          ref="tableListRef"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['matchLevel', 'status', 'ownList']"
          selection="multiple"
          @update:selected="onUpdateSelected"
          @updatePage="onPaginateHandler"
          @updateRowsPerPage="onRowsPerPageHandler"
        >
          <template #matchLevel="{ row }">
            <div class="row items-center justify-center">
              <ShowStatus
                :type="row.matchLevelStatusId"
                status-type="sarlaft"
              />
            </div>
          </template>
          <template #ownList="{ row }">
            <span>{{ row.ownList ?? 'N/A' }}</span>
          </template>
          <template #status="{ row }">
            <div class="row items-center justify-center">
              <ShowStatus :type="row.statusId" status-type="default" />
            </div>
          </template>
        </TableList>
      </div>

      <div v-if="tableProps.rows.length > 0" class="q-mt-lg">
        <div class="row justify-end q-gutter-md">
          <q-btn
            size="md"
            unelevated
            outline
            color="orange"
            class="text-capitalize btn-filter custom"
            label="Rechazar"
            :disable="!hasSelectedRows"
            @click="handleReject"
          />
          <q-btn
            size="md"
            unelevated
            color="orange"
            class="text-capitalize btn-filter custom"
            label="Autorizar"
            :disable="!hasSelectedRows"
            @click="handleAuthorize"
          />
        </div>
      </div>
    </ContentComponent>
  </div>

  <AlertModalComponent
    ref="alertModalRef"
    :title="modalTitle"
    :show-img-default="true"
    text-btn-confirm="Aceptar"
    text-btn-cancel="Cancelar"
    @confirm="onConfirmAction"
    @close="onCancelAction"
    styleModal="max-width: 100%; width: 500px;"
  >
    <template #default-body>
      <div class="q-pa-md">
        <GenericInputComponent
          :default_value="justification"
          type="textarea"
          label="Justificación"
          :required="true"
          :rules="[(val) => !!val || 'La justificación es requerida']"
          @update:modelValue="justification = $event"
        />
      </div>
    </template>
  </AlertModalComponent>
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Logic
import useRemoteMassAuthorizationDetail from '@/views/sarlaft/remote-mass-authorization/v1/detail/RemoteMassAuthorizationDetail'

const {
  headerProps,
  tableProps,
  hasSelectedRows,
  modalTitle,
  justification,
  alertModalRef,
  goToURL,
  onUpdateSelected,
  handleAuthorize,
  handleReject,
  onConfirmAction,
  onCancelAction,
  onPaginateHandler,
  onRowsPerPageHandler,
  tableListRef,
} = useRemoteMassAuthorizationDetail()
</script>
