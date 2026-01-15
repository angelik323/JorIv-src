<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'InterestRateList' })"
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
              <InterestRatesForm
                v-if="interestRate"
                :data="interestRate"
                action="view"
              />

              <div class="q-pa-lg">
                <q-separator class="q-my-sm" />

                <div class="form-section q-mb-md">
                  <p class="text-subtitle1 text-bold q-mb-sm">
                    Historial de la tasa
                  </p>
                  <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                    <div class="col-12 col-md-3">
                      <p class="text-subtitle2 text-bold q-mb-xs">
                        Fecha de creación
                      </p>
                      <div>{{ interestRate?.created_at || '-' }}</div>
                    </div>
                    <div class="col-12 col-md-3">
                      <p class="text-subtitle2 text-bold q-mb-xs">Creado por</p>
                      <div>{{ interestRate?.creator_data || '-' }}</div>
                    </div>
                    <div class="col-12 col-md-3">
                      <p class="text-subtitle2 text-bold q-mb-xs">
                        Modificación
                      </p>
                      <div>{{ interestRate?.updated_at || '-' }}</div>
                    </div>
                    <div class="col-12 col-md-3">
                      <p class="text-subtitle2 text-bold q-mb-xs">
                        Modificado por
                      </p>
                      <div>{{ interestRate?.update_data || '-' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <Button
                  :outline="false"
                  :rightIcon="'mdi-chevron-right'"
                  :label="'Finalizar'"
                  :size="'md'"
                  :color="'orange'"
                  :classCustom="'text-capitalize btn-filter custom'"
                  @click="$router.push({ name: 'InterestRateList' })"
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
import InterestRatesForm from '@/components/Forms/InvestmentPortfolio/InterestRates/InterestRatesForm.vue'
import useInterestRatesView from './InterestRatesView'

const { headerProps, filteredTabs, tabActive, tabActiveIdx, interestRate } =
  useInterestRatesView()
</script>
