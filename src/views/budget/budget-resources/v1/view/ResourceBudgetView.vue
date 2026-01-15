<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('ResourceBudgetList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabActive="tabActive"
          :tabs="tabs"
          :tabActiveIdx="tabActiveIdx"
        />

        <VCard v-if="resourceData">
          <template #content-card>
            <div class="q-px-lg q-pt-lg">
              <ResourceBudgetForm
                v-if="tabActive === 'information'"
                action="view"
                :data="resourceData"
              />

              <ResourceBankAccountForm
                v-if="tabActive === 'bank'"
                action="view"
                :data="bankAccountData"
              />
            </div>
            <!-- Action Button -->
            <section class="q-pb-lg q-pr-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="tabActive === 'bank'"
                  :outline="true"
                  class-custom="custom"
                  label="Atrás"
                  size="md"
                  color="orange"
                  @click="tabActive = 'information'"
                />
                <Button
                  v-if="
                    tabActive !== 'information' ||
                    !resourceData?.has_bank_account
                  "
                  :outline="false"
                  class-custom="custom"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  @click="goToURL('ResourceBudgetList')"
                />
                <Button
                  v-if="
                    tabActive === 'information' &&
                    resourceData?.has_bank_account
                  "
                  :outline="true"
                  class-custom="custom"
                  label="Continuar"
                  size="md"
                  color="orange"
                  @click="tabActive = 'bank'"
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import ResourceBudgetForm from '@/components/Forms/Budget/ResourceBudget/ResourceBudget/ResourceBudgetForm.vue'
import ResourceBankAccountForm from '@/components/Forms/Budget/ResourceBudget/ResourceBankAccount/ResourceBankAccountForm.vue'
// logic view
import useResourceBudgetView from '@/views/budget/budget-resources/v1/view/ResourceBudgetView'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  resourceData,
  bankAccountData,
  goToURL,
} = useResourceBudgetView()
</script>
