<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        trigger_event_by_field
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState v-if="isEquivalenceListEmpty" type="empty" />

      <div class="q-pt-md q-my-xl accordeon-item" v-else>
        <q-expansion-item
          v-for="(config, key) in keyConfig"
          :key="key"
          :label="config.label"
        >
          <template #header>
            <div
              class="row items-center justify-between full-width q-pr-md q-py-sm"
            >
              <div>
                <div class="title">{{ config.label }}</div>
                <div class="subtitle text-grey-8">
                  Haz clic sobre <strong>{{ config.label }}</strong> para
                  desplegar la tabla
                </div>
              </div>
              <Button
                v-if="
                  validateRouter(
                    'Treasury',
                    'BankStructureEquivalencesList',
                    'create'
                  )
                "
                label="Crear"
                left-icon="CirclePlus"
                color="white"
                class="text-capitalize btn-filter"
                :outline="false"
                colorIcon="white"
                @click="
                  handleCreateEditModal('create', null, key, config.label)
                "
              />
            </div>
          </template>

          <div class="q-pt-lg q-px-md">
            <VCard>
              <template #content-card>
                <div class="q-ma-md">
                  <TableList
                    :loading="tableProperties.loading"
                    :rows="groupedEquivalences[config.field] || []"
                    :columns="getColumns(config.label)"
                    :pages="tableProperties.pages"
                    :custom-columns="customColumns"
                    @update-page="updatePage"
                  >
                    <template #actions="{ row }">
                      <Button
                        v-if="
                          validateRouter(
                            'Treasury',
                            'BankStructureEquivalencesList',
                            'edit'
                          )
                        "
                        :label="''"
                        left-icon="Pencil"
                        color="orange"
                        :class-custom="'custom'"
                        :outline="false"
                        :flat="true"
                        colorIcon="#f45100"
                        :tooltip="'Editar'"
                        @click="
                          handleOptions('edit', row.id, key, config.label)
                        "
                      />
                      <Button
                        v-if="
                          validateRouter(
                            'Treasury',
                            'BankStructureEquivalencesList',
                            'delete'
                          )
                        "
                        :label="''"
                        left-icon="Trash"
                        color="orange"
                        :class-custom="'custom'"
                        :outline="false"
                        :flat="true"
                        colorIcon="#f45100"
                        :tooltip="'Eliminar'"
                        @click="handleOptions('delete', row.id)"
                      />
                    </template>
                  </TableList>
                </div>
              </template>
            </VCard>
          </div>
        </q-expansion-item>
      </div>

      <AlertModalComponent
        ref="createEditModalRef"
        styleModal="max-width: 1000px; width: 100%;"
        :showBtnConfirm="false"
        :showBtnCancel="false"
        :showImgDefault="false"
        :showCloseBtn="true"
      >
        <template #default-body>
          <div class="q-mx-lg q-col-gutter-md">
            <p class="title-modal">
              {{ currentLabel }}
            </p>
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <p
                  class="q-mb-none text-grey-10 text-weight-medium label-modal"
                >
                  {{ currentLabel }}
                </p>
                <GenericSelectorComponent
                  :default_value="formData.typeable_id"
                  :manual_option="selectorOptions"
                  :auto_complete="true"
                  :map_options="true"
                  required
                  :rules="[
                    (val: string) => useRules().is_required(val, capitalize(currentLabel) + ' es requerido.') 
                  ]"
                  @update:modelValue="formData.typeable_id = $event"
                />
              </div>

              <div class="col-12 col-md-6">
                <p class="q-mb-none text-grey-10 text-weight-medium">
                  Tipo de dato
                </p>
                <GenericSelectorComponent
                  :default_value="formData.data_type"
                  :manual_option="data_type"
                  :auto_complete="true"
                  :map_options="true"
                  display_label="value"
                  display_value="value"
                  required
                  :rules="[
                    (val: string) => useRules().is_required(val, 'El tipo de dato es requerido.') 
                  ]"
                  @update:modelValue="formData.data_type = $event"
                />
              </div>
            </div>

            <div class="col-12">
              <p class="q-mb-none text-grey-10 text-weight-medium">
                Equivalencia 1*
              </p>
              <GenericInputComponent
                :default_value="formData.equivalence_1"
                placeholder="Inserte"
                required
                type="text"
                :rules="[
                  (val: string) => formData.data_type === 'Alfanumérico' ? useRules().only_alphanumeric(val) : true,
                  (val: string) => formData.data_type === 'Numérico' ? useRules().only_number(val) : true,
                  (val: string) => useRules().max_length(val, 6),
                ]"
                @update:modelValue="formData.equivalence_1 = $event"
              />
            </div>

            <div class="col-12">
              <p class="q-mb-none text-grey-10 text-weight-medium">
                Equivalencia 2*
              </p>
              <GenericInputComponent
                :default_value="formData.equivalence_2"
                placeholder="Inserte"
                required
                type="text"
                :rules="[
                  (val: string) => formData.data_type === 'Alfanumérico' ? useRules().only_alphanumeric(val) : true,
                  (val: string) => formData.data_type === 'Numérico' ? useRules().only_number(val) : true,
                  (val: string) => useRules().max_length(val, 6),
                ]"
                @update:modelValue="formData.equivalence_2 = $event"
              />
            </div>

            <div class="col-12">
              <p class="q-mb-none text-grey-10 text-weight-medium">
                Equivalencia 3*
              </p>
              <GenericInputComponent
                :default_value="formData.equivalence_3"
                placeholder="Inserte"
                required
                type="text"
                :rules="[
                  (val: string) => formData.data_type === 'Alfanumérico' ? useRules().only_alphanumeric(val) : true,
                  (val: string) => formData.data_type === 'Numérico' ? useRules().only_number(val) : true,
                  (val: string) => useRules().max_length(val, 6),
                ]"
                @update:modelValue="formData.equivalence_3 = $event"
              />
            </div>
          </div>

          <div class="row q-mt-lg flex justify-center">
            <Button
              label="Cancelar"
              color="orange"
              class="text-capitalize btn-filter custom q-mr-md"
              outline
              @click="handleCloseModal"
            />

            <Button
              :outline="false"
              :label="currentAction === 'create' ? 'Crear' : 'Actualizar'"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="handleSubmitForm(currentLabel)"
            />
          </div>
        </template>
      </AlertModalComponent>

      <AlertModalComponent
        ref="deleteModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="deleteModalConfig.description"
        :description_message="''"
        @confirm="handleDeleteItem()"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import useBankStructureEquivalencesList from './BankStructureEquivalencesList'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import { useRules } from '@/composables'

const {
  formData,
  keyConfig,
  data_type,
  updatePage,
  capitalize,
  getColumns,
  currentLabel,
  handleFilter,
  filterConfig,
  customColumns,
  handleOptions,
  currentAction,
  deleteModalRef,
  validateRouter,
  tableProperties,
  selectorOptions,
  handleCloseModal,
  handleSubmitForm,
  headerProperties,
  handleDeleteItem,
  deleteModalConfig,
  handleClearFilters,
  createEditModalRef,
  groupedEquivalences,
  handleCreateEditModal,
  isEquivalenceListEmpty,
} = useBankStructureEquivalencesList()
</script>

<style lang="scss" src="./BankStructureEquivalencesList.scss" />
