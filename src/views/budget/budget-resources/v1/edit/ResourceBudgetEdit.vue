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
                v-if="tabActive === 'information' && resourceData"
                ref="resourceForm"
                action="edit"
                :data="resourceData"
                @update:modelValue="resourceData = $event"
              />

              <ResourceBankAccountForm
                v-if="tabActive === 'bank' && bankAccountData"
                ref="bankAccountForm"
                action="edit"
                :data="bankAccountData"
                @update:modelValue="bankAccountData = $event"
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
                  @click="onBack"
                />
                <Button
                  v-if="
                    (tabActive === 'information' &&
                      !resourceData?.has_bank_account) ||
                    tabActive === 'bank'
                  "
                  :outline="!validateForms()"
                  class-custom="custom"
                  :disabled="!validateForms()"
                  label="Actualizar"
                  size="md"
                  color="orange"
                  @click="onSubmit"
                />
                <Button
                  v-if="
                    tabActive === 'information' &&
                    resourceData?.has_bank_account
                  "
                  :outline="!resourceData?.has_bank_account"
                  class-custom="custom"
                  :disabled="!resourceData?.has_bank_account"
                  label="Continuar"
                  size="md"
                  color="orange"
                  @click="onContinue"
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
// components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import ResourceBudgetForm from '@/components/Forms/Budget/ResourceBudget/ResourceBudget/ResourceBudgetForm.vue'
import ResourceBankAccountForm from '@/components/Forms/Budget/ResourceBudget/ResourceBankAccount/ResourceBankAccountForm.vue'
// Logic view
import useResourceBudgetEdit from '@/views/budget/budget-resources/v1/edit/ResourceBudgetEdit'

const {
  resourceForm,
  bankAccountForm,
  resourceData,
  bankAccountData,
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  onSubmit,
  goToURL,
  onBack,
  onContinue,
  validateForms,
} = useResourceBudgetEdit()
</script>
