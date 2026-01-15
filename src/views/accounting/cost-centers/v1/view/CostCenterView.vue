<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'CostCenterList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard>
          <template #content-card>
            <div v-if="tabActive === 'information'" class="q-pa-lg">
              <div class="row q-col-gutter-x-xl q-col-gutter-y-sm">
                <div class="col-12 col-md-4">
                  <p class="text-bold mb-0 text-black-10">Estructura contable*</p>
                  <div>{{ costCenter?.structure_code ?? '-' }}</div>
                </div>
                <div class="col-12 col-md-4">
                  <p class="text-bold mb-0 text-black-10">Finalidad</p>
                  <div>{{ costCenter?.purpose ?? '-' }}</div>
                </div>
                <div class="col-12 col-md-4">
                  <p class="text-bold mb-0 text-black-10">Tipo de estructura</p>
                  <div>{{ costCenter?.structure_type ?? '-' }}</div>
                </div>
              </div>
              <div class="row q-col-gutter-x-xl q-col-gutter-y-sm q-mt-md">
                <div class="col-12 col-md-4">
                  <p class="text-bold mb-0 text-black-10">Estructura contable</p>
                  <div>{{ costCenter?.secondary_structure_code ?? '-' }}</div>
                </div>
                <div class="col-12 col-md-4">
                  <p class="text-bold mb-0 text-black-10">Finalidad</p>
                  <div>{{ costCenter?.secondary_purpose ?? '-' }}</div>
                </div>
                <div class="col-12 col-md-4">
                  <p class="text-bold mb-0 text-black-10">Tipo de estructura</p>
                  <div>{{ costCenter?.secondary_structure_type ?? '-' }}</div>
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-12">
                  <p class="text-bold mb-0 text-black-10">Estado</p>
                  <ShowStatus :type="Number(costCenter.status_id ?? 1)" />
                </div>
              </div>
            </div>

            <hr class="mt-0 mb-0" width="98%" size="1" style="border-color: #dcdcdc; text-align: center" noshade />
            <section class="q-pa-lg">
              <TableList
                :title="costCenterCatalogTableProps.title"
                :loading="costCenterCatalogTableProps.loading"
                :columns="costCenterCatalogTableProps.columns"
                :rows="costCenterCatalogTableProps.rows"
                :pages="costCenterCatalogTableProps.pages"
                @update-page=""
              />

              <section class="mx-4 mb-4">
                <div class="row justify-end q-gutter-md">
                  <Button
                    :outline="false"
                    :rightIcon="'mdi-chevron-right'"
                    :label="'Finalizar'"
                    :size="'md'"
                    :color="'orange'"
                    :classCustom="'text-capitalize btn-filter custom'"
                    @click="$router.push({ name: 'CostCenterList' })"
                  />
                </div>
              </section>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'

import TableList from '@/components/table-list/TableList.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useCostCenterView from '@/views/accounting/cost-centers/v1/view/CostCenterView'

const { headerProps, filteredTabs, tabActive, tabActiveIdx, costCenter, costCenterCatalogTableProps } =
  useCostCenterView()
</script>
