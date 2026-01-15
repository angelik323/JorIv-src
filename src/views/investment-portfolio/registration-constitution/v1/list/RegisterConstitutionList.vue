<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @btn-select="handleBtnSelect"
    >
      <template #addAfter>
        <Button
          v-if="validateRouter('Accounting', 'AccoutingReportList', 'create')"
          :outline="headerProps.btn.outline"
          :label="headerProps.btn.label"
          :icon="headerProps.btn.icon"
          :color="headerProps.btn.color || 'primary'"
          :size="headerProps.btn.size || 'md'"
          :class-custom="headerProps.btn.class || 'btn-header'"
          :disabled="headerProps.btn.disable || false"
          :dropdown-options="btnOptions"
          :color-icon="'white'"
          @select="handleBtnSelect"
        />
      </template>
      <section>
        <FiltersComponentV2
          @filter="handleFilter"
          :fields="filters"
          @clear-filters="handleClear"
        />
        <section class="q-mt-xl">
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :columns="tableProps.columns"
            :custom-columns="['status', 'actions']"
            @update-page="updatePage"
            @update-rows-per-page="updatePerPage"
          />
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import { useRegisterConstitutionList } from './RegisterConstitutionList'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProps,
  tableProps,
  filters,
  handleFilter,
  handleClear,
  updatePage,
  updatePerPage,
  handleBtnSelect,
  validateRouter,
  btnOptions,
} = useRegisterConstitutionList()
</script>
