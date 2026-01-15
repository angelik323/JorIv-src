<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'StructureTypeList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handleGoTo('StructureTypeCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filters"
          @filter="handleUpdateFilters"
          @clear-filters="handleUpdateFilters"
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
            <ShowStatus
              :type="Number(row?.status?.id ?? 1)"
              clickable
              @click="selectStructureType(row)"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="validateRouter('Accounting', 'StructureTypeList', 'edit')"
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

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          :title="`¿Desea ${structureTypeStatus} el tipo de estructura?`"
          @confirm="toggleStructureTypeStatus"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import { defaultIconsLucide } from '@/utils'
import useStructureTypeList from './StructureTypeList'

const {
  headerProps,
  tableProps,
  filters,
  structureTypeStatus,
  alertModalRef,
  handleUpdateFilters,
  handleOptions,
  handleGoTo,
  updatePage,
  updatePerPage,
  selectStructureType,
  toggleStructureTypeStatus,
  validateRouter,
} = useStructureTypeList()
</script>
