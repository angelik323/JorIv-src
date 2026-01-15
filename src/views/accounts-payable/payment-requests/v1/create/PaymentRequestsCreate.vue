<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('PaymentRequestsList')"
    >
      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <BasicDataForm
            v-if="tabActive === 'basic_data'"
            action="create"
            ref="basicDataFormRef"
            :data="basic_data_form"
            @update:data="basic_data_form = $event"
          />

          <MainInformationForm
            v-if="tabActive === 'main_information'"
            action="create"
            ref="mainInformationFormRef"
            :data="main_information_form"
            :validate="validate"
            @update:data="main_information_form = $event"
          />

          <ConceptsForm
            v-if="tabActive === 'concepts'"
            action="create"
            ref="conceptsFormRef"
            :data="concepts_form"
            @update:data="concepts_form = $event"
          />

          <InstructionsForm
            v-if="tabActive === 'instructions'"
            action="create"
            ref="instructionsFormRef"
            :data="instructions_form"
            @update:data="instructions_form = $event"
          />

          <AssociatedDataForm
            v-if="tabActive === 'associated_data'"
            action="create"
            ref="associatedDataFormRef"
            :data="associated_data_form"
            @update:data="associated_data_form = $event"
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
                label="Crear"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="handleCreate"
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
import BasicDataForm from '@/components/Forms/AccountsPayable/PaymentRequests/BasicData/BasicDataForm.vue'
import MainInformationForm from '@/components/Forms/AccountsPayable/PaymentRequests/MainInformation/MainInformationForm.vue'
import ConceptsForm from '@/components/Forms/AccountsPayable/PaymentRequests/Concepts/ConceptsForm.vue'
import InstructionsForm from '@/components/Forms/AccountsPayable/PaymentRequests/Instructions/InstructionsForm.vue'
import AssociatedDataForm from '@/components/Forms/AccountsPayable/PaymentRequests/AssociatedData/AssociatedDataForm.vue'

// logic view
import usePaymentRequestsCreate from '@/views/accounts-payable/payment-requests/v1/create/PaymentRequestsCreate'

const {
  // configs
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,

  // refs
  basicDataFormRef,
  mainInformationFormRef,
  conceptsFormRef,
  instructionsFormRef,
  associatedDataFormRef,
  basic_data_form,
  main_information_form,
  concepts_form,
  instructions_form,
  associated_data_form,
  validate,

  // utils
  defaultIconsLucide,

  // methods
  nextTab,
  backTab,
  handleCreate,
  goToURL,
} = usePaymentRequestsCreate()
</script>
