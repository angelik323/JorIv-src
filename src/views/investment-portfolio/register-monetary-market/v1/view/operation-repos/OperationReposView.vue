<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'RegisterMonetaryMarketList' })"
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
              <RepoInformationForm
                :data="operation?.information"
                action="view"
              />

              <section class="q-mt-xl">
                <p class="text-subtitle1 text-bold q-mb-sm">Intereses</p>
                <TableList
                  :title="tableProps.title"
                  :loading="tableProps.loading"
                  :rows="tableProps.rows"
                  :columns="tableProps.columns"
                  :pages="tableProps.pages"
                  bordered
                  flat
                />
              </section>

              <div class="q-pa-lg">
                <q-separator class="q-my-sm" />
                <div class="form-section q-mb-md">
                  <p class="text-subtitle1 text-bold q-mb-sm">
                    Historial de operaciones monetarias
                  </p>
                  <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                    <div class="col-12 col-md-3">
                      <p class="text-subtitle2 text-bold q-mb-xs">
                        Fecha de creación
                      </p>
                      <div>{{ operation?.history?.created_at || '-' }}</div>
                    </div>
                    <div class="col-12 col-md-3">
                      <p class="text-subtitle2 text-bold q-mb-xs">Creado por</p>
                      <div>{{ operation?.history?.creator_data || '-' }}</div>
                    </div>
                    <div class="col-12 col-md-3">
                      <p class="text-subtitle2 text-bold q-mb-xs">
                        Modificación
                      </p>
                      <div>{{ operation?.history?.updated_at || '-' }}</div>
                    </div>
                    <div class="col-12 col-md-3">
                      <p class="text-subtitle2 text-bold q-mb-xs">
                        Modificado por
                      </p>
                      <div>{{ operation?.history?.update_data || '-' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <Button
                  :outline="false"
                  :label="'Continuar'"
                  :size="'md'"
                  :color="'orange'"
                  :classCustom="'text-capitalize btn-filter custom'"
                  @click="tabActive = 'warranty'"
                />
              </div>
            </div>

            <div v-if="tabActive === 'warranty'" class="q-pa-lg">
              <WarrantyForm
                :data="operation?.warranty"
                action="view"
                position="Activo"
              />

              <div class="row justify-end q-mt-lg">
                <Button
                  :outline="false"
                  :label="'Finalizar'"
                  :size="'md'"
                  :color="'orange'"
                  :classCustom="'text-capitalize btn-filter custom'"
                  @click="goToURL('RegisterMonetaryMarketList')"
                />
              </div>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import RepoInformationForm from '@/components/Forms/InvestmentPortfolio/RegisterMonetaryMarket/ReposForm/InformationForm/InformationForm.vue'
import WarrantyForm from '@/components/Forms/InvestmentPortfolio/RegisterMonetaryMarket/ReposForm/WarrantyForm/WarrantyForm.vue'

import useOperationReposView from './OperationReposView'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  operation,
  tableProps,
  goToURL,
} = useOperationReposView()
</script>
