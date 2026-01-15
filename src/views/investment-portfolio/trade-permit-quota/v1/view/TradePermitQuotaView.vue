<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'TradePermitQuotaList' })"
    >
      <section>
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <VCard>
          <template #content-card>
            <div class="mx-3 mt-0 mb-3">
              <div v-for="(row, rowIdx) in rows" :key="rowIdx" class="mb-4">
                <p class="text-weight-bold text-subtitle1 mt-2">
                  {{ row.title }}
                </p>
                <div class="row q-col-gutter-lg mt-1">
                  <div
                    v-for="(field, colIdx) in row.columns"
                    :key="colIdx"
                    class="col-xs-12 col-sm-6 col-md-3 mb-2"
                  >
                    <p class="text-weight-medium mb-0">{{ field.label }}</p>
                    <p class="text-grey-8 mb-0">{{ field.value() }}</p>
                  </div>
                </div>
                <q-separator class="q-mt-sm q-mb-md" color="grey-4" />
              </div>
            </div>
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="$router.push({ name: 'TradePermitQuotaList' })"
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import { useTradePermitQuotaView } from './TradePermitQuotaView'

const { headerProps, tabs, activeTab, tabActiveIdx, rows } =
  useTradePermitQuotaView()
</script>
