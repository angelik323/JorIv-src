<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'DocumentAssigns', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('DocumentAssignmentCreate')"
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
          :title="tableProps.rows.length > 0 ? tableProps.title : ''"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          :hideHeader="tableProps.rows.length === 0"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="tableProps.rows.length > 0 && validateRouter('BusinessTrust', 'DocumentAssigns', 'export')"
              :outline="true"
              :label="'Descargar excel'"
              :leftImg="excelIcon"
              :tooltip="'Descargar excel'"
              :size="'100%'"
              color="'white'"
              :colorIcon="'black'"
              :classCustom="'custom'"
              @click="uploadFileExcel"
            />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="validateRouter('BusinessTrust', 'DocumentAssigns', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="
                $router.push({
                  name: 'DocumentAssignmentRead',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Editar -->
            <Button
              v-if="validateRouter('BusinessTrust', 'DocumentAssigns', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="
                $router.push({
                  name: 'DocumentAssignmentEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'

// logic
import useDocumentAssignmentList from './DocumentAssignmentList'

// utils
import { defaultIconsLucide } from '@/utils'
import excelIcon from '@/assets/images/excel.svg'
const {
  headerProps,
  tableProps,
  filterConfig,

  handleFilter,
  handlerGoTo,
  updatePage,
  handleClearFilters,
  uploadFileExcel,
  validateRouter,
  updateRowsPerPage,
} = useDocumentAssignmentList()
</script>
