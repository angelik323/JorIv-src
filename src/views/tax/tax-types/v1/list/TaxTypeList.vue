<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="title"
      :breadcrumbs="breadcrumbs"
      :btn-label="'Crear'"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('TaxTypeCreate')"
    >
      <!-- :btn-label="
        validateRouter('Tax', 'TaxTypeList', 'create') ? 'Crear' : undefined
      " -->
      <section>
        <FiltersComponent
          :fields="filtersConfig"
          @filter="handlerFilter"
          @clear-filters="handlerClear"
        />
      </section>

      <section>
        <TableList
          :title="tableProps.title"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :loading="tableProps.loading"
          :pages="tableProps.pages"
          :custom-columns="tableProps.customColumns"
          @updatePage="updatePage"
        >
          <template #sign="{ row }">
            <p class="text-capitalize mb-0">{{ row.sign }}</p>
          </template>
          <template #scope="{ row }">
            <p class="text-capitalize mb-0">{{ row.scope }}</p>
          </template>
          <template #usage="{ row }">
            <p class="text-capitalize mb-0">{{ row.usage }}</p>
          </template>
          <template #status="{ row }">
            <CustomToggle
              :value="row.is_active"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click="openAlertModal('status', row)"
            />
          </template>

          <template #actions="{ row }">
            <Button
              :label="''"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="goToURL('TaxTypeEdit', { id: row.id })"
            />
            <Button
              :label="''"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="openAlertModal('delete', row)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :title="alertModalProps.title"
        :description_message="alertModalProps.description"
        @confirm="handlerAlertModal"
      />
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

import useTaxTypeList from '@/views/tax/tax-types/v1/list/TaxTypeList'

const {
  title,
  breadcrumbs,
  defaultIconsLucide,
  filtersConfig,
  tableProps,
  alertModalProps,
  alertModalRef,
  goToURL,
  handlerFilter,
  openAlertModal,
  handlerClear,
  handlerAlertModal,
  updatePage,
} = useTaxTypeList()
</script>
