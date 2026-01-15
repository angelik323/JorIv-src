<template>
  <q-form ref="formInformation" class="row q-col-gutter-md">
    <div class="col-12 col-xs-4 col-md-4">
      <GenericSelectorComponent
        v-if="props.action !== 'view'"
        :default_value="models.business_trust_id"
        :label="'Negocio fiduciario asociado'"
        map_options
        :manual_option="business_inmobiliary"
        :readonly="'edit'.includes(props.action)"
        :rules="[
          (v: string) =>
            useRules().is_required(v, 'El negocio fiduciario es requerido'),
        ]"
        required
        @update:modelValue="models.business_trust_id = $event"
      />

      <div v-else class="text-black-90">
        <p class="text-weight-bold no-margin">Negocio fiduciario asociado</p>
        <p class="text-weight-medium no-margin">
          {{ models.business_trust?.name }}
        </p>
      </div>
    </div>

    <div
      class="col-12 col-xs-4 col-md-4"
      v-if="!'create'.includes(props.action)"
    >
      <GenericInputComponent
        v-if="props.action !== 'view'"
        :default_value="models.id"
        label="ID del proyecto"
        :type="'text'"
        disabled
      />

      <div v-else class="text-black-90">
        <p class="text-weight-bold no-margin">ID del proyecto</p>
        <p class="text-weight-medium no-margin">{{ models.id }}</p>
      </div>
    </div>

    <div class="col-12 col-xs-4 col-md-4">
      <GenericInputComponent
        v-if="props.action !== 'view'"
        :default_value="models.project_name"
        label="Nombre del proyecto*"
        :type="'text'"
        :rules="[
          (v: string) =>
            useRules().is_required(v, 'El nombre del proyecto es requerido'),
        ]"
        :readonly="
          !(
            props.action === 'create' ||
            String(models.status?.id ?? models.status_id) === '78'
          )
        "
        @update:modelValue="models.project_name = $event"
      />

      <div v-else class="text-black-90">
        <p class="text-weight-bold no-margin">Nombre del proyecto</p>
        <p class="text-weight-medium no-margin">{{ models.project_name }}</p>
      </div>
    </div>

    <div class="col-12 col-xs-4 col-md-4">
      <GenericSelectorComponent
        v-if="props.action !== 'view'"
        :default_value="models.project_type"
        label="Tipo de proyecto"
        map_options
        :manual_option="project_type"
        :rules="[
          (v: string) =>
            useRules().is_required(v, 'El tipo de proyecto es requerido'),
        ]"
        :readonly="['edit', 'view'].includes(props.action)"
        required
        @update:modelValue="models.project_type = $event"
      />

      <div v-else class="text-black-90">
        <p class="text-weight-bold no-margin">Tipo de proyecto</p>
        <p class="text-weight-medium no-margin">{{ models.project_type }}</p>
      </div>
    </div>

    <div class="col-12 col-xs-4 col-md-4">
      <GenericSelectorComponent
        v-if="['edit'].includes(props.action)"
        :default_value="models.status_id"
        label="Estado del proyecto"
        map_options
        :manual_option="project_status"
        :rules="[
          (v: string) =>
            useRules().is_required(v, 'El estado del proyecto es requerido'),
        ]"
        :readonly="['view'].includes(props.action)"
        required
        @update:modelValue="models.status_id = $event"
      />

      <div v-if="props.action === 'view'" class="text-black-90">
        <p class="text-weight-bold no-margin">Estado del proyecto</p>
        <ShowStatus :type="Number(models.status_id ?? 1)" />
      </div>
    </div>

    <div class="col-12">
      <GenericInputComponent
        :default_value="models.description"
        label="Descripcion general del proyecto*"
        :type="'textarea'"
        :rules="[
          (v: string) =>
            useRules().is_required(
              v,
              'La descripcion general del proyecto es requerida'
            ),
          (v: string) => useRules().max_length(v, 500),
        ]"
        :readonly="!'create'.includes(props.action)"
        @update:modelValue="models.description = $event"
      />
    </div>

    <div class="col-12 col-xs-9 col-md-9">
      <GenericInputComponent
        v-if="['create', 'edit'].includes(props.action)"
        :default_value="models.num_stages"
        label="N° de etapas"
        :required="true"
        :type="'text'"
        :rules="[
          (v: string) =>
            useRules().is_required(v, 'El numero de etapa es requerido'),
          (v: string) => useRules().only_number(v),
          (v: string) => useRules().max_length(v, 3),
          (v: string) => useRules().only_positive_number(v),
        ]"
        :readonly="props.action === 'edit' || isClick"
        @update:modelValue="models.num_stages = $event"
      />

      <div v-else class="text-black-90">
        <p class="text-weight-bold no-margin">N° de etapas</p>
        <p class="text-weight-medium no-margin">{{ models.num_stages }}</p>
      </div>
    </div>

    <div class="col-12 col-xs-3 col-md-3 flex items-center justify-right">
      <Button
        v-if="props.action === 'create'"
        size="md"
        unelevated
        color="primary_fiduciaria"
        class="text-capitalize btn-filter custom"
        :left-icon="defaultIconsLucide.plusCircleOutline"
        :label="'Agregar'"
        :class-custom="'custom'"
        :outline="false"
        :colorIcon="'#ffffff'"
        :tooltip="'Agregar'"
        :disabled="!isValid"
        @click="emitData"
      />
    </div>
  </q-form>

  <q-separator class="q-mt-sm" />

  <section class="q-mt-xl" v-if="addedRows">
    <TableList
      :title="tableProps.title"
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :custom-columns="['status_id', 'actions', 'total_value']"
      @update-page="updateProcessedPage"
      @update-rows-per-page="updateProcessedPerPage"
    >
      <template #total_value="{ row }">
        <p class="text-weight-medium no-margin">
          {{ useUtils().formatCurrency(`${row.total_value}`) }}
        </p>
      </template>

      <template #status_id="{ row }">
        <ShowStatus :type="Number(row?.status_id ?? 1)" />
      </template>

      <template #actions="{ row }">
        <!-- Gestionar -->
        <Button
          v-if="!['view', 'edit'].includes(props.action)"
          :left-icon="defaultIconsLucide.plusCircleOutline"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Gestionar'"
          @click="openAlertModalStage(row.id, row.stage_number, 'create')"
        />

        <!-- Editar -->
        <Button
          v-if="['edit'].includes(props.action)"
          :left-icon="defaultIconsLucide.edit"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Editar'"
          :disabled="String(models.status?.id ?? models.status_id) !== '78'"
          @click="openAlertModalStage(row.id, row.stage_number, 'edit')"
        />

        <!-- Ver -->
        <Button
          v-if="['view'].includes(props.action)"
          :left-icon="defaultIconsLucide.eye"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Ver'"
          @click="openAlertModalStage(row.id, row.stage_number, 'view')"
        />

        <!-- Eliminar -->
        <Button
          v-if="
            !['view', 'edit'].includes(props.action) && row.status_id === 82
          "
          :left-icon="defaultIconsLucide.trash"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Eliminar'"
          @click="openAlertModal('eliminar', row.stage_number)"
        />
      </template>
    </TableList>
  </section>

  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 480px"
    title="¿Desea eliminar la etapa del proyecto?"
    @confirm="deleteRealStateProject"
  >
  </AlertModalComponent>

  <AlertModalComponent
    ref="alertModalStageRef"
    :title="alertModalConfigStage.title ?? ''"
    :description_message="''"
    :show-btn-cancel="true"
    :show-close-btn="true"
    :show-img-default="false"
    :show-btn-confirm="true"
    :textBtnConfirm="
      props.action === 'create'
        ? 'Guardar'
        : props.action === 'edit'
        ? 'Actualizar'
        : 'Finalizar'
    "
    :disableConfirm="!isValid"
    styleModal="min-width: 90%; margin-top: 0px"
    margin-top-body="mt-0"
    title-margin="mt-0"
    @confirm="onSubmit"
  >
    <template #default-body>
      <div class="q-mx-xl">
        <PropertyFeaturesForm
          :action="actionModal"
          ref="formPropertyFeatures"
          :data="alertModalConfigStage.stage ?? undefined"
          :business_trust_id="models.business_trust_id ?? 0"
          :stage_number="alertModalConfigStage.stage?.stage_number"
        />
      </div>
    </template>
  </AlertModalComponent>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IRealStateProject
  }>(),
  {}
)
// Emits
const emits = defineEmits(['stages', 'update:models', 'validateForm'])

import { IRealStateProject } from '@/interfaces/customs'

// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import PropertyFeaturesForm from './PropertyFeaturesForm/PropertyFeaturesForm.vue'

// Composables
import { useRules } from '@/composables'

// Types
import { ActionType } from '@/interfaces/global'

// utils
import { useUtils } from '@/composables'
const defaultIconsLucide = useUtils().defaultIconsLucide

// Logic
import useRealStateProjectInformationForm from './InformationForm'

const {
  models,
  isValid,
  addedRows,
  business_inmobiliary,
  project_type,
  formInformation,
  tableProps,
  alertModalRef,
  alertModalStageRef,
  alertModalConfigStage,
  formPropertyFeatures,
  project_status,
  actionModal,
  isClick,
  onSubmit,
  openAlertModal,
  openAlertModalStage,
  deleteRealStateProject,
  updateProcessedPage,
  updateProcessedPerPage,
  emitData,
} = useRealStateProjectInformationForm(props, emits)

defineExpose({
  validateForm: () =>
    formInformation.value?.validate() ||
    props.action !== 'create' ||
    !tableProps.value.rows.some((item) => item.status_id === 82),
})
</script>
