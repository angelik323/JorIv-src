<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'TypesMarketabilityList' })"
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
            <div class="q-pa-lg">
              <div
                class="row q-col-gutter-lg"
                v-for="(row, rowIdx) in firstRows"
                :key="`basic-${rowIdx}`"
              >
                <div
                  v-for="(field, index) in row"
                  :key="`basic-field-${index}`"
                  class="col-xs-12 col-sm-12 col-md-3 mb-2 text-black-90"
                >
                  <div class="q-mb-sm">
                    <p class="text-weight-bold no-margin">
                      {{ field.label }}
                    </p>
                    <p class="text-weight-medium no-margin">
                      {{ field.value() || field.fallback }}
                    </p>
                  </div>
                </div>
              </div>

              <q-separator class="q-my-md" />

              <h6 class="text-weight-bold">
                Historial del tipo de bursatilidad
              </h6>
              <div
                class="row q-col-gutter-lg"
                v-for="(row, rowIdx) in secondRows"
                :key="`operation-${rowIdx}`"
              >
                <div
                  v-for="(field, index) in row"
                  :key="`operation-field-${index}`"
                  class="col-xs-12 col-sm-12 col-md-3 mb-2 text-black-90"
                >
                  <div class="q-mb-sm">
                    <p class="text-weight-bold no-margin">
                      {{ field.label }}
                    </p>
                    <p class="text-weight-medium no-margin">
                      {{ field.value() || field.fallback }}
                    </p>
                  </div>
                </div>
              </div>

              <q-separator class="q-my-md" />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="$router.push({ name: 'TypesMarketabilityList' })"
                />
              </div>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import { useTypesMarketabilityView } from './TypesMarketabilityView'

const { headerProps, activeTab, tabActiveIdx, tabs, firstRows, secondRows } =
  useTypesMarketabilityView()
</script>
