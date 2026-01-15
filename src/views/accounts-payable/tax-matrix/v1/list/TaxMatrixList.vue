<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <!-- Contenido Retención en la fuente -->
            <div v-show="tabActive === 'rft'">
              <div class="row items-center justify-end q-px-lg q-pt-lg">
                <Button
                  label="Editar"
                  :leftIcon="defaultIconsLucide.edit"
                  color="orange"
                  :outline="true"
                  @click="handleEdit('rft')"
                />
              </div>

              <TaxMatrixForm action="view" :data="getCurrentTabData" taxType="RFT" />
            </div>

            <!-- Contenido Retención de IVA -->
            <div v-show="tabActive === 'riv'">
              <div class="row items-center justify-end q-px-lg q-pt-lg">
                <Button
                  label="Editar"
                  :leftIcon="defaultIconsLucide.edit"
                  color="orange"
                  :outline="true"
                  @click="handleEdit('riv')"
                />
              </div>

              <TaxMatrixForm action="view" :data="getCurrentTabData" taxType="RIV" />
            </div>

            <!-- Contenido Retención de ICA -->
            <div v-show="tabActive === 'ric'">
              <div class="row items-center justify-end q-px-lg q-pt-lg">
                <Button
                  label="Editar"
                  :leftIcon="defaultIconsLucide.edit"
                  color="orange"
                  :outline="true"
                  @click="handleEdit('ric')"
                />
              </div>

              <TaxMatrixForm action="view" :data="getCurrentTabData" taxType="RIC" />
            </div>

            <!-- Contenido Impuestos territoriales -->
            <div v-show="tabActive === 'rte'">
              <div class="row items-center justify-end q-px-lg q-pt-lg">
                <Button
                  label="Editar"
                  :leftIcon="defaultIconsLucide.edit"
                  color="orange"
                  :outline="true"
                  @click="handleEdit('rte')"
                />
              </div>

              <TaxMatrixForm action="view" :data="getCurrentTabData" taxType="RTE" />
            </div>

            <section class="mx-1 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="filteredTabs.findIndex((tab) => tab.name === tabActive) > 0"
                  :outline="true"
                  label="Atrás"
                  :leftIcon="defaultIconsLucide.chevronLeft"
                  :colorIcon="'#762344'"
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="backTab"
                />

                <Button
                  v-if="filteredTabs.findIndex((tab) => tab.name === tabActive) < filteredTabs.length - 1"
                  :outline="false"
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.chevronRight"
                  :colorIcon="'white'"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
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
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TaxMatrixForm from '@/components/Forms/AccountsPayable/TaxMatrix/TaxMatrixForm.vue'

// Logic
import useTaxMatrixList from '@/views/accounts-payable/tax-matrix/v1/list/TaxMatrixList'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  getCurrentTabData,
  defaultIconsLucide,
  nextTab,
  backTab,
  handleEdit,
} = useTaxMatrixList()
</script>