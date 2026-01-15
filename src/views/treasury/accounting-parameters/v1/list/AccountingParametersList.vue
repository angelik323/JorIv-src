<template>
  <div class="q-mx-xl">
    <q-expansion-item
      :model-value="isOpenExpansionItem"
      class="q-mb-md expansion-item-fp"
      expand-icon-class="text-black expansion-icon"
    >
      <template v-slot:header>
        <q-item-section>
          <div class="column">
            <span class="text-h6 text-weight-bold">
              Parámetros contables de comisiones
            </span>
            <span class="text-subtitle1 text-grey-14">
              Haz click sobre Parámetros contables para desplegar la tabla
            </span>
          </div>
        </q-item-section>
        <q-item-section side>
          <div class="flex justify-between">
            <Button
              v-if="validateRouter('Treasury', 'CollectionAccountingBlocksList', 'create')"
              :left-icon="defaultIconsLucide.plusCircleOutline"
              :outline="false"
              color="white"
              color-icon="white"
              label="Crear"
              :tooltip="
                !props.selectedIds[0] || tableProps.rows.length > 0
                  ? 'Selecciona un bloque contable que no tenga parámetros contables'
                  : 'Crear nuevo parámetro contable'
              "
              :stop-propagation="true"
              @click="$router.push({ name: 'AccountingParametersCreate' })"
              :disabled="!props.selectedIds[0] || tableProps.rows.length > 0"
              class="q-mr-sm"
            />
            <Button
              v-if="validateRouter('Treasury', 'CollectionAccountingBlocksList', 'edit')"
              :outline="true"
              :label="'Editar '"
              color="orange"
              :class-custom="'custom'"
              color-icon="black"
              :disabled="!props.selectedIds[0]"
              :style-content="'color: #000000;'"
              :left-icon="'mdi-plus-circle-outline'"
              @click="
                $router.push({
                  name: 'AccountingParametersEdit',
                  params: { id: refIdEdit },
                })
              "
            />
          </div>
        </q-item-section>
      </template>

      <TableList
        :loading="tableProps.loading"
        :rows="tableProps.rows"
        :custom-columns="['status', 'actions']"
        :columns="tableProps.columns"
      >
        <template #actions="{ row }">
          <!-- Editar -->
          <Button
            v-if="row.id && validateRouter('Treasury', 'CollectionAccountingBlocksList', 'edit')"
            :left-icon="'mdi-plus-circle-outline'"
            color="orange"
            :class-custom="'custom'"
            :outline="true"
            :flat="true"
            color-icon="black"
            :style-content="'color: #000000;'"
            :tooltip="'Editar'"
            @click="
              $router.push({
                name: 'AccountingParametersEdit',
                params: { id: row.id },
              })
            "
          />
        </template>
      </TableList>
    </q-expansion-item>

    <q-expansion-item
      :model-value="isOpenExpansionItem"
      class="q-mb-md expansion-item-fp"
      expand-icon-class="text-black expansion-icon"
    >
      <template v-slot:header>
        <q-item-section>
          <div class="column">
            <span class="text-h6 text-weight-bold">
              {{ subTableProps.title }}
            </span>
            <span class="text-subtitle1 text-grey-14">
              Haz click sobre Contrapartida contable para desplegar la tabla
            </span>
          </div>
        </q-item-section>
      </template>

      <TableList
        :loading="subTableProps.loading"
        :rows="subTableProps.rows"
        :custom-columns="['status', 'actions']"
        :columns="subTableProps.columns"
      />
    </q-expansion-item>

    <q-expansion-item
      :model-value="isOpenExpansionItem"
      class="q-mb-md expansion-item-fp"
      expand-icon-class="text-black expansion-icon"
    >
      <template v-slot:header>
        <q-item-section>
          <div class="column">
            <span class="text-h6 text-weight-bold">
              {{ thirdTable.title }}
            </span>
            <span class="text-subtitle1 text-grey-14">
              Haz click sobre Presupuesto asociado para desplegar la tabla
            </span>
          </div>
        </q-item-section>
      </template>

      <TableList
        :loading="thirdTable.loading"
        :rows="thirdTable.rows"
        :custom-columns="['status', 'actions']"
        :columns="thirdTable.columns"
      />
    </q-expansion-item>
  </div>
</template>
<script lang="ts" setup>
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import { useAccountingParametersList } from './AccountingParametersList'
import { defaultIconsLucide } from '@/utils'

const props = defineProps<{
  selectedIds: number[]
}>()

const {
  tableProps,
  subTableProps,
  refIdEdit,
  thirdTable,
  isOpenExpansionItem,
  validateRouter
} = useAccountingParametersList(props)
</script>
