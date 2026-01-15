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
              <SimultaneousInformationForm
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

              <div class="row justify-end q-mt-lg">
                <Button
                  :outline="false"
                  :rightIcon="'mdi-chevron-right'"
                  :label="'Continuar'"
                  :size="'md'"
                  :color="'orange'"
                  :classCustom="'text-capitalize btn-filter custom'"
                  @click="goToNextTab"
                />
              </div>
            </div>

            <div v-if="tabActive === 'warranty'" class="q-pa-lg">
              <WarrantyForm
                :data="operation?.warranty"
                action="view"
                :position="operation?.information?.position ?? 'Activa'"
              />

              <div class="row justify-end q-mt-lg">
                <Button
                  :outline="false"
                  :rightIcon="'mdi-check'"
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

import SimultaneousInformationForm from '@/components/Forms/InvestmentPortfolio/RegisterMonetaryMarket/SimultaneousForm/InformationForm/InformationForm.vue'
import WarrantyForm from '@/components/Forms/InvestmentPortfolio/RegisterMonetaryMarket/SimultaneousForm/WarrantyForm/WarrantyForm.vue'

import useSimultaneousView from './SimultaneosView'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  operation,
  tableProps,
  goToURL,
  goToNextTab,
} = useSimultaneousView()
</script>
