<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="title"
      :breadcrumbs="breadcrumbs"
      :btn-label="'Crear'"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('TaxesAndWithholdingsCreate')"
    >
      <section>
        <FiltersComponent
          :fields="filtersConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
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
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <CustomToggle
              :value="row.is_active"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
              @click=""
            />
          </template>

          <template #actions="{ row }">
            <Button
              :label="''"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="goToURL('TaxesAndWithholdingsRead', row.id)"
            />
            <Button
              :label="''"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="goToURL('TaxesAndWithholdingsEdit', row.id)"
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
            <Button
              :label="''"
              :left-icon="defaultIconsLucide.plus"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Vigencias'"
              @click="goToURL('TaxesAndWithholdingsValidities', row.id)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :title="alertModalProps.title"
        :description_message="alertModalProps.description"
        @confirm="handleAlertModal"
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

import useTaxesAndWithholdingsList from '@/views/tax/taxes-and-withholdings/v1/list/TaxesAndWithholdingsList'

const {
  title,
  breadcrumbs,
  defaultIconsLucide,
  filtersConfig,
  tableProps,
  alertModalProps,
  alertModalRef,
  goToURL,
  handleFilter,
  openAlertModal,
  handleClear,
  handleAlertModal,
  updatePage,
  updatePerPage,
} = useTaxesAndWithholdingsList()
</script>
