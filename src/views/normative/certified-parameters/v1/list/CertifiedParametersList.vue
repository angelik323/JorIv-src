<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsDefault.title"
      :breadcrumbs="headerPropsDefault.breadcrumbs"
      :btn-label="
        validateRouter('Normative', 'CertifiedParametersList', 'create')
          ? headerPropsDefault.btn.label
          : ''
      "
      :btn-icon="headerPropsDefault.btn.icon"
      @to="goToURL('CertifiedParametersCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="Number(row.status?.id)"
              status-type="normative"
            />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Normative', 'CertifiedParametersList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('CertifiedParametersView', row.code)"
            />
            <Button
              v-if="
                validateRouter('Normative', 'CertifiedParametersList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('CertifiedParametersEdit', row.code)"
            />
            <Button
              v-if="
                validateRouter('Normative', 'CertifiedParametersList', 'delete')
              "
              :left-icon="defaultIconsLucide.trash"
              color="red"
              :outline="false"
              :flat="true"
              colorIcon="#d32f2f"
              tooltip="Eliminar"
              @click="openDeleteModal(row.code)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      :title="alertModalConfig.title"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
// logic
import useCertifiedParametersList from '@/views/normative/certified-parameters/v1/list/CertifiedParametersList'

const {
  defaultIconsLucide,
  headerPropsDefault,
  tableProperties,
  filterComponentRef,
  filterConfig,
  validateRouter,
  goToURL,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
  alertModalRef,
  alertModalConfig,
  handleDelete,
  openDeleteModal,
} = useCertifiedParametersList()
</script>
