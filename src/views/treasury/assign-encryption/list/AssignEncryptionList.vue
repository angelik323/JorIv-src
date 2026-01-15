<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          @update-page="updatePage"
          :custom-columns="['checkbox', 'actions']"
          @update-rows-per-page="updatePerPage"
        >
          <template #checkbox="{ row }">
            <q-checkbox
              :model-value="row.apply_encrypt"
              @update:model-value="(val) => (row.apply_encrypt = val)"
              dense
              color="orange"
              :disable="true"
            />
          </template>
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import { defaultIconsLucide } from '@/utils'
import useAssignEncryptionList from './AssignEncryptionList'

const {
  headerProps,
  tableProps,
  filterConfig,
  handleClear,
  handleFilter,
  updatePage,
  updatePerPage,
  handleOptions,
} = useAssignEncryptionList()
</script>
