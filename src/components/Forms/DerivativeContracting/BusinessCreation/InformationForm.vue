<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericSelectorComponent
            label="Negocio"
            :default_value="models.business_trusts"
            :manual_option="business_trusts_derivate_contracting"
            map_options
            :required="false"
            :rules="[]"
            return_object
            @update:modelValue="models.business_trusts = $event"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            label="Estado"
            :required="false"
            :default_value="statusDisplay"
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            label="Tipo"
            :required="false"
            :default_value="typeDisplay"
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <GenericInput
            label="Subtipo"
            :required="false"
            :default_value="subTypeDisplay"
            disabled
            :rules="[]"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-medium mb-0 ellipsis text-grey-6">
            Maneja presupuesto?
          </p>

          <RadioYesNo
            v-model="models.manage_budget"
            :isRadioButton="true"
            :hasTitle="false"
            label="Maneja presupuesto?"
            :hasSubtitle="false"
            :isDisabled="false"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-medium mb-0 ellipsis text-grey-6">
            Manejo de proyectos?
          </p>

          <RadioYesNo
            v-model="models.manage_proyects"
            :isRadioButton="true"
            :hasTitle="false"
            label="Manejo de proyectos?"
            :hasSubtitle="false"
            :isDisabled="false"
          />
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <p class="text-weight-medium mb-0 ellipsis text-grey-6">
            Maneja estructura de obras?
          </p>

          <RadioYesNo
            v-model="models.manage_works_structures"
            :isRadioButton="true"
            :hasTitle="false"
            label="Maneja estructura de obras?"
            :hasSubtitle="false"
            :isDisabled="false"
          />
        </div>
      </div>
    </section>
    <br />
    <br />

    <section v-if="models.manage_works_structures">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['actions', 'plan']"
      >
        <template #custom-header-action>
          <Button
            :outline="false"
            label="Agregar"
            left-icon="PlusCircle"
            color-icon="white"
            tooltip="Agregar"
            @click="addPlanFromTable()"
          />
        </template>

        <template #plan="{ row }">
          <GenericSelectorComponent
            :default_value="row.plan"
            :manual_option="work_plan"
            map_options
            :required="false"
            :rules="[]"
            @update:modelValue="row.plan = $event"
          />
        </template>

        <template #actions="{ row }">
          <Button
            :left-icon="defaultIconsLucide.delete"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="removePlanFromTable(row.index)"
          />
        </template>
      </TableList>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
// Components
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Logic form
import useBasicDataForm from '@/components/Forms/DerivativeContracting/BusinessCreation/InformationForm'

// Composables & utils
import { defaultIconsLucide } from '@/utils'

// Interfaces
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'

const {
  models,
  formElementRef,

  tableProps,

  statusDisplay,
  typeDisplay,
  subTypeDisplay,
  business_trusts_derivate_contracting,
  work_plan,

  removePlanFromTable,
  addPlanFromTable,
  getFormData,
  resetForm,
} = useBasicDataForm()

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
  getFormData,
  resetForm,
})
</script>
