<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('PaymentAuthorizersList')"
    >
      <template #addAfter>
        <Button
          :outline="true"
          label="Importar"
          size="md"
          color="orange"
          :style-text="{ color: '#333', fontWeight: 'bold' }"
          class="btn-filter custom"
          icon="CloudUpload"
          color-icon="#762344"
          @click="goToURL('PaymentAuthorizersImport')"
        />
      </template>
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <BasicDataForm
              v-if="tabActive === 'information'"
              ref="basicDataFormRef"
              :data="basic_data_form"
              action="create"
              @update:data="basic_data_form = $event"
            />

            <section class="mx-2 mb-2">
              <q-separator />
              <div class="row justify-end">
                <Button
                  label="Crear"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom mt-2"
                  @click="handleCreate"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
//Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/AccountsPayable/PaymentAuthorizers/BasicDataForm.vue'

//Logic
import usePaymentAuthorizersCreate from '@/views/accounts-payable/payment-authorizers/v1/create/PaymentAuthorizersCreate'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  basic_data_form,
  handleCreate,
  goToURL,
} = usePaymentAuthorizersCreate()
</script>
