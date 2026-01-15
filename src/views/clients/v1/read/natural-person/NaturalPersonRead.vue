<script lang="ts" src="./NaturalPersonRead.ts" />
<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ClientsList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <VCard v-if="natural_client_request">
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'information'"
              :action="'view'"
              :data="natural_client_request"
            />
            <TributaryForm
              v-if="tabActive === 'tributary'"
              :action="'view'"
              :data="natural_client_request"
            />
            <FinanceForm
              v-if="tabActive === 'finance'"
              :action="'view'"
              :data="natural_client_request"
            />
            <PepForm
              v-if="tabActive === 'pep'"
              :action="'view'"
              :data="natural_client_request"
            />
            <EstateForm
              v-if="tabActive === 'estate'"
              :action="'view'"
              :data="natural_client_request"
            />
            <InvestorForm
              v-if="tabActive === 'investor'"
              :action="'view'"
              :data="natural_client_request"
            />
            <DocumentForm
              v-if="tabActive === 'document'"
              :action="'view'"
              :data="natural_client_request"
            />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      -1 &&
                    filteredTabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  flat
                  outline
                  label="Atrás"
                  icon="mdi-chevron-left"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="backTab()"
                />

                <q-btn
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      -1 &&
                    filteredTabs.findIndex((tab) => tab.name === tabActive) <
                      filteredTabs.length - 1
                  "
                  label="Continuar"
                  icon-right="mdi-chevron-right"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab()"
                />

                <q-btn
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  label="Finalizar"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="$router.push({ name: 'ClientsList' })"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
