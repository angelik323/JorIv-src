<template>
  <div class="q-px-xl" main>
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <FiltersComponent
        show_actions
        ref="filtersRef"
        :fields="filterConfig"
        @filter="handleFilter"
        trigger_event_by_field
        @update:values="onChangeFilter"
        @clear-filters="handleClearFilters"
      />

      <div class="q-pa-md q-gutter-y-xl" aria-label="Sección de listado">
        <TableList
          v-if="tablePropertiesDetail.rows.length > 0"
          hidePagination
          :title="tablePropertiesDetail.title"
          :loading="tablePropertiesDetail.loading"
          :rows="tablePropertiesDetail.rows"
          :columns="tablePropertiesDetail.columns"
          :custom-columns="['radio_button']"
          @update-page="handleUpdatePageDetail"
          @update-rows-per-page="handleUpdatePerPageDetail"
        >
          <template #radio_button="{ row }">
            <q-radio
              v-model="selectedRowIdDetail"
              :val="row.id"
              dense
              color="orange"
            />
          </template>
        </TableList>

        <q-separator class="q-my-md" v-if="selectedRowIdDetail" />

        <div v-if="selectedRowIdDetail">
          <div class="row items-center q-mb-md" aria-label="Sección de listado">
            <div class="col-12 col-md-6">
              <p class="text-h5 q-mb-none">
                {{ tablePropertiesBreakdown.title }}
              </p>
            </div>

            <div
              class="row items-center justify-end col-12 col-md-6 q-gutter-x-md"
            >
              <div class="col-12 col-md-8 text-right">
                <q-radio
                  v-for="option in dispersion_options['radio']"
                  :key="option.value"
                  v-model="selectedRadioBreakdown"
                  :val="option.value"
                  :label="option.label"
                  color="orange"
                />
              </div>

              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  :default_value="selectedGroup"
                  :manual_option="dispersion_options['group']"
                  auto_complete
                  map_options
                  :rules="[]"
                  :required="false"
                  @update:model-value="selectedGroup = $event"
                />
              </div>
            </div>
          </div>

          <TableList
            hidePagination
            :loading="tablePropertiesBreakdown.loading"
            :rows="tablePropertiesBreakdown.rows"
            :columns="tablePropertiesBreakdown.columns"
            :custom-columns="['checkbox_button']"
            @update-page="handleUpdatePageBreakdown"
            @update-rows-per-page="handleUpdatePerPageBreakdown"
          >
            <template #checkbox_button="{ row }">
              <q-checkbox
                v-model="selectedRowIdBreakdown"
                :val="row.id"
                color="orange"
              />
            </template>
          </TableList>

          <div class="flex justify-end q-mb-md q-mt-xl q-gutter-x-md">
            <Button
              :outline="false"
              label="Generar grupo de dispersión"
              color="orange"
              :disabled="
                selectedDetailRow?.dispersion_type !== 'Archivo plano' ||
                !hasSelectedRows
              "
              class="text-capitalize btn-filter custom"
              @click="handleSubmitGroupDispersion"
            />
            <Button
              class-custom="custom"
              outline
              label="Generar carta"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              :disabled="
                selectedDetailRow?.dispersion_type !== 'Carta parametrizable' ||
                !hasSelectedRows
              "
              :left-img="imgButtonHeaderTable"
              @click="handleSubmitGroupDispersion"
            />
          </div>
        </div>

        <VCard v-if="hasSelectedRows && !selectedGroup">
          <template #content-card>
            <div class="q-pa-lg" aria-label="Sección de descripciones">
              <p class="text-weight-bold text-h6">Descripciones</p>

              <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
                <div class="col-12 col-md-6 text-black-90">
                  <p
                    id="lbl-third-party-name"
                    class="text-weight-bold no-margin"
                  >
                    Tercero
                  </p>
                  <p
                    class="text-weight-medium no-margin"
                    aria-labelledby="lbl-third-party-name"
                  >
                    {{ descriptionData.third_party_name }}
                  </p>
                </div>

                <div class="col-12 col-md-6 text-black-90">
                  <p id="lbl-bank-account" class="text-weight-bold no-margin">
                    Cuenta
                  </p>
                  <p
                    class="text-weight-medium no-margin"
                    aria-labelledby="lbl-bank-account"
                  >
                    {{ descriptionData.bankAccount }}
                  </p>
                </div>

                <div class="col-12 col-md-6 text-black-90">
                  <p id="lbl-bank" class="text-weight-bold no-margin">Banco</p>
                  <p
                    class="text-weight-medium no-margin"
                    aria-labelledby="lbl-bank"
                  >
                    {{ descriptionData.bank }}
                  </p>
                </div>

                <div class="col-12 col-md-6 text-black-90">
                  <p id="lbl-bank-branch" class="text-weight-bold no-margin">
                    Sucursal
                  </p>
                  <p
                    class="text-weight-medium no-margin"
                    aria-labelledby="lbl-bank-branch"
                  >
                    {{ descriptionData.bankBranch }}
                  </p>
                </div>
              </div>
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
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useDetailDispersionGroupList from '@/views/treasury/detail-dispersion-group/v2/list/DetailDispersionGroupList'

const {
  filtersRef,
  filterConfig,
  handleFilter,
  selectedGroup,
  onChangeFilter,
  descriptionData,
  hasSelectedRows,
  headerProperties,
  selectedDetailRow,
  handleClearFilters,
  dispersion_options,
  selectedRowIdDetail,
  tablePropertiesDetail,
  selectedRowIdBreakdown,
  handleUpdatePageDetail,
  selectedRadioBreakdown,
  tablePropertiesBreakdown,
  handleUpdatePageBreakdown,
  handleUpdatePerPageDetail,
  handleSubmitGroupDispersion,
  handleUpdatePerPageBreakdown,
} = useDetailDispersionGroupList()
</script>

<style lang="scss" src="./DetailDispersionGroupList.scss"></style>
