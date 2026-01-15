<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      show-back-btn
      :breadcrumbs="headerProps.breadcrumbs"
      @on-back="handleGoToList"
    >
      <div class="q-pt-md q-my-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="visibleRows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.edit"
              colorIcon="#f45100"
              color="orange"
              class-custom="custom"
              :outline="false"
              :flat="true"
              tooltip="Editar"
              @click="openModal(row.id)"
            />
          </template>
        </TableList>
      </div>

      <AlertModalComponent
        ref="editModalRef"
        styleModal="min-width: 500px"
        :showBtnConfirm="false"
        :showBtnCancel="false"
        :showImgDefault="false"
        :showCloseBtn="true"
      >
        <template #default-body>
          <div class="q-mx-lg q-px-lg">
            <div class="flex justify-center q-mb-md">
              <q-img
                :src="questionIcon"
                max-width="80px"
                width="80px"
                fit="contain"
                alt="Imagen de alerta"
              />
            </div>

            <p class="text-weight-bold text-h6 text-center">Editar regla</p>

            <div class="col-12">
              <GenericInputComponent
                :default_value="selectedRow?.process_type_name"
                label="Tipo de proceso"
                placeholder="-"
                disabled
                type="text"
                :rules="[]"
              />
            </div>

            <div class="col-12">
              <GenericInputComponent
                :default_value="selectedRow?.priority"
                label="Prioridad"
                placeholder="Inserte"
                required
                type="text"
                :rules="[]"
                @update:model-value="
                  selectedRow && (selectedRow.priority = $event)
                "
              />
            </div>

            <div class="col-12">
              <GenericInputComponent
                :default_value="selectedRow?.embargability_limit"
                label="Límite de embargabilidad"
                placeholder="Inserte"
                required
                type="text"
                :rules="[]"
                @update:model-value="
                  selectedRow && (selectedRow.embargability_limit = $event)
                "
              />
            </div>

            <div class="col q-mt-md">
              <q-separator />
            </div>
          </div>

          <div class="row q-mt-lg flex justify-center">
            <Button
              label="Cancelar"
              color="orange"
              class="text-capitalize btn-filter custom q-mr-md"
              outline
              @click="closeModal"
            />

            <Button
              label="Actualizar"
              :outline="false"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="onSubmit"
            />
          </div>
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// Components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Assets
import questionIcon from '@/assets/images/icons/alert_popup_question.svg'

// Logic
import useSeizuresParametersList from '@/views/seizures/parameters/v1/list/ParametersList'

const {
  onSubmit,
  openModal,
  closeModal,
  tableProps,
  visibleRows,
  headerProps,
  selectedRow,
  editModalRef,
  defaultIconsLucide,
  handleGoToList,
  handleUpdatePage,
  handleUpdatePerPage,
} = useSeizuresParametersList()
</script>
