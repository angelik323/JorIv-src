<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handlerGoTo('BankingEntitiesView', bankingEntitieId)"
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
            <InformationForm
              v-if="activeTab === 'InformationForm'"
              :action="'view'"
              :data="bank_receipt_request ?? undefined"
            />
          </template>
        </Card>

        <Card>
          <template #content-card>
            <BankBranchesBasicData
              :action="'create'"
              ref="BankBranchesBasicDataRef"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  label="Crear"
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
import InformationForm from '@/components/Forms/Treasury/BankingEntities/information/InformationForm.vue'
import BankBranchesBasicData from '@/components/Forms/Treasury/BankBranches/information/BankBranchesBasicData.vue'
import useBankBranchesCreate from '@/views/treasury/bank-branches/v1/create/BankBranchesCreate'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
const {
  tabs,
  activeTab,
  headerProperties,
  tabActiveIdx,
  bank_receipt_request,
  BankBranchesBasicDataRef,
  bankingEntitieId,
  onSubmit,
  handlerGoTo,
} = useBankBranchesCreate()
</script>
