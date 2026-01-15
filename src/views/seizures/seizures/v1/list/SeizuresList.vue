<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <template #addAfter>
        <Button
          v-if="validateRouter('Seizure', 'SeizuresList', 'create')"
          :label="headerProperties.btn.label"
          :icon="headerProperties.btn.icon"
          :dropdown-options="headerProperties.btn.options"
          :color="headerProperties.btn.color"
          :size="headerProperties.btn.size"
          :class-custom="headerProperties.btn.class"
          :disabled="headerProperties.btn.disable"
          :outline="headerProperties.btn.outline"
          color-icon="white"
        />
      </template>

      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <div class="flex justify-between items-center q-mb-md">
          <p class="text-h6 q-mb-none">{{ tableProperties.title }}</p>

          <div class="flex q-gutter-sm">
            <Button
              color="grey"
              :outline="false"
              class-custom="custom"
              color-icon="white"
              :left-icon="defaultIconsLucide.cog"
              label="Parámetros"
              @click="goToURL('SeizuresParametersList')"
            />

            <Button
              :outline="false"
              unelevated
              color="orange"
              class-custom="custom"
              :left-icon="defaultIconsLucide.folder"
              color-icon="white"
              label="Reporte"
              @click="handleReport"
            />
          </div>
        </div>

        <TableList
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['actions', 'status']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="row?.status?.id ?? 1" />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="validateRouter('Seizure', 'SeizuresList', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              outline
              @click="goToURL('SeizuresView', row.id)"
            />

            <Button
              v-if="
                validateRouter('Seizure', 'SeizuresList', 'edit') &&
                isRegisteredStatus(row?.status?.id)
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              outline
              @click="goToURL('SeizuresEdit', { id: row.id })"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Composables
import useSeizuresList from '@/views/seizures/seizures/v1/list/SeizuresList'

const {
  defaultIconsLucide,
  headerProperties,
  tableProperties,
  filterConfig,
  isRegisteredStatus,
  validateRouter,
  handleReport,
  goToURL,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
} = useSeizuresList()
</script>
