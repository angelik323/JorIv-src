<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Fics', 'BusinessLineList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircle"
      @to="goToURL('BusinessLineCreate')"
    >
      <FiltersComponent
        @filter="handleFilter"
        :fields="filterConfig"
        @clear-filters="_cleanData"
      />

      <section class="q-pt-md">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="selected_type"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="selectType($event)"
        />

        <NoDataState
          v-if="isTableEmpty"
          :type="showState === 0 ? 'empty' : 'no-results'"
        />

        <div class="q-mt-lg" v-else>
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
              <ShowStatus :type="Number(row?.status_id ?? 1)" />
            </template>

            <template #actions="{ row }">
              <Button
                v-if="validateRouter('Fics', 'BusinessLineList', 'edit')"
                :left-icon="defaultIconsLucide.edit"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                :colorIcon="
                  row.status_id === BusinessLineStatusID.CANCELLED
                    ? 'gray'
                    : '#f45100'
                "
                tooltip="Editar"
                :disabled="row.status_id === BusinessLineStatusID.CANCELLED"
                @click="goToURL('BusinessLineEdit', row.id)"
              />
            </template>
          </TableList>
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Interfaces
import { BusinessLineStatusID } from '@/interfaces/global'

// Logic view
import useBusinessLineList from '@/views/fics/business-line/v1/list/BusinessLineList'

const {
  goToURL,
  showState,
  selectType,
  _cleanData,
  updatePage,
  tableProps,
  headerProps,
  handleFilter,
  isTableEmpty,
  filterConfig,
  filteredTabs,
  tabActiveIdx,
  selected_type,
  updatePerPage,
  validateRouter,
  defaultIconsLucide,
} = useBusinessLineList()
</script>
