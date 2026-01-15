<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'GroundsForBankRefund' })"
    >
      <section class="q-mt-xs px-4">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <Card>
          <template #content-card>
            <!-- Views -->
            <BasicDataComponent
              ref="GroundsForBankRefundDataRef"
              :action="'edit'"
              :data="data_grounds_bank_request"
            />

            <!-- Actions -->

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  label="Actualizar "
                  icon-right="mdi-chevron-right"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
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
// Components
import BasicDataComponent from '@/components/Forms/BasicDataComponent/BasicDataComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'

// Logic view
import useGroundsForBankRefundEdit from './GroundsForBankRefundEdit'

const {
  GroundsForBankRefundDataRef,
  data_grounds_bank_request,
  tabActiveIdx,
  headerProps,
  tabActive,
  tabs,
  onSubmit,
} = useGroundsForBankRefundEdit()
</script>
