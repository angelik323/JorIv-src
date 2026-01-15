<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'GuaranteesList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'GuaranteesCreate' })"
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
          :custom-columns="[
            'registration_status',
            'guarantee_status',
            'actions',
          ]"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter('BusinessTrust', 'GuaranteesList', 'export') &&
                tableProps.rows.length !== 0
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
              @click="uploadFileExcel"
            />
          </template>

          <template #registration_status="{ row }">
            <ShowStatus :type="Number(row?.registration_status?.id ?? 0)" />
          </template>

          <template #guarantee_status="{ row }">
            <ShowStatus :type="Number(row?.guarantee_status?.id ?? 0)" />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="validateRouter('BusinessTrust', 'GuaranteesList', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'GuaranteesRead',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Editar -->
            <Button
              v-if="validateRouter('BusinessTrust', 'GuaranteesList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'GuaranteesEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Eliminar -->
            <Button
              v-if="validateRouter('BusinessTrust', 'GuaranteesList', 'delete')"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              :disabled="
                row.status_id === 10 || row.registration_status.id === 71
              "
              @click="openAlertModal('eliminar', row.id)"
            />

            <!-- Descargar -->
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'GuaranteesList',
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
              v-if="validateRouter('BusinessTrust', 'GuaranteesList', 'edit')"
              :left-icon="defaultIconsLucide.circleCheckBig"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              :disabled="row.registration_status.id !== 63"
              colorIcon="#f45100"
              :tooltip="'Autorizar'"
              @click="
                $router.push({
                  name: 'GuaranteesAuthorize',
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
      title="¿Desea eliminar la garantía?"
      @confirm="deleteRealStateProject"
    >
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Utils & Assets
import { defaultIconsLucide } from '@/utils'

// Logic view
import useGuaranteesList from '@/views/trust-business/guarantees/v1/list/GuaranteesList'

const {
  headerProps,
  tableProps,
  filterConfig,
  alertModalRef,

  uploadFileExcel,
  handleFilter,
  updatePage,
  downloadByRowExcel,
  deleteRealStateProject,
  openAlertModal,
  handleClearFilters,
  validateRouter,
  updateRowsPerPage,
} = useGuaranteesList()
</script>
