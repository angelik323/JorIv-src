<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('BudgetAccountingHomologationList')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleSearch"
          @clear-filters="clearFilters"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['radio', 'status']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          :selection="homologationProcessData ? 'none' : 'multiple'"
          @selected="selectDocuments"
        >
          <template #custom-header>
            <div class="row justify-between full-width">
              <p class="text-black-90 text-weight-bold text-h6 q-mb-none">
                {{ tableProperties.title }}
              </p>
              <Button
                v-if="hasErrors"
                class-custom="custom"
                label="Reporte de errores"
                color="orange"
                outline
                :styleContent="{
                  'place-items': 'center',
                  color: 'black',
                }"
                :left-img="imgButtonHeaderTable"
                @click="downloadErrors"
              />
            </div>
          </template>
          <template #status="{ row }">
            <ShowStatus :type="row.status" status-type="budget" />
          </template>
        </TableList>
      </section>
      <section
        class="q-my-lg"
        aria-label="Controles de navegación entre secciones"
      >
        <div class="row justify-end q-gutter-md">
          <Button
            class="custom"
            :label="homologationProcessData ? 'Crear' : 'Ejecutar'"
            unelevated
            :outline="false"
            color="orange"
            :disabled="isRunningValidation"
            @click="
              homologationProcessData
                ? createHomologation()
                : validateHomologation()
            "
          />
        </div>
      </section>
      <AlertModalComponent
        ref="confirmHomologationModalRef"
        styleModal="min-width: 480px"
        :title="`El registro presentó errores`"
        :description_message="'¿Desea procesarlo parcialmente?'"
        @confirm="confirmHomologation"
      >
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// Logic view
import useBudgetAccountingHomologationCreate from '@/views/budget/budget-accounting-homologation/v1/create/BudgetAccountingHomologationCreate'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

const {
  hasErrors,
  headerProps,
  filterConfig,
  tableProperties,
  isRunningValidation,
  homologationProcessData,
  confirmHomologationModalRef,
  goToURL,
  updatePage,
  updatePerPage,
  clearFilters,
  handleSearch,
  createHomologation,
  validateHomologation,
  downloadErrors,
  selectDocuments,
  confirmHomologation,
} = useBudgetAccountingHomologationCreate()
</script>
