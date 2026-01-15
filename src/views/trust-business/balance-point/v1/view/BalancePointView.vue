<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      @on-back="goToURL('BalancePointList')"
      show-back-btn
    >
      <section>
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <VCard>
          <template #content-card>
            <div class="q-px-lg q-pb-md q-pt-lg">
              <section>
                <BasicDataBalancePoint
                  action="view"
                  v-show="tabActive === 'basic_data'"
                />
                <MandateBalancePoint
                  action="view"
                  v-show="tabActive === 'mandate_data'"
                />
                <SummaryBalancePoint
                  action="view"
                  v-show="tabActive === 'summary_data'"
                />
                <AuthorizeBalancePoint
                  ref="authorizeFormRef"
                  action="view"
                  v-show="tabActive === 'authorize_data'"
                />
              </section>
              <section
                class="mx-1 mb-2"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    v-if="tabs.findIndex((tab) => tab.name === tabActive) > 0"
                    :outline="true"
                    label="Atrás"
                    :leftIcon="defaultIconsLucide.chevronLeft"
                    :color-icon="'#762344'"
                    color="orange"
                    class="text-capitalize btn-filter"
                    @click="backTab"
                  />

                  <Button
                    v-if="
                      tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
                    "
                    :outline="false"
                    label="Continuar"
                    :rightIcon="defaultIconsLucide.chevronRight"
                    :color-icon="'white'"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="nextTab"
                  />

                  <Button
                    v-if="
                      tabs.findIndex((tab) => tab.name === tabActive) ===
                      tabs.length - 1
                    "
                    :outline="false"
                    label="Finalizar"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="onFinish"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script lang="ts" setup>
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AuthorizeBalancePoint from '@/components/Forms/TrustBusiness/BalancePoint/AuthorizeBalancePoint/AuthorizeBalancePoint.vue'
import BasicDataBalancePoint from '@/components/Forms/TrustBusiness/BalancePoint/BasicDataBalancePoint/BasicDataBalancePoint.vue'
import MandateBalancePoint from '@/components/Forms/TrustBusiness/BalancePoint/MandateBalancePoint/MandateBalancePoint.vue'
import SummaryBalancePoint from '@/components/Forms/TrustBusiness/BalancePoint/SummaryBalancePoint/SummaryBalancePoint.vue'
import useBalancePointView from '@/views/trust-business/balance-point/v1/view/BalancePointView'

const {
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  defaultIconsLucide,
  goToURL,
  nextTab,
  backTab,
  onFinish,
} = useBalancePointView()
</script>
