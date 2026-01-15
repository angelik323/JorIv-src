<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <template #addBefore>
        <div v-if="validateRouter('Clients', 'ClientsList', 'create')">
          <Button
            :left-icon="defaultIconsLucide.plusCircleOutline"
            label="Crear"
            color="white"
            color-icon="white"
            :outline="false"
            :dropdown-options="optionsClient"
            :dropdown-grouped="true"
          />
        </div>
      </template>

      <section class="q-mt-md">
        <FiltersComponent
          @filter="handleFilter"
          :fields="filterConfig"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRows"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status?.id ?? 1)" />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="validateRouter('Clients', 'ClientsList', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="goToView('view', row)"
            />

            <!-- Editar -->
            <Button
              v-if="validateRouter('Clients', 'ClientsList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToView('edit', row)"
            />

            <!-- Cambio de estado -->
            <Button
              v-if="validateRouter('Clients', 'ClientsList', 'edit')"
              :left-icon="defaultIconsLucide.ArrowLeftRight"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Cambiar estado"
              @click="openAlertModal('activar', row.id)"
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          title="Gestionar estado del cliente"
          description_message="Modifica el estado del cliente para reflejar su situación actual. Asegúrate de guardar los cambios realizados."
          @confirm="changeStatusAction"
        >
          <template #default-body>
            <q-form ref="formModalRef" class="row q-mt-md q-mx-xl">
              <div class="col-12">
                <GenericSelectorComponent
                  label="Estado"
                  :manual_option="customer_status"
                  :map_options="true"
                  :required="true"
                  :default_value="modelModalClient.status"
                  :rules="[(val: string) => !!val || 'El estado es requerido']"
                  @update:model-value="modelModalClient.status = $event"
                />
              </div>
              <div v-if="modelModalClient.status == 51" class="col-12">
                <GenericInput
                  label="Motivo"
                  :default_value="modelModalClient.reason"
                  required
                  :rules="[
                    (v: string) => !!v || 'El motivo es requerido',
                    (v: string) => /^[a-zA-Z0-9À-ÿ&` ]*$/.test(v) || 'No se permiten caracteres especiales',
                    (v: string) =>
                      v.length <= 500 || 'Debe contener como máximo 500 caracteres',
                  ]"
                  @update:model-value="modelModalClient.reason = $event"
                />
              </div>
            </q-form>
          </template>
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components:
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Logic view
import useClientList from '@/views/clients/v1/list/ClientList'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  // Props
  headerProps,
  tableProps,
  optionsClient,
  alertModalRef,
  customer_status,
  modelModalClient,
  formModalRef,
  filterConfig,

  // Methods
  handleClear,
  handleFilter,
  openAlertModal,
  changeStatusAction,
  updatePage,
  updateRows,
  validateRouter,
  goToView,
} = useClientList()
</script>
