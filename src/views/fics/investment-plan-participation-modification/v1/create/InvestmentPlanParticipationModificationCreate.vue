<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('InvestmentPlanParticipationModificationList')"
    >
      <FiltersComponentV2
        ref="filtersRef"
        :fields="filterConfig"
        @filter="handleSearch"
        @clear-filters="handleClear"
      />

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div class="q-pt-md q-my-xl" v-else>
        <TableList
          :key="tableKey"
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="[
            'plan_status',
            'new_business_line_id',
            'authorization_status',
            'id',
          ]"
          selection="multiple"
          @update:selected="selectedRows = $event"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #id="{ index }">
            {{ index + 1 }}
          </template>

          <template #plan_status="{ row }">
            <ShowStatus :type="Number(row.plan_status.id)" />
          </template>

          <template #new_business_line_id="{ row }">
            <GenericSelectorComponent
              :manual_option="fic_business_lines"
              map_options
              required
              :default_value="row.new_business_line_id ?? ''"
              auto_complete
              clearable
              display_value="business_line_id"
              :placeholder="'Seleccione'"
              :rules="[(val: string) => useRules().is_required(val, 'Nueva linea de negocio es requerida')]"
              @update:modelValue="row.new_business_line_id = $event"
            />
          </template>

          <template #authorization_status="{ row }">
            <ShowStatus :type="Number(row.authorization_status.id)" />
          </template>
        </TableList>

        <div class="row justify-end q-gutter-md">
          <Button
            :outline="false"
            :class-custom="'custom'"
            label="Confirmar"
            size="md"
            color="orange"
            :disabled="!canSubmit"
            @click="onSubmit"
          />
        </div>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Composables
import { useRules } from '@/composables'

// Logic view
import useInvestmentPlanParticipationModificationCreate from '@/views/fics/investment-plan-participation-modification/v1/create/InvestmentPlanParticipationModificationCreate'

const {
  goToURL,
  onSubmit,
  canSubmit,
  showState,
  tableProps,
  updatePage,
  headerProps,
  handleClear,
  isTableEmpty,
  filterConfig,
  selectedRows,
  handleSearch,
  updatePerPage,
  filtersRef,
  fic_business_lines,
  tableKey,
} = useInvestmentPlanParticipationModificationCreate()
</script>
