<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'BusinessTrustCommissionsList' })"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard v-if="fiduciary_business_commissions_response">
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <BasicData
                v-if="tabActive === 'basic-data'"
                :data="basic_data"
                ref="basicDataFormRef"
                action="view"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  label="Atrás"
                  size="md"
                  unelevated
                  outline
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="backTab"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
                  "
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.next"
                  color-icon="#fff"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                />
              </div>
            </section>

            <div class="q-px-xl q-pb-xl q-pt-lg">
              <Descriptions
                :data="basic_data"
                ref="descriptionsFormRef"
                action="view"
                :id="fiduciary_business_commissions_response.id"
              />
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicData from '@/components/Forms/SettlementCommissions/FiduciaryBusinessCommissions/BasicData/BasicData.vue'
import Descriptions from '@/components/Forms/SettlementCommissions/FiduciaryBusinessCommissions/Descriptions/Descriptions.vue'

// Logic view
import useFiduciaryBusinessCommissionsRead from '@/views/settlement-commissions/fiduciary-business-commissions/v1/read/FiduciaryBusinessCommissionsRead'
// Utils
import { defaultIconsLucide } from '@/utils'

const {
  fiduciary_business_commissions_response,
  basic_data,
  basicDataFormRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  descriptionsFormRef,

  nextTab,
  backTab,
  onSubmit,
} = useFiduciaryBusinessCommissionsRead()
</script>
