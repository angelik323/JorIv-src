<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'RecordTransfersList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('RecordTransfersCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions', 'status_id']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'RecordTransfersList',
                  'export'
                ) && tableProps.rows.length !== 0
              "
              class-custom="custom"
              :outline="true"
              label="Descargar excel"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              :left-img="imgButtonHeaderTable"
              @click="downloadExcel"
            />
          </template>

          <template #status_id="{ row }">
            <ShowStatus :type="Number(row?.status_id ?? 1)" />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter('BusinessTrust', 'RecordTransfersList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="
                $router.push({
                  name: 'DocumentAssignmentView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Editar -->
            <Button
              v-if="
                validateRouter('BusinessTrust', 'RecordTransfersList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              :disabled="row.status_id === 71"
              @click="
                $router.push({
                  name: 'RecordTransfersEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Eliminar -->
            <Button
              v-if="
                validateRouter('BusinessTrust', 'RecordTransfersList', 'delete')
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              :disabled="row.status_id === 71"
              @click="openAlertModal('eliminar', row.id)"
            />

            <!-- Descargar -->
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'RecordTransfersList',
                  'action_export_individual'
                )
              "
              :left-icon="defaultIconsLucide.download"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Descarga individual'"
              @click="downloadByRowExcel(row.id)"
            />

            <!-- Autorizar -->
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'RecordTransfersList',
                  'action_authorize'
                )
              "
              :left-icon="defaultIconsLucide.circleCheckBig"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Autorizar'"
              :disabled="row.status_id === 71 || row.status_id === 10"
              @click="
                $router.push({
                  name: 'DocumentAssignmentAuthorize',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      title="¿Desea eliminar la cesión?"
      @confirm="deleteRecord"
    >
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic
import useRecordTransfersList from './RecordTransfersList'

// utils
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  tableProps,
  filterConfig,
  alertModalRef,

  downloadExcel,
  downloadByRowExcel,
  handleFilter,
  handlerGoTo,
  updatePage,
  handleClearFilters,
  deleteRecord,
  openAlertModal,
  validateRouter,
  updateRowsPerPage,
} = useRecordTransfersList()
</script>
