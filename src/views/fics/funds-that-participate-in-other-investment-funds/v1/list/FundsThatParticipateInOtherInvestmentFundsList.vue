<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <FiltersComponent
        @filter="handleFilter"
        :fields="filterConfig"
        @clear-filters="handleClear"
      />

      <NoDataState
        v-if="tableProps.rows.length === 0"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <section v-else>
        <TabsComponent
          :tabs="tabs"
          :tabActive="activeTab"
          :tabActiveIdx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <section>
              <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pa-lg">
                <div :class="['col-12', 'col-md-6']">
                  <GenericInputComponent
                    label="Fondo origen"
                    :default_value="selectedFundLabel"
                    :readonly="true"
                  />
                </div>
                <div :class="['col-12', 'col-md-6']">
                  <GenericInputComponent
                    label="Negocio"
                    :default_value="`${fund_origin_info.business_trust.business_code} - ${fund_origin_info.business_trust.name}`"
                    :readonly="true"
                  />
                </div>
              </div>
            </section>
          </template>
        </VCard>

        <section class="q-mt-xl">
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :columns="tableProps.columns"
            :custom-columns="['select', 'status']"
            @update-page="updatePage"
            @update-rows-per-page="updatePerPage"
          >
            <template #select="{ row }">
              <div class="flex justify-center">
                <q-radio
                  dense
                  size="sm"
                  v-model="selectedId"
                  :val="row.id"
                  color="orange"
                  @update:model-value="selectPlan($event)"
                />
              </div>
            </template>

            <template #status="{ row }">
              <ShowStatus :type="Number(row?.status.id ?? 1)" clickable />
            </template>
          </TableList>
        </section>

        <section v-if="selectedId">
          <div class="flex justify-between items-center">
            <h6>Movimientos</h6>

            <Button
              no-caps
              outline
              class-custom="custom"
              label="Descargar excel"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              :text-color="'orange'"
              :left-img="excelIcon"
              @click="downloadAction"
              :disabled="tableMovementProps.rows.length === 0"
            >
              <img
                class="image-excel"
                src="@/assets/images/excel.svg"
                alt="Excel Icon"
              />
              Descargar plantilla
            </Button>
          </div>

          <FiltersComponent
            :fields="filterMovement"
            @filter="handleFilterMovements"
            @clear-filters="handleClearMovements"
          />
          <TableList
            :loading="tableMovementProps.loading"
            :rows="tableMovementProps.rows"
            :pages="tableMovementProps.pages"
            :columns="tableMovementProps.columns"
            @update-page="updatePageMovements"
            @update-rows-per-page="updatePerPageMovements"
          />
        </section>

        <NoDataState type="empty" v-else />
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic view
import { useFundsThatParticipateInOtherInvestmentFundsList } from '@/views/fics/funds-that-participate-in-other-investment-funds/v1/list/FundsThatParticipateInOtherInvestmentFundsList'

const {
  tabs,
  activeTab,
  showState,
  selectedId,
  tableProps,
  updatePage,
  selectPlan,
  handleClear,
  tabActiveIdx,
  handleFilter,
  filterConfig,
  updatePerPage,
  filterMovement,
  downloadAction,
  headerProperties,
  fund_origin_info,
  selectedFundLabel,
  tableMovementProps,
  updatePageMovements,
  handleClearMovements,
  handleFilterMovements,
  updatePerPageMovements,
} = useFundsThatParticipateInOtherInvestmentFundsList()
</script>
