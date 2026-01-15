<template>
  <div class="q-px-xl" main>
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <section
        class="q-my-md"
        aria-label="Sección de visualización detalles del movimiento"
      >
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard v-if="isLoaded">
          <template #content-card>
            <div class="q-pa-lg">
              <p class="text-weight-bold text-h6">Detalles del movimiento</p>

              <div v-for="(section, idx) in filteredSections" :key="idx">
                <q-separator
                  class="q-my-lg"
                  v-if="section.showSeparatorBefore"
                />

                <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
                  <div
                    v-for="field in section.fields"
                    :key="field.key"
                    class="col-12 col-md-4"
                  >
                    <p class="q-mb-none text-black-10 text-weight-bold">
                      {{ field.label }}
                    </p>
                    <p class="text-grey-8 mb-0">
                      <template v-if="field.label === 'Estado'">
                        <ShowStatus
                          :type="Number(getFieldValue(initialData, field)) ?? 1"
                        />
                      </template>
                      <template v-else>
                        {{ getFieldValue(initialData, field) }}
                      </template>
                    </p>
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Finalizar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleGoToList"
                />
              </div>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useTreasuryCancellationView from './TreasuryCancellationView'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

const {
  tabs,
  isLoaded,
  tabActive,
  initialData,
  tabActiveIdx,
  getFieldValue,
  handleGoToList,
  headerProperties,
  filteredSections,
} = useTreasuryCancellationView()
</script>
