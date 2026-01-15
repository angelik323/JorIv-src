<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'EquivalentVaucherList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handleGoTo"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          v-if="showImportButton"
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          @update-page="updatePage"
          :custom-columns="['actions']"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter(
                  'Accounting',
                  'EquivalentVaucherList',
                  'action_import'
                )
              "
              outline
              :label="'Importar'"
              :left-icon="defaultIconsLucide.cloudUpload"
              color="orange"
              class-custom="custom"
              color-icon="black"
              :styleContent="{
                'place-items': 'center',
                'border-radius': '20px',
                width: '100px',
                height: '32px',
                'font-size': '13px',
                color: 'black',
              }"
              @click="
                $router.push({
                  name: 'EquivalentVaucherImport',
                  query: {},
                })
              "
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Accounting', 'EquivalentVaucherList', 'delete')
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="handleDeleteItem(row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="alertModalRef"
      :title="alertModalConfig.title"
      :description_message="alertModalConfig.description_message"
      :showBtnConfirm="true"
      :textBtnConfirm="'Eliminar'"
      :textBtnCancel="'Cerrar'"
      :showCloseBtn="true"
      :showImgDefault="true"
      @confirm="deleteEquivalentVaucher"
    />
  </div>
</template>

<script setup lang="ts">
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import { defaultIconsLucide } from '@/utils'
import Button from '@/components/common/Button/Button.vue'
import useEquivalentVaucherList from './EquivalentVaucherList'

const {
  headerProps,
  tableProps,
  filterConfig,
  alertModalRef,
  alertModalConfig,
  showImportButton,
  handleClear,
  handleFilter,
  handleGoTo,
  updatePage,
  updatePerPage,
  deleteEquivalentVaucher,
  handleDeleteItem,
  validateRouter,
} = useEquivalentVaucherList()
</script>
