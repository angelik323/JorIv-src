<template>
  <div>
    <section class="row q-col-gutter-lg q-px-xl">
      <div class="col-12 col-sm-6 col-md-6">
        <GenericSelectorComponent
          label="Código de cuenta contable"
          placeholder="Seleccione"
          map_options
          auto_complete
          :required="false"
          :default_value="advancedFilters.code_operator"
          :manual_option="type_operators"
          :rules="[]"
          @update:model-value="selectCodeOperator($event)"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-6">
        <GenericInput
          label="Nombre"
          :disabled="!advancedFilters.code_operator"
          :required="false"
          placeholder="-"
          :default_value="advancedFilters.code_value"
          @update:model-value="advancedFilters.code_value = $event"
          :rules="[]"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-6">
        <GenericSelectorComponent
          label="Nombre de cuenta contable"
          placeholder="Seleccione"
          map_options
          auto_complete
          :required="false"
          :default_value="advancedFilters.name_operator"
          :manual_option="type_operators"
          :rules="[]"
          @update:model-value="selectNameOperator($event)"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-6">
        <GenericInput
          label="Nombre"
          :disabled="!advancedFilters.name_operator"
          :required="false"
          placeholder="-"
          :default_value="advancedFilters.name_value"
          @update:model-value="advancedFilters.name_value = $event"
          :rules="[]"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-6">
        <GenericSelectorComponent
          label="Naturaleza"
          placeholder="Seleccione"
          map_options
          auto_complete
          :required="false"
          :default_value="advancedFilters.nature"
          :manual_option="type_nature"
          :rules="[]"
          @update:model-value="advancedFilters.nature = $event"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-6">
        <GenericSelectorComponent
          label="Tipo"
          placeholder="Seleccione"
          map_options
          auto_complete
          :required="false"
          :default_value="advancedFilters.type"
          :manual_option="catalog_limit_types"
          :rules="[]"
          @update:model-value="selectType($event)"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-6">
        <GenericSelectorComponent
          label="Grupo"
          placeholder="Seleccione"
          map_options
          auto_complete
          :required="false"
          :default_value="advancedFilters.group"
          :manual_option="groupOptions"
          :rules="[]"
          @update:model-value="advancedFilters.group = $event"
        />
      </div>
    </section>
    <q-separator class="q-mx-xl q-mt-lg" />
  </div>
</template>
<script setup lang="ts">
// Components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Logic
import useAdvancedFilters from '@/components/Forms/Accounting/ChartAccounts/information/v2/AdvancedFilters'

const {
  advancedFilters,
  type_operators,
  type_nature,
  catalog_limit_types,
  groupOptions,
  selectType,
  selectCodeOperator,
  selectNameOperator,
} = useAdvancedFilters()

defineExpose({
  getFilters: () => advancedFilters.value,
})
</script>
