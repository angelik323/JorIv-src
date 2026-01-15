<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      show-back-btn
      :title="headerConfig.title"
      :breadcrumbs="headerConfig.breadcrumbs"
      @on-back="handleGoToList"
    >
      <FiltersComponent
        :fields="filtersConfig"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
      />

      <section>
        <TableList
          hide-header
          hide-pagination
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :custom-columns="tableCustomCols"
          :rows="tableProps.rows"
        >
          <template
            #module="{ row }: { row: IAuditEntryFunctionalitiesModule }"
          >
            <q-expansion-item expand-separator>
              <template #header>
                <q-item-section avatar>
                  <q-checkbox
                    v-model="row.selected"
                    @update:model-value="toggleModule(row, $event)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Módulo</q-item-label>
                  <q-item-label>{{ row.description }}</q-item-label>
                </q-item-section>
              </template>

              <div v-for="submodule in row.submodule" :key="submodule.id">
                <q-expansion-item
                  :header-inset-level="1"
                  :content-inset-level="2"
                  expand-separator
                  :hide-expand-icon="submodule.actions.length === 0"
                >
                  <template #header>
                    <q-item-section avatar>
                      <q-checkbox
                        v-model="submodule.has_logs"
                        @update:model-value="
                          toggleSubmodule(row, submodule, $event)
                        "
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Submódulo</q-item-label>
                      <q-item-label>{{ submodule.name }}</q-item-label>
                    </q-item-section>
                  </template>

                  <div v-for="action in submodule.actions" :key="action.id">
                    <q-expansion-item expand-separator hide-expand-icon>
                      <template #header>
                        <q-item-section avatar>
                          <q-checkbox
                            v-model="action.has_logs"
                            @update:model-value="
                              toggleAction(row, submodule, action, $event)
                            "
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>Acción</q-item-label>
                          <q-item-label>{{ action.description }}</q-item-label>
                        </q-item-section>
                      </template>
                    </q-expansion-item>
                  </div>
                </q-expansion-item>
              </div>
            </q-expansion-item>
          </template>
        </TableList>
      </section>

      <section class="q-mt-md row justify-end items-center">
        <Button
          label="Actualizar"
          size="md"
          class-custom="custom"
          color="orange"
          :outline="false"
          :disabled="!isEnabledUpdateBtn"
          @click="handleUpdateClick"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

// Interfaces
import { IAuditEntryFunctionalitiesModule } from '@/interfaces/customs/audit/AuditEntryOfFunctionalities'

// Logic
import useAuditDatabaseLogsEdit from '@/views/audit/database-logs/v1/configure/AuditDatabaseLogsEdit'

const {
  // composable refs and variables
  // composable functions

  // Refs and computed props
  headerConfig,
  filtersConfig,
  tableProps,
  tableCustomCols,
  isEnabledUpdateBtn,

  // Functions/Methods
  handleGoToList,
  handleClearFilters,
  handleFilterSearch,
  toggleModule,
  toggleSubmodule,
  toggleAction,
  handleUpdateClick,
} = useAuditDatabaseLogsEdit()
</script>
