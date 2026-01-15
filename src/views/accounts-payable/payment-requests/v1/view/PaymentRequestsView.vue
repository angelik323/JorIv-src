<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <BasicDataView
            v-if="tabActive === 'basic_data'"
            ref="basicDataFormRef"
            :data="data ?? {}"
          />

          <MainInformationView
            v-if="tabActive === 'main_information'"
            ref="mainInformationFormRef"
            :data="data ?? {}"
          />

          <ConceptsView
            v-if="tabActive === 'concepts'"
            action="edit"
            ref="ConceptsFormRef"
            :data="data"
          />

          <InstructionsView
            v-if="tabActive === 'instructions'"
            action="edit"
            ref="InstructionsFormRef"
            :data="data?.instructions?.[0]"
          />

          <AssociatedDataView
            v-if="tabActive === 'associated_data'"
            action="create"
            ref="AssociatedDataFormRef"
            :data="data"
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
                :right-icon="defaultIconsLucide.next"
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
                @click="goToURL('PaymentRequestsList')"
              />
            </div>
          </section>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// forms
import BasicDataView from '@/components/Forms/AccountsPayable/PaymentRequests/BasicData/BasicDataView.vue'
import MainInformationView from '@/components/Forms/AccountsPayable/PaymentRequests/MainInformation/MainInformationView.vue'
import ConceptsView from '@/components/Forms/AccountsPayable/PaymentRequests/Concepts/ConceptsView.vue'
import InstructionsView from '@/components/Forms/AccountsPayable/PaymentRequests/Instructions/InstructionsView.vue'
import AssociatedDataView from '@/components/Forms/AccountsPayable/PaymentRequests/AssociatedData/AssociatedDataView.vue'

// logic view
import usePaymentRequestsView from '@/views/accounts-payable/payment-requests/v1/view/PaymentRequestsView'

const {
  // configs
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,

  // refs
  basicDataFormRef,
  mainInformationFormRef,
  ConceptsFormRef,
  InstructionsFormRef,
  AssociatedDataFormRef,
  data,

  // utils
  defaultIconsLucide,

  // methods
  nextTab,
  backTab,
  goToURL,
} = usePaymentRequestsView()
</script>
