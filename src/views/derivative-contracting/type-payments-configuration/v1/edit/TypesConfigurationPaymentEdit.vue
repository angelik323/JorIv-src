<template>
    <div class="q-px-xl">
      <ContentComponent
        indentation
        content-indentation
        :title="headerProperties.title"
        :breadcrumbs="headerProperties.breadcrumbs"
        :show-back-btn="true"
        @on-back="goToURL('TypesConfigurationPaymentList')"
      >
        <section class="q-my-md">
          <TabsComponent
            :tab-active="activeTab"
            :tabs="tabs"
            :tab-active-idx="tabActiveIdx"
            @update:tab-active="activeTab = $event"
            @update:tab-active-idx="tabActiveIdx = $event"
          />
  
          <!-- Tabs content -->
          <Card>
            <template #content-card>
              <!-- Information -->
              <InformationFormPayment
                v-if="activeTab === 'InformationForm'"
                ref="informationFormRef"
                :action="'edit'"
                :data="data_information_form"
              />

              <!-- Actions -->
              <section class="mx-4 mb-4">
                <div class="row justify-end q-gutter-md">
                  <Button
                    label="Actualizar"
                    size="md"
                    unelevated
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="onSubmit"
                    :outline="false"
                  />
                </div>
              </section>
            </template>
          </Card>
        </section>
      </ContentComponent>
    </div>
  </template>
  
  
  <script setup lang="ts">
  import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
  import Card from '@/components/common/VCard/VCard.vue'
  import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
  import InformationFormPayment from '@/components/Forms/DerivativeContracting/InformationPayment/InformationFormPayment.vue'
  import useTypesConfigurationPaymentEdit from '@/views/derivative-contracting//type-payments-configuration/v1/edit/TypesConfigurationPaymentEdit'
  import Button from '@/components/common/Button/Button.vue'


  const {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    goToURL,
    onSubmit,
    data_information_form,
  } = useTypesConfigurationPaymentEdit()
  </script>