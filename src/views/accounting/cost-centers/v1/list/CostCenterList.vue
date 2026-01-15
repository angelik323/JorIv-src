<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'CostCenterList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="() => handleGoTo('CostCenterCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filterFields"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="title"
          :loading="loading"
          :columns="columns"
          :rows="rows"
          :pages="pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="row.status_id"
              clickable
              @click="selectCostCenter(row)"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="validateRouter('Accounting', 'CostCenterList', 'show')"
              :left-icon="defaultIconsLucide.eye"
              colorIcon="#f45100"
              class-custom="custom"
              :outline="false"
              :flat="true"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'CostCenterView',
                  params: {
                    structure_id: row.account_structures_id,
                    chart_id: row.accounts_chart_id,
                  },
                })
              "
            />
            <Button
              v-if="validateRouter('Accounting', 'CostCenterList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              class-custom="custom"
              :outline="false"
              colorIcon="#f45100"
              :flat="true"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'CostCenterEdit',
                  params: {
                    structure_id: row.account_structures_id,
                    chart_id: row.accounts_chart_id,
                  },
                })
              "
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          :title="`¿Desea ${costCenterStatus} el centro de costo?`"
          @confirm="toggleCostCenterStatus"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import useCostCenterList from '@/views/accounting/cost-centers/v1/list/CostCenterList'
import { defaultIconsLucide } from '@/utils'

const alertModalRef = ref<any>(null)

const {
  headerProps,
  tableProps,
  costCenterStatus,
  validateRouter,
  handleFilter,
  handleClear,
  handleGoTo,
  updatePage,
  _selectCostCenter,
  _toggleCostCenterStatus,
  filterFields,
} = useCostCenterList()

const title = computed(() => tableProps.value.title)
const loading = computed(() => tableProps.value.loading)
const columns = computed(() => tableProps.value.columns)
const rows = computed(() => tableProps.value.rows)
const pages = computed(() => tableProps.value.pages)

const selectCostCenter = (row: any) => {
  _selectCostCenter(row)
  alertModalRef.value?.openModal()
}

const toggleCostCenterStatus = async () => {
  alertModalRef.value?.closeModal()
  await _toggleCostCenterStatus()
  updatePage(pages.value.currentPage)
}
</script>
