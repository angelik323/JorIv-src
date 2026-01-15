<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
    </ContentComponent>
    <section class="q-my-md">
      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
        @update:tab-active="tabActive = $event"
      />
      <VCard>
        <template #content-card>
          <AuthorizationDataForm
            :data="authorization_data_form"
            :show-payment-order-values="tabActive === 'payment_order'"
          />
          <q-separator class="mx-2" />
          <BasicDataForm
            v-if="tabActive === 'information'"
            :data="basic_data_form"
          />

          <PaymentOrderDataForm
            v-if="tabActive === 'payment_order'"
            :data="payment_order_form"
            :payment_status="authorization_data_form?.status?.id ?? 0"
            :payment_request_id="authorization_data_form?.id ?? null"
          />

          <section class="mx-2 mb-2">
            <div class="row justify-end q-gutter-md">
              <q-btn
                v-if="
                  tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                  tabs.findIndex((tab) => tab.name === tabActive) > 0
                "
                label="atras"
                icon="mdi-chevron-left"
                size="md"
                unelevated
                flat
                outline
                color="orange"
                class="text-capitalize btn-filter"
                @click="backTab()"
              />
              <q-btn
                v-if="
                  tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                  tabs.findIndex((tab) => tab.name === tabActive) <
                    tabs.length - 1 &&
                  tabs[tabs.length - 1].show === true
                "
                label="Continuar"
                size="md"
                unelevated
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="nextTab()"
              />
              <Button
                v-else
                label="Finalizar"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="goToURL('SecondAuthorizationList')"
              />
            </div>
          </section>
        </template>
      </VCard>
    </section>
  </div>
</template>
<script setup lang="ts">
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/AccountsPayable/SecondAuthorization/BasicDataForm/BasicDataForm.vue'
import AuthorizationDataForm from '@/components/Forms/AccountsPayable/SecondAuthorization/AuthorizationForm/AuthorizationDataForm.vue'
import PaymentOrderDataForm from '@/components/Forms/AccountsPayable/SecondAuthorization/PaymentOrderDataForm/PaymentOrderDataForm.vue'

// Logic
import useSecondAuthorizationView from '@/views/accounts-payable/second-authorization/v1/view/SecondAuthorizationView'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  authorization_data_form,
  basic_data_form,
  payment_order_form,
  goToURL,
  nextTab,
  backTab,
} = useSecondAuthorizationView()
</script>
