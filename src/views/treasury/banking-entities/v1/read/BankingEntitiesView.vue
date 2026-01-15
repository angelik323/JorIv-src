<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handlerGoTo('BankingEntitiesList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <!-- Tabs content -->
        <Card>
          <template #content-card>
            <!-- Information -->
            <InformationForm
              v-if="activeTab === 'InformationForm'"
              :action="'view'"
              :data="bank_receipt_request ?? undefined"
            />
          </template>
        </Card>

        <Card>
          <template #content-card>
            <q-list>
              <q-expansion-item default-opened>
                <template #header>
                  <q-item-section>
                    Listado sucursales bancarias
                  </q-item-section>

                  <q-item-section side>
                    <q-btn
                      label="Crear"
                      icon="mdi-plus-circle-outline"
                      flat
                      size="md"
                      color="primary"
                      text-color="white"
                      class="btn-header"
                      v-close-popup
                      @click="$router.push({ name: 'BankBranchesCreate' })"
                    >
                    </q-btn>
                  </q-item-section>
                </template>

                <BankBranchesList />
              </q-expansion-item>
              <section class="mx-4 mb-4">
                <div class="row justify-end q-gutter-md">
                  <q-btn
                    label="Finalizar"
                    size="md"
                    unelevated
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="$router.push({ name: 'BankingEntitiesList' })"
                  >
                  </q-btn>
                </div>
              </section>
            </q-list>
          </template>
        </Card>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import InformationForm from '@/components/Forms/Treasury/BankingEntities/information/InformationForm.vue'
import useBankingEntitiesView from '@/views/treasury/banking-entities/v1/read/BankingEntitiesView'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import BankBranchesList from '@/views/treasury/bank-branches/v1/list/BankBranchesList.vue'

const {
  tabs,
  activeTab,
  headerProperties,
  tabActiveIdx,
  bank_receipt_request,
  handlerGoTo,
} = useBankingEntitiesView()
</script>
