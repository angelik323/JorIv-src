<template>
  <div>
    <VCard class="q-pa-lg">
      <template #content-card>
        <section>
          <FiltersComponent
            ref="filterComponentRef"
            :fields="filterConfig"
            @filter="handleFilter"
            @update:values="handleFilterUpdate"
          />
        </section>
        <section>
          <div
            v-if="tableProps.rows.length"
            class="row justify-between items-center full-width q-my-lg"
          >
            <p class="text-bold mb-0 text-black-90 text-h6">
              Listado de proceso de homologación
            </p>
            <q-btn
              outline
              unelevated
              class="text-capitalize btn-filter custom"
              size="100%"
              color="orange"
              @click="downloadResults"
              :tooltip="'Descargar excel'"
            >
              <div class="text-black flex align-center">
                <img
                  class="image-excel q-mr-sm"
                  src="@/assets/images/excel.svg"
                  alt="Excel Icon"
                />
                Descargar excel
              </div>
            </q-btn>
          </div>
          <VCard class="q-px-lg">
            <template #content-card>
              <TableList
                dense
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :pages="tableProps.pages"
                :rows="tableProps.rows"
                :hide-header="!tableProps.rows.length"
                :custom-columns="['status']"
                @update-page="updatePage"
                @update-rows-per-page="updatePerPage"
              >
                <template #status="{ row }">
                  <ShowStatus :type="getStatus(row.status)" />
                </template>
              </TableList>
            </template>
          </VCard>
        </section>
      </template>
    </VCard>
  </div>
</template>
<script setup lang="ts">
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'

import useDetailedViewForm from '@/components/Forms/Accounting/HomologationProcess/DetailedView/DetailedViewForm'

const props = defineProps<{
  id: number
}>()

const {
  filterComponentRef,
  filterConfig,
  tableProps,
  handleFilterUpdate,
  handleFilter,
  updatePage,
  updatePerPage,
  getStatus,
  downloadResults,
} = useDetailedViewForm(props)
</script>
