<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('PaymentInstructionsList')"
    >
      <VCard>
        <template #content-card>
          <HeaderForm
            action="view"
            ref="headerFormRef"
            :data="headerForm"
            @update:data="headerForm = $event"
          />
        </template>
      </VCard>

      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <BasicDataForm
            v-if="tabActive === 'basic_data'"
            action="view"
            ref="instructionsFormRef"
            :data="instructionsForm"
            @update:data="instructionsForm = $event"
          />

          <ForeignCurrencyForm
            v-if="tabActive === 'foreign_currency'"
            action="view"
            ref="foreignCurrencyFormRef"
            :data="foreignCurrencyForm"
            @update:data="foreignCurrencyForm = $event"
          />

          <section class="mx-2 mb-2">
            <div class="row justify-end q-gutter-md">
              <Button
                v-if="
                  tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                  tabs.findIndex((tab) => tab.name === tabActive) > 0
                "
                label="Atrás"
                :left-icon="defaultIconsLucide.back"
                size="md"
                unelevated
                :outline="true"
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
                :right-icon="defaultIconsLucide.next"
                size="md"
                unelevated
                :outline="true"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="nextTab"
              />

              <Button
                label="Finalizar"
                size="md"
                unelevated
                :outline="false"
                :disabled="
                  tabs.findIndex((tab) => tab.name === tabActive) !=
                  tabs.length - 1
                "
                :color="
                  tabs.findIndex((tab) => tab.name === tabActive) !=
                  tabs.length - 1
                    ? 'grey'
                    : 'orange'
                "
                class="text-capitalize btn-filter custom"
                @click="goToURL('PaymentInstructionsList')"
              />
            </div>
          </section>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import HeaderForm from '@/components/Forms/AccountsPayable/PaymentInstructions/Header/HeaderForm.vue'
import BasicDataForm from '@/components/Forms/AccountsPayable/PaymentInstructions/BasicData/BasicDataForm.vue'
import ForeignCurrencyForm from '@/components/Forms/AccountsPayable/PaymentInstructions/ForeignCurrency/ForeignCurrencyForm.vue'

// Logic
import usePaymentInstructionsView from '@/views/accounts-payable/payment-instructions/v1/view/PaymentInstructionsView'

const {
  // Configs
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,

  // Refs
  headerFormRef,
  instructionsFormRef,
  foreignCurrencyFormRef,
  headerForm,
  instructionsForm,
  foreignCurrencyForm,

  // Composables
  defaultIconsLucide,
  goToURL,

  // Methods
  nextTab,
  backTab,
} = usePaymentInstructionsView()
</script>
