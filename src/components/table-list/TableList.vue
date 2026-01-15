<script lang="ts" setup>
import { IPages } from '@/interfaces/customs/IPages'
import { QTable } from 'quasar'
import { onMounted, ref, watch, withDefaults } from 'vue'
const props = withDefaults(
  defineProps<{
    title?: string
    rows: QTable['rows']
    columns: QTable['columns']
    dense?: QTable['dense']
    loading: QTable['loading']
    separator?: QTable['separator']
    rowKey?: QTable['rowKey']
    nonpadding?: boolean
    wrapCells?: boolean
    rowsPerPageOptions?: QTable['rowsPerPageOptions']
    customColumns?: string[]
    visibleColumns?: string[]
    pages?: IPages
    hideBottom?: QTable['hideBottom']
    hideHeader?: QTable['hideHeader']
    hidePagination?: QTable['hidePagination']
    selection?: QTable['selection']
    canDisableSelection?: boolean
    disableSelection?: boolean
    selectionFilter?: Function
    customNoDataMessageTitle?: string
    customNoDataMessageSubtitle?: string
  }>(),
  {
    loading: false,
    separator: 'none',
    rowKey: 'id',
    nonpadding: false,
    rowsPerPageOptions: () => [20, 50, 100],
    hideBottom: false,
    hideHeader: false,
    hidePagination: false,
    selection: 'none',
    canDisableSelection: false,
    selectionFilter: (selected: unknown) => selected,
    customNoDataMessageTitle: 'Realice una búsqueda para ver los datos',
    customNoDataMessageSubtitle:
      'Aquí visualizará los resultados de su búsqueda',
  }
)

const emits = defineEmits<{
  (e: 'updatePage', page: number): number
  (e: 'selected', selected: any): any
  (e: 'updateRowsPerPage', rowsPerPage: number): number
  (e: 'update:selected', val: any[]): void
}>()

const selected = ref([])
const rowsPerPage = ref(props.rowsPerPageOptions[0])

const pagination = ref({
  page: 1,
  rowsPerPage: rowsPerPage.value,
})

watch(rowsPerPage, (newVal) => {
  pagination.value.rowsPerPage = newVal
  pagination.value.page = 1
})

watch(selected, (val) => {
  emits('update:selected', val)
})

const handleSelection = () => {
  if (props.selection != 'none') {
    emits('selected', { rows: props.rows?.length, selected: selected.value })
  }
}

const clearSelection = () => {
  selected.value = []
}

onMounted(() => {
  handleSelection()
})

defineExpose({
  clearSelection,
})
</script>

<template>
  <q-table
    class="custom-table my-sticky-header-table"
    :title="title"
    :rows="rows"
    :columns="columns"
    :visible-columns="visibleColumns"
    :dense="dense"
    :loading="loading"
    :separator="separator"
    :row-key="rowKey"
    :nonpadding="nonpadding"
    :wrap-cells="wrapCells"
    :rows-per-page-options="rowsPerPageOptions"
    :hide-bottom="hideBottom"
    :hide-pagination="hidePagination"
    :selection="selection"
    :hide-header="hideHeader"
    :pagination="pagination"
    v-model:selected="selected"
    @update:pagination="(val) => (pagination = val)"
    @update:selected="handleSelection"
  >
    <template v-if="canDisableSelection" #body-selection="props">
      <q-checkbox
        v-model="props.selected"
        :disable="props.row.disabled || disableSelection"
        color="primary"
      />
    </template>
    <template #header="props">
      <q-tr :props="props">
        <q-th auto-width v-if="!['none', 'single'].includes(selection)">
          <q-checkbox
            v-model="props.selected"
            :disable="disableSelection"
            color="orange"
            @update:model-value="selected = selectionFilter(selected)"
          />
        </q-th>
        <q-th auto-width v-if="selection === 'single'"> </q-th>

        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          <slot :name="`header-${col.name}`" :col="col" :props="props">
            <span v-html="col.label"></span>
          </slot>
        </q-th>
      </q-tr>
    </template>

    <template
      #[`body-cell-${customColumn}`]="props"
      v-for="customColumn in customColumns"
      :key="index"
    >
      <q-td :props="props" class="overflow-wrap">
        <div
          v-if="['action', 'actions'].includes(customColumn)"
          class="actions-table"
        >
          <slot :name="customColumn" :row="props.row" :index="props.rowIndex">
          </slot>
        </div>

        <slot
          v-else
          :name="customColumn"
          :row="props.row"
          :index="props.rowIndex"
        >
        </slot>
      </q-td>
    </template>

    <template #bottom v-if="pages && pages.currentPage != 0">
      <div class="col-12" :class="dense ? '' : 'q-mt-xl'">
        <div class="row items-center q-col-gutter-md q-mx-lg q-mb-lg">
          <div class="col-sm-12 col-md-6">
            <div class="row items-center q-gutter-sm">
              <span>Ver</span>
              <q-select
                outlined
                v-model="rowsPerPage"
                :options="rowsPerPageOptions"
                :dense="true"
                :style="{ width: '80px' }"
                class="custom-outlined-border"
                @update:model-value="emits('updateRowsPerPage', rowsPerPage)"
              />
              <span>Por página</span>
            </div>
          </div>

          <div class="col-sm-12 col-md-6">
            <div class="flex justify-center-sm justify-center-xs justify-end">
              <q-pagination
                class="custom-pagination custom"
                v-model="pages.currentPage"
                color="primary_fiduciaria"
                :max="pages.lastPage"
                :max-pages="5"
                boundary-numbers
                direction-links
                size="md"
                active-design="unelevated"
                icon-prev="mdi-chevron-left"
                icon-next="mdi-chevron-right"
                gutter="sm"
                :active-color="'black'"
                @update:model-value="emits('updatePage', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #top-row>
      <slot name="custom-top-row"></slot>
    </template>

    <template #bottom-row>
      <slot name="custom-bottom-row"></slot>
    </template>

    <template #loading>
      <div class="mt-3" style="z-index: 9999">
        <q-inner-loading
          size="lg"
          class="mt-10 q-pt-lg"
          showing
          color="orange-10"
        />
      </div>
    </template>

    <template v-if="!title" #top>
      <slot name="custom-header"></slot>
    </template>

    <template #top-right>
      <slot name="custom-header-action"></slot>
    </template>

    <template #no-data>
      <slot name="custom-no-data">
        <div class="row justify-center mt-4">
          <div>
            <img src="@/assets/images/icons/no_data.svg" alt="Helion" />
          </div>
        </div>

        <p class="text-weight-bold text-h6 text-center">
          {{ customNoDataMessageTitle }}
        </p>

        <p class="text-weight-light text-h6 text-center">
          {{ customNoDataMessageSubtitle }}
        </p>
      </slot>
    </template>
  </q-table>
</template>

<style lang="scss" src="./TableList.scss" />
