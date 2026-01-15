<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'RealStateProjectList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('RealStateProjectCreate')"
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
          <template #status_id="{ row }">
            <ShowStatus :type="Number(row?.status_id ?? 1)" />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter('BusinessTrust', 'RealStateProjectList', 'show')
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
                  name: 'RealStateProjectView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Editar -->
            <Button
              v-if="
                validateRouter('BusinessTrust', 'RealStateProjectList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              :disabled="row.status_id === 10"
              @click="
                $router.push({
                  name: 'RealStateProjectEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Eliminar -->
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'RealStateProjectList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              :disabled="row.status_id !== TrustBusinessStatusID.HAS_DELETE"
              @click="openAlertModal('eliminar', row.id)"
            />

            <!-- Descargar -->
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'RealStateProjectList',
                  'export'
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
          </template>
        </TableList>
      </section>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      title="¿Desea eliminar el proyecto?"
      @confirm="deleteRealStateProject"
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
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic
import useRealStateProjectList from './RealStateProjectList'

// utils
import { useUtils } from '@/composables'
const defaultIconsLucide = useUtils().defaultIconsLucide

const {
  headerProps,
  tableProps,
  filterConfig,
  alertModalRef,
  TrustBusinessStatusID,

  downloadByRowExcel,
  handleFilter,
  handlerGoTo,
  updatePage,
  handleClearFilters,
  deleteRealStateProject,
  openAlertModal,
  validateRouter,
  updateRowsPerPage,
} = useRealStateProjectList()
</script>
