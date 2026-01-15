<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="
        $router.push({ name: 'DefinitionQuotasCounterpartPermitsList' })
      "
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <DefinitionQuotasCounterpartPermitsForm
              ref="informationFormRef"
              :action="'create'"
            />

            <section class="mx-2 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="tabActiveIdx === tabs.length - 1"
                  label="Crear"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import DefinitionQuotasCounterpartPermitsForm from '@/components/Forms/InvestmentPortfolio/DefinitionQuotasCounterpartPermits/DefinitionQuotasCounterpartPermitsForm.vue'
import useDefinitionQuotasCounterpartPermitsCreate from './DefinitionQuotasCounterpartPermitsCreate'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  informationFormRef,
  onSubmit,
} = useDefinitionQuotasCounterpartPermitsCreate()
</script>
