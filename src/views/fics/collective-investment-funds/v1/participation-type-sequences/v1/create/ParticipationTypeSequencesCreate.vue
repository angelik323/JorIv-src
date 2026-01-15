<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      show-back-btn
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @on-back="handleGoToList"
    >
      <TabsComponent :tabs :tab-active :tab-active-idx />

      <VCard>
        <template #content-card>
          <div class="q-pa-lg row q-col-gutter-x-lg q-col-gutter-y-lg">
            <div class="col-12 col-md-3 text-black-90">
              <p class="text-weight-bold no-margin">Código del fondo</p>
              <p class="text-weight-medium no-margin">
                {{ formData?.fund_code ?? '-' }}
              </p>
            </div>

            <div class="col-12 col-md-3 text-black-90">
              <p class="text-weight-bold no-margin">Nombre del fondo</p>
              <p class="text-weight-medium no-margin">
                {{ formData?.fund_name ?? '-' }}
              </p>
            </div>

            <div class="col-12 col-md-3 text-black-90">
              <p class="text-weight-bold no-margin">Negocio</p>
              <p class="text-weight-medium no-margin">
                {{ formData?.business_trust?.business_code ?? '-' }}
              </p>
            </div>

            <div class="col-12 col-md-3 text-black-90">
              <p class="text-weight-bold no-margin">Fecha de cierre</p>
              <p class="text-weight-medium no-margin">
                {{
                  formData?.last_closing_date
                    ? formatDate(formData.last_closing_date, 'YYYY-MM-DD')
                    : '-'
                }}
              </p>
            </div>
          </div>
        </template>
      </VCard>

      <NoDataState v-if="isTableEmpty" type="no-results" />

      <div class="q-mt-xl" v-else>
        <VCard>
          <template #content-card>
            <div class="q-pa-lg editable-table">
              <TableList
                :title="tableProps.title"
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :pages="tableProps.pages"
                :custom-columns="['assigned_sequence', 'registration_code_id']"
              >
                <template #custom-header-action>
                  <Button
                    :outline="false"
                    :label="isAssignMode ? 'Asignar' : 'Asignar código'"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="toggleAssignMode"
                  />
                </template>

                <template #registration_code_id="{ row }">
                  <GenericSelectorComponent
                    v-if="isAssignMode"
                    :default_value="row.registration_code_id"
                    :manual_option="participationTypesCodes"
                    map_options
                    auto_complete
                    :required="false"
                    :rules="[]"
                    @update:model-value="row.registration_code_id = $event"
                  />
                  <p v-else class="text-weight-medium no-margin">
                    {{ row?.registration_code_id ?? '-' }}
                  </p>
                </template>

                <template #assigned_sequence="{ row }">
                  <GenericSelectorComponent
                    v-if="isAssignMode"
                    :default_value="row.assigned_sequence"
                    :manual_option="assignedSequence"
                    map_options
                    auto_complete
                    :required="false"
                    :rules="[]"
                    @update:model-value="row.assigned_sequence = $event"
                  />
                  <p v-else class="text-weight-medium no-margin">
                    {{ row?.assigned_sequence ?? '-' }}
                  </p>
                </template>
              </TableList>
            </div>
          </template>
        </VCard>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useParticipationTypeSequencesCreate from '@/views/fics/collective-investment-funds/v1/participation-type-sequences/v1/create/ParticipationTypeSequencesCreate'

const {
  tabs,
  formData,
  tabActive,
  formatDate,
  tableProps,
  headerProps,
  isAssignMode,
  tabActiveIdx,
  isTableEmpty,
  handleGoToList,
  toggleAssignMode,
  assignedSequence,
  participationTypesCodes,
} = useParticipationTypeSequencesCreate()
</script>
