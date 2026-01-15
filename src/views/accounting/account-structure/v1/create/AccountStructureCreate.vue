<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'AccountStructureList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard>
          <template #content-card>
            <div v-if="tabActive === 'information'">
              <AccountStructureForm
                ref="accountStructureForm"
                :action="'create'"
                @update="handleFormUpdate"
              />
            </div>
            <!-- Buttons -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  outline
                  label="Ver estructura"
                  color="orange"
                  class-custom="custom"
                  :styleContent="{
                    color: 'black',
                  }"
                  @click="openStructuresModal"
                />
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  :outline="false"
                  :class-custom="'custom'"
                  :disabled="
                    isAccountingCatalog && !models.catalog_limits.length
                  "
                  label="Crear"
                  size="md"
                  color="orange"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </VCard>
        <AlertModalComponent
          :show-img-default="false"
          :show-btn-cancel="false"
          :show-btn-confirm="false"
          ref="alertModalRef"
          styleModal="min-width: 60%"
          :title-header="accountStructuresTableProps.title"
        >
          <template #default-body>
            <div class="q-px-lg">
              <TableList
                :loading="accountStructuresTableProps.loading"
                :columns="accountStructuresTableProps.columns"
                :rows="accountStructuresTableProps.rows"
                :hide-bottom="true"
              >
              </TableList>
            </div>
          </template>
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import AccountStructureForm from '@/components/Forms/Accounting/AccountStructure/Information/InformationForm.vue'

import useAccountStructureCreate from '@/views/accounting/account-structure/v1/create/AccountStructureCreate'

const {
  models,
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  alertModalRef,
  accountStructuresTableProps,
  accountStructureForm,
  isAccountingCatalog,
  onSubmit,
  openStructuresModal,
  handleFormUpdate,
} = useAccountStructureCreate()
</script>
