<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="activeTab"
          :tab-active-idx="activeTabIdx"
        />
        <VCard>
          <template #content-card>
            <InformationLegalization
              v-show="activeTab === 'information'"
              :data="genericInvestmentPlan"
              action="view"
            />
          </template>
        </VCard>

        <VCard>
          <template #content-card>
            <section class="q-mx-lg q-mt-lg">
              <div class="row justify-start items-center">
                <p class="text-weight-bold text-subtitle1 q-mb-lg">
                  {{ tableProps.title }}
                </p>
              </div>

              <FiltersComponent
                show_actions
                :fields="filterConfig"
                @filter="handleFilter"
                @clear-filters="handleClearFilter"
              />

              <VCard>
                <template #content-card>
                  <section class="q-mx-lg">
                    <TableList
                      :loading="tableProps.loading"
                      :columns="tableProps.columns"
                      :rows="tableProps.rows"
                      :pages="tableProps.pages"
                      selection="single"
                      :custom-columns="['destination_plans']"
                      @update-page="handleUpdatePage"
                      @update-rows-per-page="handleUpdateRowsPerPage"
                      @selected="handleSelectedLegalizations($event.selected)"
                    >
                      <template #destination_plans="{ row }">
                        <section>
                          <div class="custom-destination-plans-text">
                            {{ `${row.destination_plans.length} destinos` }}
                          </div>
                          <q-tooltip
                            anchor="top middle"
                            self="bottom middle"
                            :offset="[10, 10]"
                          >
                            <div
                              v-for="destination in row.destination_plans"
                              class="text-body2"
                            >
                              {{ destination.code }}
                            </div>
                          </q-tooltip>
                        </section>
                      </template>
                    </TableList>
                  </section>
                </template>
              </VCard>
            </section>

            <div class="q-mx-lg q-mb-lg row justify-end">
              <Button
                :outline="false"
                :disabled="!hasSelectedLegalization"
                label="Anular transferencias"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="handleOpenCancelLegalizationsModal"
              />
            </div>
          </template>
        </VCard>

        <AlertModalComponent
          ref="cancelLegalizationsModalRef"
          :title="cancelLegalizationsModalProps.title"
          :description_message="cancelLegalizationsModalProps.description"
          @confirm="handleCancelLegalizations"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import InformationLegalization from '@/components/Forms/Fics/GenericInvestmentPlans/LegalizationResources/InformationLegalization/InformationLegalization.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useLegalizationResourcesCancel from '@/views/fics/generic-investment-plans/v1/cancel-legalization/LegalizationResourcesCancel'

const {
  tabs,
  activeTab,
  tableProps,
  headerProps,
  filterConfig,
  activeTabIdx,
  handleFilter,
  handleGoToList,
  handleUpdatePage,
  handleClearFilter,
  genericInvestmentPlan,
  hasSelectedLegalization,
  handleUpdateRowsPerPage,
  handleCancelLegalizations,
  handleSelectedLegalizations,
  cancelLegalizationsModalRef,
  cancelLegalizationsModalProps,
  handleOpenCancelLegalizationsModal,
} = useLegalizationResourcesCancel()
</script>

<style lang="scss" src="./LegalizationResourcesCancel.scss" scoped></style>
