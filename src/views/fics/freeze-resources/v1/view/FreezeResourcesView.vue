<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section>
        <TabsComponent
          :tabs="tabs"
          :tab-active="activeTab"
          :tab-active-idx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <div class="row q-col-gutter-md">
                <div
                  v-for="(row, rowIdx) in firstRows"
                  :key="rowIdx"
                  class="col-12 mb-2"
                >
                  <div class="row q-col-gutter-md">
                    <div
                      v-for="(field, fieldIdx) in row"
                      :key="fieldIdx"
                      class="col-xs-12 col-sm-6 col-md-3"
                    >
                      <div>
                        <b>{{ field.label }}</b>
                      </div>
                      <div>{{ field.value() }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <q-separator class="q-my-lg" />
              <div class="q-mt-md">
                <p class="text-weight-bold text-black-90 text-h6 q-mb-lg">
                  Detalle de {{ models?.operation_type }}
                </p>

                <div class="row q-col-gutter-md">
                  <div
                    v-for="(row, rowIdx) in fieldRows"
                    :key="rowIdx"
                    class="col-12 mb-2"
                  >
                    <div class="row q-col-gutter-md">
                      <div
                        v-for="(field, fieldIdx) in row"
                        :key="fieldIdx"
                        class="col-xs-12 col-sm-6 col-md-3"
                      >
                        <div>
                          <b>{{ field.label }}</b>
                        </div>
                        <div>{{ field.value() }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />
              <div class="q-mt-md">
                <div class="row q-col-gutter-md">
                  <div
                    v-for="(row, rowIdx) in fieldRowsOrderer"
                    :key="rowIdx"
                    class="col-12 mb-2"
                  >
                    <div class="row q-col-gutter-md">
                      <div
                        v-for="(field, fieldIdx) in row"
                        :key="fieldIdx"
                        class="col-xs-12 col-sm-6 col-md-3"
                      >
                        <div>
                          <b>{{ field.label }}</b>
                        </div>
                        <div>{{ field.value() }}</div>
                      </div>
                      <div
                        v-for="(row, rowIdx) in observationRows"
                        :key="rowIdx"
                        class="col-12 mb-2"
                      >
                        <div class="row q-col-gutter-md">
                          <div
                            v-for="(field, fieldIdx) in row"
                            :key="fieldIdx"
                            class="col-xs-12 col-sm-12 col-md-12"
                          >
                            <div>
                              <b>{{ field.label }}</b>
                            </div>
                            <div>{{ field.value() }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Finalizar"
                  size="md"
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
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import { useFreezeResourcesView } from '@/views/fics/freeze-resources/v1/view/FreezeResourcesView'

const {
  tabs,
  models,
  activeTab,
  fieldRows,
  firstRows,
  headerProps,
  tabActiveIdx,
  handleGoToList,
  observationRows,
  fieldRowsOrderer,
} = useFreezeResourcesView()
</script>
