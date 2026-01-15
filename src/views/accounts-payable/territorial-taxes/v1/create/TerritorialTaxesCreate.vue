<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('TerritorialTaxesList')"
    >
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
              action="create"
              ref="basicDataFormRef"
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
                  :class-custom="'custom'"
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
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

import BasicDataForm from '@/components/Forms/AccountsPayable/TerritorialTaxes/BasicDataForm.vue'

import useTerritorialTaxesCreate from '@/views/accounts-payable/territorial-taxes/v1/create/TerritorialTaxesCreate'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  handleCreate,
  goToURL,
} = useTerritorialTaxesCreate()
</script>