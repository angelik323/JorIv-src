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
            <div v-if="tabActive === 'information'" class="q-pa-lg">
              <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                <div class="col-12 col-md-3">
                  <p class="text-bold mb-0 text-black-10">Código</p>
                  <div>
                    {{ accountStructure?.code }}
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <p class="text-bold mb-0 text-black-10">Estructura</p>
                  <div>
                    {{ accountStructure?.structure }}
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <p class="text-bold mb-0 text-black-10">Finalidad</p>
                  <div>
                    {{ accountStructure?.purpose }}
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <p class="text-bold mb-0 text-black-10">Tipo</p>
                  <div>
                    {{ accountStructure?.type.value }}
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <p class="text-bold mb-0 text-black-10">Estado</p>
                  <div>
                    <ShowStatus
                      :type="Number(accountStructure?.status.id ?? 1)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <q-separator spaced class="q-mx-lg" />
            <section v-if="isAccountingCatalog" class="q-pa-lg">
              <TableList
                :title="catalogLimitsTableProps.title"
                :loading="catalogLimitsTableProps.loading"
                :columns="catalogLimitsTableProps.columns"
                :rows="catalogLimitsTableProps.rows"
                :pages="catalogLimitsTableProps.pages"
                @update-page=""
              >
              </TableList>
            </section>
            <!-- Buttons -->
            <section class="q-ma-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  :outline="false"
                  :class-custom="'custom q-mt-md'"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  @click="goToList"
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
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useAccountStructureView from '@/views/accounting/account-structure/v1/view/AccountStructureView'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  accountStructure,
  catalogLimitsTableProps,
  isAccountingCatalog,
  goToList,
} = useAccountStructureView()
</script>
