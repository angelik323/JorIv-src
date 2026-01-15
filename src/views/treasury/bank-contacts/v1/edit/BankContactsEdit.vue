<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="
        $router.push({
          name: 'BankingEntitiesView',
          params: { id: $route.params.bank },
        })
      "
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <Card>
          <template #content-card>
            <BankContactsBasicData
              :action="'edit'"
              ref="BankContactsBasicDataRef"
              :data="bank_contacts_request ?? undefined"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  label="Actualizar"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useBankContactsEdit from '@/views/treasury/bank-contacts/v1/edit/BankContactsEdit'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import BankContactsBasicData from '@/components/Forms/Treasury/BankContacts/information/BankContactsBasicData.vue'
import Card from '@/components/common/VCard/VCard.vue'

const {
  tabs,
  activeTab,
  headerProperties,
  tabActiveIdx,
  bank_contacts_request,
  BankContactsBasicDataRef,
  onSubmit,
} = useBankContactsEdit()
</script>
