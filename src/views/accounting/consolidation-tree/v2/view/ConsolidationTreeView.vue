<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('ConsolidationTreeList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <FormConsolidationTree action="view"></FormConsolidationTree>
              <section class="mx-4 mb-2">
                <div class="row justify-end q-gutter-md">
                  <Button
                    :outline="false"
                    :class-custom="'custom'"
                    label="Finalizar"
                    size="md"
                    color="orange"
                    @click="goToURL('ConsolidationTreeList')"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Composables
import useConsolidationTreeView from '@/views/accounting/consolidation-tree/v2/view/ConsolidationTreeView'

// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import FormConsolidationTree from '@/components/Forms/Accounting/ConsolidationTree/BasicData/v2/BasicDataForm.vue'

const { headerProperties, tabs, activeTab, tabActiveIdx, goToURL } =
  useConsolidationTreeView()
</script>
