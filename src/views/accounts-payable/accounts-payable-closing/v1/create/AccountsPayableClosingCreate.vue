<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('AccountsPayableClosingList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <BasicDataForm
              v-if="tabActive === 'information'"
              ref="basicDataFormRef"
              :data="basic_data_form"
              action="create"
              @update:data="basic_data_form = $event"
            />

            <section class="mx-2 mb-2">
              <q-separator />
              <div class="row justify-end q-gutter-sm q-mt-lg">
                <Button label="Limpiar" :outline="true" @click="handleClear" />
                <Button
                  label="Buscar"
                  :outline="false"
                  :left-icon="defaultIconsLucide.magnify"
                  color="primary_fiduciaria"
                  colorIcon="#fff"
                  unelevated
                  @click="handleSearch"
                />
              </div>
            </section>

            <q-separator class="q-my-lg" />

            <section class="q-mt-xl q-px-lg">
              <p class="text-subtitle1 text-weight-bold text-black q-mb-md">
                Listado de negocios
              </p>

              <q-separator class="q-my-lg" />

              <TableList
                ref="businessTableRef"
                v-model:selected="selectedBusinesses"
                class="full-width"
                :rows="tableProps.rows"
                :columns="tableProps.columns"
                :loading="tableProps.loading"
                :pages="tableProps.pages"
                :hide-bottom="true"
                :hide-pagination="true"
                selection="multiple"
                row-key="id"
              />
            </section>

            <section class="mx-2 mb-2">
              <q-separator />
              <div class="row justify-end">
                <Button
                  label="Ejecutar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom mt-2"
                  @click="handleCreate"
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import BasicDataForm from '@/components/Forms/AccountsPayable/AccountsPayableClosing/BasicDataForm.vue'

// Logic
import useAccountsPayableClosingCreate from '@/views/accounts-payable/accounts-payable-closing/v1/create/AccountsPayableClosingCreate'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  basic_data_form,
  tableProps,
  selectedBusinesses,
  handleCreate,
  handleSearch,
  handleClear,
  goToURL,
  defaultIconsLucide,
} = useAccountsPayableClosingCreate()
</script>
