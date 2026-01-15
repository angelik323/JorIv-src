<script lang="ts" src="./ThirdPartiesEdit.ts" />
<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="true"
      @on-back="handlerGoTo('ThirdPartiesList')"
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
            <!-- v2 -->
            <BasicDataForm
              v-if="activeTab === 'BasicData'"
              ref="basicDataFormRef"
              :formType="'edit'"
              :data="thirdpartie_request"
            />

            <!-- v2 -->
            <EconActivityForm
              v-if="activeTab === 'EconActivity'"
              :formType="'edit'"
              :data="thirdpartie_request"
            />

            <!-- v2 -->
            <AddressForm
              v-if="activeTab === 'Address'"
              :formType="'edit'"
              :data="thirdpartie_request"
            />

            <!-- v2 -->
            <PhoneNumberForm
              v-if="activeTab === 'PhoneNumber'"
              :formType="'edit'"
              :data="thirdpartie_request"
            />

            <!-- v2 -->
            <EmailForm
              v-if="activeTab === 'Email'"
              :formType="'edit'"
              :data="thirdpartie_request"
            />

            <!-- v2 -->
            <BankAccountForm
              v-if="activeTab === 'BankAccount'"
              :formType="'edit'"
              :data="thirdpartie_request"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  v-if="
                    tabs.findIndex((tab) => tab.name === activeTab) > -1 &&
                    tabs.findIndex((tab) => tab.name === activeTab) > 0
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
                    tabs.findIndex((tab) => tab.name === activeTab) > -1 &&
                    tabs.findIndex((tab) => tab.name === activeTab) <
                      tabs.length - 1
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
                    tabs.findIndex((tab) => tab.name === activeTab) ===
                    tabs.length - 1
                  "
                  label="Actualizar "
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </Card>
      </section>
    </ContentComponent>
  </div>
</template>
