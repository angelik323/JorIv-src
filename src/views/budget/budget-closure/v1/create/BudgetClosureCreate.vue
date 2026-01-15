<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      show-back-btn
      :title="headerConfig.title"
      :breadcrumbs="headerConfig.breadcrumbs"
      @on-back="handleGoToProcessList"
    >
      <section class="q-mt-md q-gutter-y-md">
        <TabsComponent :tabs :tabActive :tabActiveIdx />
        <q-form>
          <VCard custom-style="margin-bottom: 0; padding: 0 1rem;">
            <template #content-card>
              <div class="row justify-between items-center">
                <p class="mb-0">Tipo de proceso</p>
                <RadioYesNo
                  v-model="processType"
                  :options="BUDGET_CLOSURE_CREATE_PROCESS_TYPE_FILTER_OPTIONS"
                />
              </div>
            </template>
          </VCard>
        </q-form>
        <FiltersComponent
          ref="filtersRef"
          :fields="filtersConfig"
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
          @update:values="handleFiltersUpdate"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="businessTableProps.title"
          :loading="businessTableProps.loading"
          :columns="businessTableProps.columns"
          :rows="businessTableProps.rows"
          :pages="businessTableProps.pages"
          selection="multiple"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdateRowsPerPage"
          @update:selected="handleSelectBusinesses"
        />
      </section>

      <section class="q-mt-xl">
        <div class="row justify-end items-center">
          <Button
            label="Ejecutar"
            size="md"
            class-custom="custom"
            color="orange"
            :outline="false"
            :disabled="!hasSelectedBusinesses"
            @click="handleExecuteProcess"
          />
        </div>
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="alertModalRef"
      description_message="Una vez finalizado el proceso, le será informado mediante el sistema de notificaciones de la plataforma."
      :title="alertModalTitle"
      :show-btn-cancel="false"
      @confirm="handleGoToProcessList"
    />
  </div>
</template>

<script setup lang="ts">
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useBudgetClosureCreate from '@/views/budget/budget-closure/v1/create/BudgetClosureCreate'

const {
  BUDGET_CLOSURE_CREATE_PROCESS_TYPE_FILTER_OPTIONS,

  headerConfig,
  tabs,
  tabActive,
  tabActiveIdx,
  alertModalRef,
  alertModalTitle,
  processType,
  filtersRef,
  filtersConfig,
  businessTableProps,
  hasSelectedBusinesses,

  handleFiltersUpdate,
  handleFilterSearch,
  handleClearFilters,
  handleUpdatePage,
  handleUpdateRowsPerPage,
  handleExecuteProcess,
  handleGoToProcessList,
  handleSelectBusinesses,
} = useBudgetClosureCreate()
</script>
