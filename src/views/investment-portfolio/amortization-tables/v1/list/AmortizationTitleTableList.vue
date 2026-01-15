<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      @to="handlerGoTo('AmortizationTitleTableCreate')"
    >
      <section>
        <FiltersComponent
          :fields="filters"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :title="headerProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <Button
              :right-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'AmortizationTitleTableView',
                  params: { id: row.id },
                })
              "
            />
            <Button
              :right-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                () =>
                  $router.push({
                    name: 'AmortizationTitleTableEdit',
                    params: { id: row.id },
                    query: { nemotecnico: row.mnemonic },
                  })
              "
            />
            <Button
              :right-icon="defaultIconsLucide.delete"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openAlertModal(row.id)"
            />
          </template>
        </TableList>
      </section>
      <AlertModalComponent
        ref="alertModalRef"
        styleModal="max-width: 400px; flex-direction: row;"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="changeStatus()"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import { useAmortizationTitleTableList } from './AmortizationTitleTableList'
import { defaultIconsLucide } from '@/utils'
const {
  headerProps,
  filters,
  tableProps,
  alertModalConfig,
  alertModalRef,
  updatePage,
  updatePerPage,
  changeStatus,
  openAlertModal,
  handleClear,
  handleFilter,
  handlerGoTo,
} = useAmortizationTitleTableList()
</script>
