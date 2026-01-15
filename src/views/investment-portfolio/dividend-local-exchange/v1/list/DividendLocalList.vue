<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <template #addAfter>
        <Button
          v-if="validateRouter('Accounting', 'AccoutingReportList', 'create')"
          :outline="headerProps.btn.outline"
          :label="headerProps.btn.label"
          :icon="headerProps.btn.icon"
          :color="headerProps.btn.color || 'primary'"
          :size="headerProps.btn.size || 'md'"
          :class-custom="headerProps.btn.class || 'btn-header'"
          :disabled="headerProps.btn.disable || false"
          :dropdown-options="btnOptions"
          :color-icon="'white'"
          @select="handleBtnSelect"
        />
      </template>
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="_cleanDividendLocalsData"
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
              @click="openAlertModal('cambiar', row.real_id)"
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
              @click="goToEdit(row)"
            />
            <!-- Ver -->
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToView(row)"
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
import useDividendLocalList from './DividendLocalList'
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
  updatePage,
  updatePerPage,
  _cleanDividendLocalsData,
  onConfirm,
  openAlertModal,
  alertModalConfig,
  handleBtnSelect,
  btnOptions,
  validateRouter,
  goToEdit,
  goToView,
} = useDividendLocalList()
</script>
