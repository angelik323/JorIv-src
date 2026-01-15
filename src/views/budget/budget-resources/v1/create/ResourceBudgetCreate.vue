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
        <!-- Tabs -->
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          disable
        />

        <VCard>
          <template #content-card>
            <div class="q-px-lg q-pt-lg">
              <ResourceBudgetForm
                v-if="tabActive === 'information'"
                ref="resourceForm"
                :action="'create'"
                :data="resourceData"
                @update:modelValue="resourceData = $event"
              />

              <ResourceBankAccountForm
                v-if="tabActive === 'bank'"
                ref="bankAccountForm"
                :action="'create'"
                :data="bankAccountData"
                @update:modelValue="bankAccountData = $event"
              />
            </div>

            <!-- Validate Button -->
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
                  :outline="tabActive === 'information' && hasBankAccount"
                  class-custom="custom"
                  :disabled="tabActive === 'information' && hasBankAccount"
                  label="Crear"
                  size="md"
                  color="orange"
                  @click="createResource"
                />
                <Button
                  v-if="tabActive === 'information'"
                  :outline="!hasBankAccount"
                  class-custom="custom"
                  :disabled="!hasBankAccount"
                  label="Continuar"
                  size="md"
                  color="orange"
                  @click="continueToBank"
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
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ResourceBudgetForm from '@/components/Forms/Budget/ResourceBudget/ResourceBudget/ResourceBudgetForm.vue'
import ResourceBankAccountForm from '@/components/Forms/Budget/ResourceBudget/ResourceBankAccount/ResourceBankAccountForm.vue'
// Logic view
import useResourceBudgetCreate from '@/views/budget/budget-resources/v1/create/ResourceBudgetCreate'

const {
  resourceForm,
  bankAccountForm,
  hasBankAccount,
  resourceData,
  bankAccountData,
  headerProps,
  tabActive,
  filteredTabs,
  tabActiveIdx,
  createResource,
  continueToBank,
  goToURL,
} = useResourceBudgetCreate()
</script>
