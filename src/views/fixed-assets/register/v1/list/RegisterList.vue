<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsList.title"
      :breadcrumbs="headerPropsList.breadcrumbs"
      :btn-label="'Crear'"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('RegisterCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
          @update:values="handleUpdateFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['register_status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="tableProps.rows.length > 0"
              no-caps
              outline
              color="orange"
              :class-custom="headerPropsList.btn.class"
              :label="headerPropsList.btn.label"
              :styleContent="{
                'place-items': 'center',
                color: 'black'
              }"
              :text-color="headerPropsList.btn.color"
              :left-img="headerPropsList.btn.icon"
              @click="handleDownloadList"
            />
          </template>
          <template #register_status="{ row }">
            <ShowStatus :type="row.status.id" statusType="fixedAssets" />
          </template>
          <template #actions="{ row }">
            <Button
              tooltip="Ver"
              flat
              :outline="false"
              :left-icon="defaultIconsLucide.eye"
              @click="handleView(row.id)"
            />
            <Button
              tooltip="Editar"
              flat
              :outline="false"
              :left-icon="defaultIconsLucide.edit"
              @click="handleEdit(row.id)"
            />
            <Button
              tooltip="Generar código QR"
              flat
              :outline="false"
              :left-icon="defaultIconsLucide.qrCode"
              @click="handleQrCode(row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalQrRef"
      :title="selectedRegisterData.description"
      :description_message="selectedRegisterData.type"
      :show-btn-confirm="false"
      text-btn-cancel="Cancelar"
    >
      <template #default-body>
        <div class="column items-center q-gutter-md">
          <div class="q-pa-sm" style="border: 2px solid #f45100; border-radius: 8px">
            <span class="text-h6 text-weight-bold">{{ selectedRegisterData.serialCode }}</span>
          </div>
          <div
            class="flex justify-center items-center"
            style="min-height: 180px; min-width: 180px; border: 1px dashed #ccc"
          >
            <img
              :src="selectedRegisterData.qr_blob_url"
              alt="QR Code"
              style="width: 100%; height: 100%; object-fit: contain;"
            />
          </div>
        </div>
      </template>
    </AlertModalComponent>
  </div>
</template>
<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic-view
import useRegisterList from '@/views/fixed-assets/register/v1/list/RegisterList'

const {
  headerPropsList,
  defaultIconsLucide,

  filterConfig,
  tableProps,

  alertModalQrRef,
  selectedRegisterData,

  updatePage,
  updateRowsPerPage,
  handleFilter,
  handleClearFilters,
  handleUpdateFilters,

  handleView,
  handleEdit,
  handleDownloadList,
  goToURL,

  handleQrCode
} = useRegisterList()
</script>
