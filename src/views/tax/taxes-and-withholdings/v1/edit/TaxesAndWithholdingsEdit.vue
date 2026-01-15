<template>
  <div class="q-px-xl">
    <ContentComponent
      content-indentation
      :title="title"
      :breadcrumbs="breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('TaxesAndWithholdingsList')"
    >
      <section>
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />
      </section>

      <section>
        <Card>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <BasicDataForm
                v-if="tabActive === 'basic_data'"
                ref="informationFormRef"
                action="edit"
                v-model:data="basic_data_form"
              />

              <BillingForm
                v-if="tabActive === 'billing'"
                ref="billingFormRef"
                action="edit"
                v-model:data="basic_data_form"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  flat
                  outline
                  label="Atrás"
                  :left-icon="defaultIconsLucide.back"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="backTab()"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
                  "
                  label="Continuar"
                  :right-icon="defaultIconsLucide.next"
                  size="md"
                  :outline="false"
                  unelevated
                  color="orange"
                  color-icon="white"
                  class="custom"
                  @click="nextTab()"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Actualizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="custom"
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

<script lang="ts" setup>
// Components
import BasicDataForm from '@/components/Forms/Tax/TaxesAndWithholdings/v1/BasicData/BasicData.vue'
import BillingForm from '@/components/Forms/Tax/TaxesAndWithholdings/v1/Billing/Billing.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic
import useTaxesAndWithholdingsEdit from '@/views/tax/taxes-and-withholdings/v1/edit/TaxesAndWithholdingsEdit'

const {
  title,
  breadcrumbs,
  tabs,
  tabActive,
  tabActiveIdx,
  defaultIconsLucide,
  informationFormRef,
  billingFormRef,
  basic_data_form,
  nextTab,
  backTab,
  onSubmit,
  goToURL,
} = useTaxesAndWithholdingsEdit()
</script>
