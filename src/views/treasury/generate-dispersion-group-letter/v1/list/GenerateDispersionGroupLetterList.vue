<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filtersRef"
          :fields="filters"
          @filter="handleFilter"
          @show-more="handleShowMoreFilters"
          :buttons="['more_filters']"
          @clear-filters="handleClear"
          @update:values="onChangeFilter"
        />
      </section>

      <section class="q-mt-xl q-pt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['actions', 'select', 'status', 'format']"
          selection="none"
        >
          <template #select="{ row }">
            <div class="px-1 flex justify-center">
              <q-radio
                dense
                size="sm"
                v-model="groupSelected"
                :val="row.id"
                color="orange"
                @click="getDetailDispersionGroup(row.id)"
              />
            </div>
          </template>

          <template #format="{ row }">
            <GenericSelectorComponent
              :manual_option="letterFormatOptionsDesc"
              map_options
              required
              :default_value="null"
              :auto_complete="false"
              :clearable="false"
              :disabled="false"
              @update:model-value="(value) => (selectedFormats[row.id] = value)"
              :rules="[(v: string) => useRules().is_required(v, 'El formato es requerido')]"
            />
          </template>

          <template #status="{ row }">
            <ShowStatus
              status-type="dispersion_group_letter"
              :type="row.status.id ?? 0"
            />
          </template>
        </TableList>

        <div class="q-mt-sm q-mb-lg row justify-end q-gutter-md">
          <Button
            v-if="groupSelected"
            :outline="false"
            :class-custom="'custom'"
            label="Eliminar grupo dispersión"
            size="md"
            :color="detailTableProps.rows.length > 0 ? 'orange' : 'gray'"
            @click="handleClickDissolution"
          />
          <Button
            v-if="groupSelected || selectedFormats"
            :outline="false"
            :class-custom="'custom'"
            label="Generar carta"
            size="md"
            @click="handleGenerateLetters"
          />
        </div>
      </section>

      <section class="q-mt-xl q-mb-xl" v-if="groupSelected">
        <TableList
          :title="'Detalle de pagos del grupo de dispersión'"
          :loading="false"
          :rows="detailTableProps.rows"
          :columns="detailTableProps.columns"
          :pages="dispersion_group_letter_details_pages"
          :custom-columns="[]"
          selection="none"
          hide-pagination
        />
      </section>
    </ContentComponent>

    <ModalComponent
      ref="alertModalRef"
      :title="`¿Desea eliminar el grupo de dispersión ${groupSelected}?`"
      :show-img-default="false"
      class-title="modal-alert__title--10 mx-2"
      :open-dialog="showModalDissolution"
      @update:openDialog="(val: boolean) => (showModalDissolution = val)"
    >
      <template #content-modal>
        <div class="q-mb-md q-mt-lg q-pt-md">
          <GenericInput
            type="textarea"
            :placeholder="'Ingrese el motivo de la disolución'"
            :default_value="reasonDissolution"
            @update:model-value="(val: string) => (reasonDissolution = val)"
          />
        </div>
        <div class="row justify-center q-gutter-sm">
          <Button
            label="Cancelar"
            color="orange"
            :outline="true"
            size="md"
            :class-custom="'custom'"
            @click=";(showModalDissolution = false), (reasonDissolution = '')"
          />
          <Button
            label="Aceptar"
            :class-custom="'custom'"
            size="md"
            :color="reasonDissolution ? 'orange' : 'grey'"
            :outline="false"
            :disable="!reasonDissolution"
            @click="confirmDissolution"
          />
        </div>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import { useRules } from '@/composables'
import useGenerateDispersionGroupLetterList from './GenerateDispersionGroupLetterList'

const {
  headerProps,
  tableProps,
  detailTableProps,
  filters,
  filtersRef,
  showModalDissolution,
  reasonDissolution,
  letterFormatOptionsDesc,
  selectedFormats,
  dispersion_group_letter_details_pages,
  alertModalRef,
  groupSelected,
  onChangeFilter,
  handleGenerateLetters,
  handleClickDissolution,
  confirmDissolution,
  handleFilter,
  getDetailDispersionGroup,
  handleClear,
  handleShowMoreFilters,
} = useGenerateDispersionGroupLetterList()
</script>

<style lang="scss">
.modal-alert {
  &__title {
    &--10 {
      font-size: 20px;
    }
  }
}
</style>
