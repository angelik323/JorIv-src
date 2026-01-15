<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="true"
      @on-back="handlerGoTo('BankingAccountsList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <Card>
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'information'"
              ref="formInformation"
              :action="'create'"
            />

            <PerformanceForm
              v-if="tabActive === 'performance'"
              ref="formPerformance"
              :action="'create'"
            />

            <RestatementForm
              v-if="tabActive === 'restatement'"
              ref="formRestatement"
              :action="'create'"
            />

            <q-separator class="mt-1" />

            <section>
              <div class="mx-3 mt-2 mb-3">
                <div class="row justify-end q-col-gutter-sm mt-1">
                  <Button
                    v-if="tabActiveIdx > 0"
                    :outline="true"
                    label="Atras"
                    class="mr-1"
                    :class-custom="'custom'"
                    color="orange"
                    :styleContent="{
                      'place-items': 'center',
                      'margin-left': '0.1em',
                    }"
                    @click="backTab"
                  />

                  <Button
                    v-if="
                      tabActiveIdx <
                      tabs.length -
                        (data_information_form?.coin_type == 'Extranjera'
                          ? 1
                          : 2)
                    "
                    :outline="false"
                    label="Continuar"
                    class="mr-1"
                    :class-custom="'custom'"
                    color="orange"
                    :styleContent="{
                      'place-items': 'center',
                      'margin-left': '0.1em',
                    }"
                    @click="nextTab"
                  />

                  <Button
                    v-if="
                      tabActiveIdx ==
                      tabs.length -
                        (data_information_form?.coin_type == 'Extranjera'
                          ? 1
                          : 2)
                    "
                    :outline="false"
                    label="Crear"
                    class="mr-1"
                    :class-custom="'custom'"
                    color="orange"
                    :styleContent="{
                      'place-items': 'center',
                      'margin-left': '0.1em',
                    }"
                    @click="onSubmit"
                  />
                </div>
              </div>
            </section>
          </template>
        </Card>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import InformationForm from '@/components/Forms/Treasury/BankingAccounts/Information/v2/InformationForm.vue'
import PerformanceForm from '@/components/Forms/Treasury/BankingAccounts/Performance/v2/PerformanceForm.vue'
import RestatementForm from '@/components/Forms/Treasury/BankingAccounts/Restatement/v2/RestatementForm.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useBankingAccountsCreate from '@/views/treasury/banking-accounts/v2/create/BankingAccountsCreate'

const {
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformation,
  formPerformance,
  formRestatement,
  data_information_form,

  nextTab,
  backTab,
  onSubmit,
  handlerGoTo,
} = useBankingAccountsCreate()
</script>
