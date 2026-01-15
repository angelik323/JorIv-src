<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          show_actions
          ref="filtersRef"
          :fields="filterConfig"
          :buttons="['more_filters']"
          trigger_event_by_field
          @filter="handleFilter"
          @show-more="handleShowFilters"
          @update:values="onChangeFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="[
            'status',
            'status_respopnse',
            'status_approval',
            'actions',
          ]"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="validateRouter('Treasury', 'DispersionGroupList', 'export')"
              class-custom="custom"
              :outline="true"
              label="Descargar excel"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              @click="onDdownloadExcel"
              :left-img="imgButtonHeaderTable"
              :disabled="tableProps.rows.length > 0 ? false : true"
            />
          </template>
          <template #status="{ row }">
            <ShowStatus
              :type="row.status.id ?? 1"
              :statusType="'treasury'"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <template #status_respopnse="{ row }">
            <ShowStatus
              :type="row.status_respopnse.id ?? 0"
              :statusType="'treasury'"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <template #status_approval="{ row }">
            <ShowStatus
              v-if="row.status_approval.id"
              :type="row.status_approval.id"
              :statusType="'treasury'"
              class-custom="q-px-sm q-py-xs"
              v-show="row.status_approval.id"
            />
            <span v-else class="flex justify-center"> - </span>
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="validateRouter('Treasury', 'DispersionGroupList', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                () => {
                  handlerGroupSelected(row)
                  $router.push({
                    name: 'DispersionGroupView',
                    params: { id: row.id },
                  })
                }
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useDispersionGroupList from '@/views/treasury/dispersion-group/v1/list/DispersionGroupList'

// Utils
import { defaultIconsLucide } from '@/utils'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

const {
  filterConfig,
  headerProps,
  filtersRef,
  tableProps,
  handlerGroupSelected,
  handleClearFilters,
  handleShowFilters,
  onDdownloadExcel,
  validateRouter,
  onChangeFilter,
  updatePerPage,
  handleFilter,
  updatePage,
} = useDispersionGroupList()
</script>
