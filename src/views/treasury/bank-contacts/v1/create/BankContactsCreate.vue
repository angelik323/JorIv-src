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
        <!-- Tabs content -->
        <Card>
          <template #content-card>
            <!-- Information -->
            <BankContactsBasicData
              ref="BankContactsBasicDataRef"
              :action="'create'"
              :bankBrancheId="bankBrancheId"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Crear"
                  :outline="false"
                  size="md"
                  color="orange"
                  :class-custom="'custom'"
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
//componets
import BankContactsBasicData from '@/components/Forms/Treasury/BankContacts/information/BankContactsBasicData.vue'
import useBankContactsCreate from '@/views/treasury/bank-contacts/v1/create/BankContactsCreate'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

//Logic view

const {
  headerProperties,
  tabs,
  tabActiveIdx,
  activeTab,
  BankContactsBasicDataRef,
  bankBrancheId,
  onSubmit,
} = useBankContactsCreate()
</script>
