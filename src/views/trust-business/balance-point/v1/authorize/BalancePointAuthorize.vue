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
                  action="create"
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
                    flat
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
                    label="Rechazar"
                    color="orange"
                    class="text-capitalize custom"
                    @click="openDenyModal"
                    outline
                  />

                  <Button
                    v-if="
                      tabs.findIndex((tab) => tab.name === tabActive) ===
                      tabs.length - 1
                    "
                    :outline="false"
                    label="Autorizar"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="openAuthorizeModal"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
  <AlertModalComponent
    ref="confirmationModalRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    :title="confirmationModalConfig.title"
    :description_message="confirmationModalConfig.description"
    @confirm="handleConfirmation()"
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
  </AlertModalComponent>
</template>
<script lang="ts" setup>
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AuthorizeBalancePoint from '@/components/Forms/TrustBusiness/BalancePoint/AuthorizeBalancePoint/AuthorizeBalancePoint.vue'
import BasicDataBalancePoint from '@/components/Forms/TrustBusiness/BalancePoint/BasicDataBalancePoint/BasicDataBalancePoint.vue'
import MandateBalancePoint from '@/components/Forms/TrustBusiness/BalancePoint/MandateBalancePoint/MandateBalancePoint.vue'
import SummaryBalancePoint from '@/components/Forms/TrustBusiness/BalancePoint/SummaryBalancePoint/SummaryBalancePoint.vue'
import useBalancePointAuthorize from '@/views/trust-business/balance-point/v1/authorize/BalancePointAuthorize'

const {
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  defaultIconsLucide,
  authorizeFormRef,
  goToURL,
  nextTab,
  backTab,
  confirmationModalRef,
  confirmationModalConfig,
  handleConfirmation,
  openAuthorizeModal,
  openDenyModal,
} = useBalancePointAuthorize()
</script>
