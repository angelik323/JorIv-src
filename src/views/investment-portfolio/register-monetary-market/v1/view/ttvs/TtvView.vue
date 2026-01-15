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
              <TtvInformationForm :data="ttv?.information" action="view" />

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
                      <div>{{ ttv?.history?.created_at || '-' }}</div>
                    </div>
                    <div class="col-12 col-md-3">
                      <p class="text-subtitle2 text-bold q-mb-xs">Creado por</p>
                      <div>{{ ttv?.history?.creator_data || '-' }}</div>
                    </div>
                    <div class="col-12 col-md-3">
                      <p class="text-subtitle2 text-bold q-mb-xs">
                        Modificación
                      </p>
                      <div>{{ ttv?.history?.updated_at || '-' }}</div>
                    </div>
                    <div class="col-12 col-md-3">
                      <p class="text-subtitle2 text-bold q-mb-xs">
                        Modificado por
                      </p>
                      <div>{{ ttv?.history?.update_data || '-' }}</div>
                    </div>
                  </div>
                </div>
              </div>

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

            <div v-if="tabActive === 'delivered'" class="q-pa-lg">
              <TitlesDeliveredForm
                :data="ttv?.delivered"
                action="view"
                :position="'default'"
                :negotiation-value="ttv?.information?.negotiation_value ?? null"
              />

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

            <div v-if="tabActive === 'received'" class="q-pa-lg">
              <TitlesReceivedForm :data="ttv?.received" action="view" />

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

import TtvInformationForm from '@/components/Forms/InvestmentPortfolio/RegisterMonetaryMarket/TtvForm/Informationform/InformationForm.vue'
import TitlesDeliveredForm from '@/components/Forms/InvestmentPortfolio/RegisterMonetaryMarket/TtvForm/TitlesDeliveredForm/TitlesDeliveredForm.vue'
import TitlesReceivedForm from '@/components/Forms/InvestmentPortfolio/RegisterMonetaryMarket/TtvForm/TitlesReceivedForm/TitlesReceivedForm.vue'

import useRegisterMonetaryMarketView from './TtvView'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  ttv,
  goToNextTab,
  goToURL,
} = useRegisterMonetaryMarketView()
</script>

<style scoped>
.q-form {
  width: 100%;
}
</style>
