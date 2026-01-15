<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
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
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header>
            <div class="row q-col-gutter-sm" style="width: 100%">
              <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center">
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tableProps.title }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2">
                <div class="row justify-end">
                  <Button
                    v-if="
                      validateRouter(
                        'BusinessTrust',
                        'TrustBusinessesList',
                        'export'
                      )
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
                    :disabled="tableProps.rows.length === 0"
                  />
                </div>
              </div>
            </div>
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
                validateRouter('BusinessTrust', 'TrustBusinessesList', 'export')
              "
              :left-icon="defaultIconsLucide.download"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Descargar"
              @click="openDownloadModal(row.id)"
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

        <AlertModalComponentDownload
          ref="modalDownloadRef"
          styleModal="min-width: 480px"
          title="Seleccione el campo que desea en su descarga"
          :showImgDefault="false"
          :show-btn-cancel="false"
          :show-btn-confirm="false"
        >
          <template #default-body>
            <ModalDownload @save="downloadDataByRow" />
          </template>
        </AlertModalComponentDownload>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import AlertModalComponentDownload from '@/components/common/AlertModal/AlertModalComponent.vue'
import ModalDownload from '@/components/Forms/TrustBusiness/ModalDownload/ModalDownload.vue'

// Utils & Assets
import { defaultIconsLucide } from '@/utils'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// Logic view
import useTrustBusinessesList from '@/views/trust-business/trust-businesses/v1/list/TrustBusinessesList'

const {
  headerProps,
  tableProps,
  filterConfig,
  alertModalRef,
  modalDownloadRef,
  openDownloadModal,
  downloadDataByRow,
  handleFilter,
  updatePage,
  openAlertModal,
  changeStatusAction,
  downloadAction,
  validateRouter,
  updateRowsPerPage,
  handleClearFilters,
} = useTrustBusinessesList()
</script>
