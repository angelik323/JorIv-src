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
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
                <div class="col-12 col-md-3 text-black-90">
                  <p class="text-weight-bold no-margin">Código de comisión</p>
                  <p class="text-weight-medium no-margin">
                    {{ initialData.code || '-' }}
                  </p>
                </div>

                <div class="col-12 col-md-3 text-black-90">
                  <p class="text-weight-bold no-margin">Descripción comisión</p>
                  <p class="text-weight-medium no-margin">
                    {{ initialData.description || '-' }}
                  </p>
                </div>

                <div class="col-12 col-md-3 text-black-90">
                  <p class="text-weight-bold no-margin">Base de liquidación</p>
                  <p class="text-weight-medium no-margin">
                    {{ initialData.liquidation_base || '-' }}
                  </p>
                </div>

                <div class="col-12 col-md-3 text-black-90">
                  <p class="text-weight-bold no-margin">Tipo de tasa</p>
                  <p class="text-weight-medium no-margin">
                    {{ initialData.rate_type || '-' }}
                  </p>
                </div>

                <div class="col-12 col-md-3 text-black-90">
                  <p class="text-weight-bold no-margin">Tipo de comisión</p>
                  <p class="text-weight-medium no-margin">
                    {{
                      initialData.type === 1
                        ? 'Fija'
                        : initialData.type === 2
                        ? 'Variable'
                        : '-'
                    }}
                  </p>
                </div>

                <div
                  v-if="initialData.type === 1"
                  class="col-12 col-md-3 text-black-90"
                >
                  <p class="text-weight-bold no-margin">Porcentaje de tasa</p>
                  <p class="text-weight-medium no-margin">
                    {{ initialData.fixed_rate_percentage || '-' }}
                  </p>
                </div>
              </div>

              <div v-if="initialData.type === 2">
                <p
                  class="q-mb-none text-black-10 text-h6 text-weight-bold q-mb-md q-mt-lg"
                >
                  Comisión variable
                </p>

                <VCard>
                  <template #content-card>
                    <div class="q-pa-lg">
                      <TableList
                        :title="tableProperties.title"
                        :loading="tableProperties.loading"
                        :rows="tableProperties.rows"
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
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useFiduciaryCommissionView from '@/views/fics/fiduciary-commission/v1/view/FiduciaryCommissionView'

const {
  tabs,
  tabActive,
  initialData,
  tabActiveIdx,
  handleGoToList,
  tableProperties,
  headerProperties,
} = useFiduciaryCommissionView()
</script>
