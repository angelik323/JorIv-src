<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
                <div class="col-12 col-md-6">
                  <p class="q-mb-none text-black-10 text-weight-bold">
                    Estructura fuente
                  </p>
                  <p
                    class="text-grey-8 mb-0 row no-wrap items-center q-gutter-xl"
                  >
                    <span>
                      {{
                        initialData?.structures.source_structure
                          ?.formatted_display || 'No registrado'
                      }}
                    </span>
                    <span>
                      {{ initialData?.structures.source_structure?.name || '' }}
                    </span>
                  </p>
                </div>

                <div class="col-12 col-md-6">
                  <p class="q-mb-none text-black-10 text-weight-bold">
                    Estructura equivalencia
                  </p>
                  <p
                    class="text-grey-8 mb-0 row no-wrap items-center q-gutter-xl"
                  >
                    <span>
                      {{
                        initialData?.structures.regular_equivalent_structure
                          ?.formatted_display || 'No registrado'
                      }}
                    </span>
                    <span
                      v-if="
                        initialData?.structures.regular_equivalent_structure
                      "
                    >
                      {{
                        initialData.structures.regular_equivalent_structure.name
                      }}
                    </span>
                  </p>
                </div>

                <div class="col-12">
                  <p class="q-mb-none text-black-10 text-weight-bold">
                    Estructura equivalencia fiscal
                  </p>
                  <p
                    class="text-grey-8 mb-0 row no-wrap items-center q-gutter-xl"
                  >
                    <span>
                      {{
                        initialData?.structures.fiscal_equivalent_structure
                          ?.formatted_display || 'No registrado'
                      }}
                    </span>
                    <span>
                      {{
                        initialData?.structures.fiscal_equivalent_structure
                          ?.name || ''
                      }}
                    </span>
                  </p>
                </div>
              </div>

              <q-separator class="q-my-xl" />

              <div class="q-mb-lg">
                <div
                  class="row items-center justify-between q-col-gutter-sm q-mb-lg"
                >
                  <div class="col-auto">
                    <p class="q-mb-none text-black-10 text-h6 text-weight-bold">
                      Listado PUC equivalente
                    </p>
                  </div>
                  <div class="col-auto">
                    <Button
                      class-custom="custom"
                      :outline="true"
                      label="Descargar excel"
                      color="orange"
                      :styleContent="{
                        'place-items': 'center',
                        color: 'black',
                      }"
                      :left-img="imgButtonHeaderTable"
                      @click="handleUploadExcel"
                    />
                  </div>
                </div>

                <VCard>
                  <template #content-card>
                    <div class="q-pa-lg">
                      <TableList
                        :loading="tableProperties.loading"
                        :rows="tableRegularRows"
                        :columns="tableProperties.columns"
                      />
                    </div>
                  </template>
                </VCard>
              </div>

              <div class="q-mb-lg">
                <p class="text-black-10 text-h6 text-weight-bold">
                  Listado PUC equivalente fiscal
                </p>

                <VCard>
                  <template #content-card>
                    <div class="q-pa-lg">
                      <TableList
                        :loading="tableProperties.loading"
                        :rows="tableFiscalRows"
                        :columns="tableProperties.columns"
                      />
                    </div>
                  </template>
                </VCard>
              </div>

              <div class="flex justify-end">
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
import usePucAccountEquivalenceView from './PucAccountEquivalenceView'
import TableList from '@/components/table-list/TableList.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

const {
  tabs,
  tabActive,
  initialData,
  tabActiveIdx,
  handleGoToList,
  tableProperties,
  tableFiscalRows,
  tableRegularRows,
  headerProperties,
  handleUploadExcel,
} = usePucAccountEquivalenceView()
</script>
