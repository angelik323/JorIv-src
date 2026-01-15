<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'QualificationsMaintenanceList' })"
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
            <InformationForm
              v-show="tabActive === 'information'"
              :action="'view'"
            />
            <section class="q-mt-md q-pa-md">
              <TableList
                v-show="tabActive === 'historial'"
                :title="tableHistorialProps.title"
                :loading="tableHistorialProps.loading"
                :rows="tableHistorialProps.rows"
                :columns="tableHistorialProps.columns"
                :pages="tableHistorialProps.pages"
                @update-page="updatePage"
                @update-rows-per-page="updatePerPage"
              >
              </TableList>
            </section>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      -1 &&
                    filteredTabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  label="Atrás"
                  size="md"
                  unelevated
                  outline
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="backTab"
                />

                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      -1 &&
                    filteredTabs.findIndex((tab) => tab.name === tabActive) <
                      filteredTabs.length - 1
                  "
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.next"
                  color-icon="#fff"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />

                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="
                    $router.push({ name: 'QualificationsMaintenanceList' })
                  "
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
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InformationForm from '@/components/Forms/InvestmentPortfolio/QualificationsMaintenance/Information/InformationForm.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import { defaultIconsLucide } from '@/utils'

// Logic view
import useQualificationsMaintenanceView from '@/views/investment-portfolio/qualifications-maintenance/v1/view/QualificationsMaintenanceView'

const {
  tableHistorialProps,
  tabActiveIdx,
  filteredTabs,
  headerProps,
  tabActive,
  updatePage,
  updatePerPage,
  nextTab,
  backTab,
} = useQualificationsMaintenanceView()
</script>
