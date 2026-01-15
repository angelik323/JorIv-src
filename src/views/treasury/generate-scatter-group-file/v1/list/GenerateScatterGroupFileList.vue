<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          ref="filterComponentRef"
          @clear-filters="handleClear"
        />
      </section>
      <section class="q-mt-xl">
        <div class="flex justify-between q-px-xl items-center">
          <h5>Detalle</h5>
          <div style="display: flex; gap: 8px">
            <Button
              :outline="false"
              label="Generar archivo"
              size="md"
              color="orange"
              :disabled="!selectedId"
              colorIcon="white"
              :left-icon="useUtils().defaultIconsLucide.plusCircleOutline"
              @click="
                () => {
                  openModal(selectedId)
                  modalFunction = true
                }
              "
            />
            <Button
              :outline="false"
              label="Eliminar grupo de dispersión"
              size="md"
              unelevated
              :disabled="!selectedId"
              color="orange"
              class="custom"
              @click="
                () => {
                  openModal(selectedId)
                  modalFunction = false
                }
              "
            />
          </div>
        </div>
        <TableList
          :loading="tableDetailProps.loading"
          :rows="tableDetailProps.rows"
          :columns="tableDetailProps.columns"
          :pages="tableDetailProps.pages"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          :custom-columns="['select', 'status_id']"
        >
          <template #select="{ row }">
            <div class="px-1 flex justify-center">
              <q-radio
                dense
                size="sm"
                v-model="selectedId"
                :val="row"
                color="orange"
              />
            </div>
          </template>
        </TableList>
      </section>
      <section class="q-mt-xl">
        <TableList
          :title="tableBreakdownProps.title"
          :loading="tableBreakdownProps.loading"
          :rows="tableBreakdownProps.rows"
          :columns="tableBreakdownProps.columns"
          :pages="tableBreakdownProps.pages"
          :custom-columns="['select']"
        >
          <template #select="{ row }">
            <div class="px-1 flex justify-center">
              <q-radio
                dense
                size="sm"
                v-model="selectedBankId"
                :val="row.id"
                color="orange"
              />
            </div>
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        :open-dialog="modalRef"
        :title-header="modalFunction ? 'Generar archivo' : 'Eliminar grupo de dispersión'"
        v-model="modalRef"
        :style-modal="
          modalFunction
            ? 'min-width: 650px; max-height: 530px;max-width: 700px;'
            : 'min-width: 450px;;'
        "
        :showImgDefault="false"
        @close="handleClose"
        @confirm="modalFunction ? createField() : deleteField()"
      >
        <template #default-body>
          <section class="q-pa-xs" v-if="modalFunction">
            <div class="row q-col-gutter-sm q-mx-md q-mt-0">
              <div class="col-12">
                <div class="row q-col-gutter-x-lg">
                  <div class="col-3">
                    <GenericInputComponent
                      :default_value="models.validity"
                      :label="'Vigencia'"
                      disabled
                      :placeholder="''"
                      @update:model-value=""
                    />
                  </div>
                  <div class="col-3">
                    <GenericInputComponent
                      :default_value="models.bank"
                      :label="'Banco'"
                      disabled
                      :placeholder="''"
                      @update:model-value="handleFilter"
                    />
                  </div>
                  <div class="col-3">
                    <GenericInputComponent
                      :default_value="models.account"
                      :label="'Cuenta'"
                      disabled
                      :placeholder="''"
                      @update:model-value="handleFilter"
                    />
                  </div>
                  <div class="col-3">
                    <GenericInputComponent
                      :default_value="models.group"
                      :label="'Grupo dispersión'"
                      disabled
                      :placeholder="''"
                      @update:model-value="handleFilter"
                    />
                  </div>
                </div>
                <div class="row q-col-gutter-x-lg">
                  <div class="col-6">
                    <GenericSelectorComponent
                      :default_value="models.structure_bank_id"
                      :manual_option="dispersion_file_bank_structures"
                      map_options
                      :label="'Formato'"
                      :placeholder="''"
                      required
                      :rules="[]"
                      @update:model-value="
                        (val) => (models.structure_bank_id = val)
                      "
                    />
                  </div>
                  <div class="col-6">
                    <GenericDateInputComponent
                      :default_value="models.date_generate"
                      :label="'Fecha generación'"
                      :placeholder="''"
                      :option_calendar="
                        useCalendarRules().only_until(
                          moment().format('YYYY-MM-DD')
                        )
                      "
                      :rules="[]"
                      @update:model-value="
                        (val) => (models.date_generate = val)
                      "
                    />
                  </div>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-9">
                    <GenericInputComponent
                      :default_value="routerDocument"
                      :label="'Ruta'"
                      :placeholder="''"
                      :rules="[]"
                      @update:model-value="(val) => (models.route = val)"
                    />
                  </div>
                  <div class="col-3 flex items-center justify-center">
                    <Button
                      :outline="true"
                      :label="'Examinar'"
                      size="md"
                      unelevated
                      color="orange"
                      class="text-capitalize btn-filter custom"
                      @click="openFileSelector"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section v-else>
            <div class="flex flex-col items-center justify-center q-mb-md">
              <q-img
                src="@/assets/images/icons/alert_popup_delete.svg"
                max-width="80px"
                width="80px"
                fit="contain"
              />
            </div>
            <div class="flex text-center items-center justify-center">
              <h6 class="q-mt-md q-mb-md">
                ¿Desea disolver el grupo de dispersión #{{models.group}}?
              </h6>
            </div>
            <div class="q-px-md">
              <GenericInputComponent
                :default_value="models.motives"
                :label="'Motivos de eliminación'"
                type="textarea"
                :placeholder="'Inserte'"
                :rules="[
                  (val: string) => useRules().max_length(val, 100),
                ]"
                @update:model-value="(val) => (models.motives = val)"
              />
            </div>
          </section>
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import { useCalendarRules, useUtils } from '@/composables'
import useGenerateScatterGroupFileList from './GenerateScatterGroupFileList'
import { useRules } from '@/composables/useRules'
import moment from 'moment'

const {
  headerProps,
  filterComponentRef,
  filterConfig,
  tableDetailProps,
  tableBreakdownProps,
  modalRef,
  selectedId,
  dispersion_file_bank_structures,
  models,
  modalFunction,
  selectedBankId,
  routerDocument,
  handleFilter,
  handleClear,
  openModal,
  openFileSelector,
  createField,
  deleteField,
  handleClose,
  updatePerPage,
  updatePage,
} = useGenerateScatterGroupFileList()
</script>
