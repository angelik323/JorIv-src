<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="$router.push({ name: 'ListLetterFormatCreate' })"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filters"
          :model-value="modelFilters"
          @filter="handleUpdateFilters"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="row.status?.id"
              clickable
              @click="selectLetterFormat(row)"
            />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />
            <Button
              :left-icon="defaultIconsLucide.trash"
              color="red"
              :outline="false"
              :flat="true"
              colorIcon="#d32f2f"
              tooltip="Eliminar"
              @click="handleOptions('delete', row.id)"
            />

            <Button
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'ListLetterFormatView',
                  params: { id: row.id },
                })
              "
            />
            <Button
              :left-icon="defaultIconsLucide.download"
              color="orange"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Descargar"
              @click="handleOptions('download', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      :title="alertModalConfig.title"
      @confirm="alertModalConfig.onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import useLetterFormatList from './ListLetterFormatList'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import { defaultIconsLucide } from '@/utils'

const {
  tableProps,
  headerProps,
  filters,
  modelFilters,
  alertModalRef,
  alertModalConfig,
  selectLetterFormat,
  handleClear,
  handleUpdateFilters,
  handleOptions,
  updatePage,
  updatePerPage,
} = useLetterFormatList()
</script>
