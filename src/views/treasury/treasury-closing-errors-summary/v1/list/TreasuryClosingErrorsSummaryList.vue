<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="handleGoBack"
    >
      <section>
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        />
        <div
          class="q-mt-lg flex q-gutter-x-md justify-end"
          v-if="!isTreasuryClosingErrorsSummaryListEmpty"
        >
          <Button
            :outline="true"
            label="Descargar excel"
            size="md"
            color="orange"
            :style-text="{ color: '#333', fontWeight: 'bold' }"
            class="btn-filter custom"
            @click="downloadAction"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
//Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
//Logic view
import useTreasuryClosingErrorsSummaryList from './TreasuryClosingErrorsSummaryList'

const {
  headerProps,
  handleGoBack,
  tableProps,
  isTreasuryClosingErrorsSummaryListEmpty,
  updatePage,
  updateRowsPerPage,
  downloadAction,
} = useTreasuryClosingErrorsSummaryList()
</script>
