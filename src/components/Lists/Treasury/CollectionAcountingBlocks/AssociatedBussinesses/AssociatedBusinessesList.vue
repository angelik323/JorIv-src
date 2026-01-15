<template>
  <div class="q-mx-xl mt-0">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
    >
      <section class="mt-0">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="row justify-end">
        <Button
          class-custom="custom"
          :outline="true"
          label="Descargar"
          color="orange"
          :styleContent="{
            'place-items': 'center',
            color: 'black',
          }"
          :left-img="imgButtonHeaderTable"
          @click="downloadFile"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['select', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePage"
        >
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>


<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

import useAssociatedBusinessesList from './AssociatedBusinessesList'

const props = withDefaults(
  defineProps<{
    action: 'view'
    data?: number | 0
  }>(),
  {}
)

const {
  headerProps,
  defaultIconsLucide,
  filterConfig,
  tableProps,
  
  handleFilter,
  handleClear,
  updatePage,
  downloadFile,
} = useAssociatedBusinessesList(props)
</script>