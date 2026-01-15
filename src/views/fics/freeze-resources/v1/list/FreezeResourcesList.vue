<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <template #addAfter>
        <Button
          v-if="validateRouter('Fics', 'FreezeResourcesList', 'create')"
          :outline="headerProps.btn.outline"
          :label="headerProps.btn.label"
          :icon="headerProps.btn.icon"
          :color="headerProps.btn.color || 'primary'"
          :size="headerProps.btn.size || 'md'"
          :class-custom="headerProps.btn.class || 'btn-header'"
          :disabled="headerProps.btn.disable || false"
          :color-icon="'white'"
          :dropdown-options="headerProps.btn.options"
        />
      </template>

      <FiltersComponentV2
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClear"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <section v-else class="q-pt-md q-my-xl">
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
          <template #actions="{ row }">
            <Button
              :right-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToURL('FreezeResourcesView', row.id)"
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
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import { useFreezeResourcesList } from '@/views/fics/freeze-resources/v1/list/FreezeResourcesList'

const {
  goToURL,
  showState,
  tableProps,
  updatePage,
  handleClear,
  headerProps,
  filterConfig,
  isTableEmpty,
  handleFilter,
  updatePerPage,
  validateRouter,
  defaultIconsLucide,
} = useFreezeResourcesList()
</script>
