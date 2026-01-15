<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'TypesOperationList' })"
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
              <div class="q-mb-lg">
                <div
                  class="row q-col-gutter-lg mt-1"
                  v-for="(row, rowIdx) in basicInfoRows"
                  :key="`basic-${rowIdx}`"
                >
                  <div
                    v-for="(field, index) in row"
                    :key="`basic-field-${index}`"
                    class="col-xs-12 col-sm-12 col-md-3 mb-2"
                  >
                    <div class="q-mb-sm">
                      <p class="text-weight-medium mb-1 text-black-90">
                        {{ field.label }}
                      </p>
                      <p class="text-weight-medium mb-0 text-grey-7">
                        {{ field.value() || field.fallback }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <q-separator class="q-mt-sm q-mb-md" color="grey-4" />

              <div class="q-mb-lg">
                <h6
                  class="text-h6 text-weight-medium q-mb-md q-mt-md text-black-90"
                >
                  Operación
                </h6>
                <div
                  class="row q-col-gutter-lg"
                  v-for="(row, rowIdx) in operationRows"
                  :key="`operation-${rowIdx}`"
                >
                  <div
                    v-for="(field, index) in row"
                    :key="`operation-field-${index}`"
                    class="col-xs-12 col-sm-12 col-md-3 mb-2"
                  >
                    <div class="q-mb-sm">
                      <p class="text-weight-medium mb-1 text-black-90">
                        {{ field.label }}
                      </p>
                      <p class="text-weight-medium mb-0 text-grey-7">
                        {{ field.value() || field.fallback }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <q-separator class="q-mt-sm q-mb-md" color="grey-4" />

              <div class="q-mb-lg">
                <h6
                  class="text-h6 text-weight-medium q-mb-md q-mt-md text-black-90"
                >
                  Historial del tipo de operación
                </h6>
                <div
                  class="row q-col-gutter-lg"
                  v-for="(row, rowIdx) in historyRows"
                  :key="`history-${rowIdx}`"
                >
                  <div
                    v-for="(field, index) in row"
                    :key="`history-field-${index}`"
                    class="col-xs-12 col-sm-12 col-md-3 mb-2"
                  >
                    <div class="q-mb-sm">
                      <p class="text-weight-medium mb-1 text-black-90">
                        {{ field.label }}
                      </p>
                      <p class="text-weight-medium mb-0 text-grey-7">
                        {{ field.value() || field.fallback }}
                      </p>
                    </div>
                  </div>
                </div>
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
                  @click="$router.push({ name: 'TypesOperationList' })"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import { useTypesOperationView } from './TypesOperationView'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProps,
  activeTab,
  tabActiveIdx,
  tabs,
  basicInfoRows,
  operationRows,
  historyRows,
} = useTypesOperationView()
</script>
