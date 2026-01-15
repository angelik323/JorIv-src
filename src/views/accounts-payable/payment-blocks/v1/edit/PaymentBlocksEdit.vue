<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('PaymentBlocksList')"
    >
      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <BasicDataForm
            v-if="tabActive === 'information'"
            action="edit"
            ref="basicDataFormRef"
            :data="payment_block_form"
            @update:data="payment_block_form = $event"
          />

          <section class="mx-2 mb-2">
            <div class="row justify-end">
              <Button
                label="Actualizar"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="handleEdit"
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
import BasicDataForm from '@/components/Forms/AccountsPayable/PaymentBlocks/BasicData/BasicDataForm.vue'

// logic view
import usePaymentBlocksEdit from '@/views/accounts-payable/payment-blocks/v1/edit/PaymentBlocksEdit'

const {
  // configs
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,

  // refs
  basicDataFormRef,
  payment_block_form,

  // methods
  handleEdit,
  goToURL,
} = usePaymentBlocksEdit()
</script>
