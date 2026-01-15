<template>
  <q-form ref="flowStatesChildFormRef" class="q-pa-lg">
    <section>
      <div class="row q-mb-lg">
        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="flowType"
            placeholder="Seleccione tipo de flujo"
            :manual_option="contract_type_status_flow_type"
            auto_complete
            map_options
            required
            label="Tipo flujo"
            :rules="[ (val: string) =>
              useRules().is_required(val, 'El tipo de flujo es requerido'),
            ]"
            @update:modelValue="handleFlowTypeChange($event)"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo flujo</p>
            <p class="text-weight-medium no-margin">
              {{
                contract_type_status_flow_type.find(
                  (item) => item.value === flowType
                )?.label ?? 'No registrado'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="flex justify-between items-start q-mb-md">
        <p class="text-weight-bold text-h6 no-margin">
          {{ tablePropertiesStatusParent.title }}
        </p>

        <Button
          v-if="
            flowType !== TypesContractingDocumentStatusFlowTypeID.PREDEFINED &&
            !['view'].includes(action) &&
            flowType
          "
          no-caps
          unelevated
          label="Agregar"
          :left-icon="defaultIconsLucide.plusCircleOutline"
          color-icon="white"
          text-color="white"
          :outline="false"
          color="primary"
          @click="handleAddRowStatus"
        />
      </div>

      <div class="q-pa-lg">
        <TableList
          :loading="tablePropertiesStatusParent.loading"
          :rows="tablePropertiesStatusParent.rows"
          :columns="tablePropertiesStatusParent.columns"
          :custom-columns="['order_parent', 'status_parent_id', 'actions']"
          :hide-pagination="true"
        >
          <template #order_parent="{ row }">
            <GenericInputComponent
              :disabled="
                flowType ===
                  TypesContractingDocumentStatusFlowTypeID.PREDEFINED ||
                ['view'].includes(action)
              "
              :default_value="row.order_parent"
              placeholder="-"
              type="number"
              max_length="2"
              required
              :rules="[
                (val: string) => useRules().is_required(val, 'El orden es requerido'),
                (val: string) => useRules().min_length(val, 1),
                (val: string) => useRules().max_length(val, 9),
              ]"
              @update:modelValue="handleOrderChange(row.id, $event)"
            />
          </template>

          <template #status_parent_id="{ row }">
            <GenericSelectorComponent
              :disabled="
                flowType ===
                  TypesContractingDocumentStatusFlowTypeID.PREDEFINED ||
                ['view'].includes(action)
              "
              :default_value="row.status_parent_id"
              placeholder="Seleccione"
              :manual_option="contract_type_status_statuses_substatuses"
              auto_complete
              map_options
              required
              :rules="[(val: string) => useRules().is_required(val, 'El estado es requerido')]"
              @update:modelValue="handleStatusChange(row.id, $event)"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                flowType !==
                  TypesContractingDocumentStatusFlowTypeID.PREDEFINED &&
                !['view'].includes(action)
              "
              flat
              :outline="false"
              :left-icon="defaultIconsLucide.trash"
              color-icon="#f45100"
              :class-custom="'custom'"
              tooltip="Eliminar"
              @click="handleDeleteRow(row.id)"
            />
          </template>
        </TableList>
      </div>

      <q-separator class="q-my-md" />

      <section
        v-if="
          tabs.length > 0 &&
          flowType === TypesContractingDocumentStatusFlowTypeID.PERSONALIZED
        "
      >
        <p class="text-weight-bold text-h6 q-mb-md">
          {{ 'Matriz de transición de estados' }}
        </p>

        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="activeTabIndex"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="activeTabIndex = $event"
        />

        <div class="flex justify-between items-start q-mb-md">
          <p class="text-weight-bold text-h6 no-margin">
            {{ tablePropertiesStatusChildCurrent.title }}
          </p>

          <Button
            v-if="!['view'].includes(action) && activeTab"
            no-caps
            unelevated
            label="Agregar"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            color-icon="white"
            text-color="white"
            :outline="false"
            color="primary"
            @click="handleAddRowStatusChild"
          />
        </div>

        <div class="q-pa-lg">
          <TableList
            :loading="tablePropertiesStatusChildCurrent?.loading || false"
            :rows="tablePropertiesStatusChildCurrent?.rows || []"
            :columns="tablePropertiesStatusChildCurrent?.columns || []"
            :custom-columns="['order_child', 'status_child_id', 'actions']"
            :hide-pagination="true"
          >
            <template #order_child="{ row }">
              <GenericInputComponent
                v-if="statusChildOptions.length > 0"
                :disabled="['view'].includes(action)"
                :default_value="row.order_child"
                placeholder="00"
                type="number"
                max_length="2"
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El orden es requerido'),
                  (val: string) => useRules().min_length(val, 1),
                  (val: string) => useRules().max_length(val, 9),
                ]"
                @update:modelValue="handleOrderChangeChild(row.id, $event)"
              />
            </template>

            <template #status_child_id="{ row }">
              <GenericSelectorComponent
                v-if="statusChildOptions.length > 0"
                :disabled="['view'].includes(action)"
                :default_value="row.status_child_id"
                placeholder="Seleccione estado"
                :manual_option="statusChildOptions"
                auto_complete
                map_options
                required
                :rules="[(val: string) => useRules().is_required(val, 'El estado es requerido')]"
                @update:modelValue="handleStatusChangeChild(row.id, $event)"
              />
            </template>

            <template #actions="{ row }">
              <Button
                v-if="!['view'].includes(action)"
                flat
                :outline="false"
                :left-icon="defaultIconsLucide.trash"
                color-icon="#f45100"
                :class-custom="'custom'"
                tooltip="Eliminar"
                @click="handleDeleteRowChild(row.id)"
              />
            </template>
          </TableList>
        </div>
      </section>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic form
import useFlowStatesForm from '@/components/Forms/DerivativeContracting/TypesContractingDocuments/FlowStates/FlowStatesForm'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { ITypesContractingDocumentsFlowStatesForm } from '@/interfaces/customs'

const emit = defineEmits<{
  (e: 'update:flow-states-form'): void
  (e: 'update:flow-states-type'): void
}>()

const props = withDefaults(
  defineProps<{
    action: ActionType
    flowStatesForm: ITypesContractingDocumentsFlowStatesForm | null
  }>(),
  {}
)

const {
  TypesContractingDocumentStatusFlowTypeID,
  defaultIconsLucide,
  flowStatesChildFormRef,
  flowType,
  tablePropertiesStatusParent,
  tablePropertiesStatusChildCurrent,
  statusChildOptions,
  tabs,
  activeTab,
  activeTabIndex,

  contract_type_status_flow_type,
  contract_type_status_statuses_substatuses,

  handleFlowTypeChange,
  handleAddRowStatus,
  handleStatusChange,
  handleOrderChange,
  handleDeleteRow,
  handleAddRowStatusChild,
  handleStatusChangeChild,
  handleOrderChangeChild,
  handleDeleteRowChild,
} = useFlowStatesForm(props, emit)

defineExpose({
  validateForm: () => flowStatesChildFormRef.value?.validate(),
})
</script>
