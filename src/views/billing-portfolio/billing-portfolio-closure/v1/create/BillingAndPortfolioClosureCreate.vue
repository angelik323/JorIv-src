<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('BillingAndPortfolioClosureList')"
    >
      <section>
        <TabsComponent :tab-active :tabs :tab-active-idx />

        <!-- Tabs content -->
        <VCard>
          <template #content-card>
            <!-- Information -->
            <InformationForm
              v-if="tabActive === 'information'"
              ref="formInformationRef"
              :action="'create'"
              :data="basic_data_form"
              @update:data="basic_data_form = $event"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Crear"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  :disabled="
                    !billing_portfolio_clouser_validated_response.requirements_validated ||
                    !basic_data_form?.confirmed_validated
                  "
                  @click="confirmBillingAndPortfolioClosure"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="onSubmit"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import InformationForm from '@/components/Forms/BillingPortfolio/BillingAndPortfolioClousure/InformationForm.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Composables
import { useGoToUrl } from '@/composables'
// Logic view
import useBillingAndPortfolioClousereCreate from './BillingAndPortfolioClosureCreate'

const { goToURL } = useGoToUrl()
const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformationRef,
  basic_data_form,
  billing_portfolio_clouser_validated_response,
  alertModalConfig,
  alertModalRef,
  onSubmit,
  confirmBillingAndPortfolioClosure,
} = useBillingAndPortfolioClousereCreate()
</script>
