<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="handleGoTo('OperationalETFCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="_cleanOperationalETFsData"
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
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <CustomToggle
              :value="row.status.id === StatusID.ACTIVE"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click="openAlertModal('cambiar', row.etf_number)"
            />
          </template>
          <template #actions="{ row }">
            <!-- Editar -->
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'OperationalETFEdit',
                  params: {
                    id: row.etf_number,
                  },
                })
              "
            />

            <!-- Eliminar -->
            <Button
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="openAlertModal('eliminar', row.etf_number)"
            />
          </template>
        </TableList>
        <AlertModalComponent
          ref="alertModalRef"
          :title="alertModalConfig.title"
          @confirm="onConfirm"
        >
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components:
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import Button from '@/components/common/Button/Button.vue'
// Utils
import { defaultIconsLucide } from '@/utils'
// Logic view
import useOperationalETFList from './OperationalETFList'
// Interfaces
import { StatusID } from '@/interfaces/global'

const {
  // Props
  headerProps,
  tableProps,
  alertModalRef,
  filterConfig,
  // Methods
  handleFilter,
  handleGoTo,
  updatePage,
  updatePerPage,
  _cleanOperationalETFsData,
  onConfirm,
  openAlertModal,
  alertModalConfig,
} = useOperationalETFList()
</script>
