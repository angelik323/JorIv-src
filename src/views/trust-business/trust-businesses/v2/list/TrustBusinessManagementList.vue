<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsList.title"
      :breadcrumbs="headerPropsList.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'TrustBusinessesList', 'create')
          ? 'Crear'
          : ''
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'TrustBusinessesCreate' })"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersRef"
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
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'TrustBusinessesList',
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
              @click="downloadAction"
            />
          </template>

          <template #status="{ row }">
            <ShowStatus
              :type="Number(row?.status_id ?? 0)"
              status-type="trustBusiness"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('BusinessTrust', 'TrustBusinessesList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'TrustBusinessesRead',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <Button
              v-if="
                validateRouter('BusinessTrust', 'TrustBusinessesList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'TrustBusinessesEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <Button
              v-if="
                validateRouter('BusinessTrust', 'TrustBusinessesList', 'delete')
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              :disabled="row.status_id !== 56"
              @click="openAlertModal('eliminar', row.id)"
            />

            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'TrustBusinessesList',
                  'action_export_individual'
                )
              "
              :left-icon="defaultIconsLucide.download"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Descargar"
              @click="downloadAllDataByRow(row.id)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          title="¿Desea eliminar el negocio?"
          @confirm="changeStatusAction"
        >
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// composables
import { useUtils } from '@/composables'
const { defaultIconsLucide } = useUtils()

// assets
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// logic-view
import useTrustBusinessManagementList from '@/views/trust-business/trust-businesses/v2/list/TrustBusinessManagementList'

const {
  headerPropsList,
  tableProps,
  filterConfig,
  alertModalRef,
  filtersRef,
  downloadAllDataByRow,
  handleFilter,
  updatePage,
  openAlertModal,
  changeStatusAction,
  downloadAction,
  validateRouter,
  updateRowsPerPage,
  handleClearFilters,
} = useTrustBusinessManagementList()
</script>
