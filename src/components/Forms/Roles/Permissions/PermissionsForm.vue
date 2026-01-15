<script lang="ts" src="./PermissionsForm.ts" />
<template>
  <q-form ref="formData">
    <!-- Title -->
    <section>
      <div class="q-px-lg q-mt-lg q-pb-lg q-mb-sm">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Datos del cargo
        </p>
      </div>
    </section>

    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-4 p-2">
            <label class="text-weight-medium mb-0 text-grey-6">Nombre*</label>
            <q-input
              v-if="props.formType !== 'view'"
              outlined
              v-model="dataForm.name"
              ref="name"
              placeholder="Inserte"
              type="text"
              class="mb-1 mr-4"
              @update:modelValue="handlerValidationInput('name')"
              :rules="
               [
                (value: string) => is_required(value, 'El nombre es obligatorio'),
               ]
              "
              :dense="true"
            >
              <template v-slot:hint> </template>
            </q-input>

            <div v-else>
              <p>
                {{ dataForm.name || 'No registra' }}
              </p>
              <br />
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-8 p-2">
            <label class="text-weight-medium mb-0 text-grey-6"
              >Descripción*</label
            >
            <q-input
              v-if="props.formType !== 'view'"
              outlined
              v-model="dataForm.description"
              ref="description"
              placeholder="Inserte"
              type="text"
              class="mb-1 mr-4"
              @update:modelValue="handlerValidationInput('description')"
              :rules="
               [
                (value: string) => is_required(value, 'La descripción es obligatoria'),
               ]
              "
              :dense="true"
            >
            </q-input>

            <div v-else>
              <p>
                {{ dataForm.description || 'No registra' }}
              </p>
              <br />
            </div>
          </div>
        </div>

        <q-separator />
      </div>
    </section>

    <section>
      <div class="q-px-lg q-mt-lg q-pb-lg q-mb-sm">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Permisos del rol
        </p>
      </div>
    </section>

    <!-- Permissions Filter: -->
    <section class="q-mb-xl q-px-sm q-pb-sm q-mx-lg">
      <FiltersComponent
        @filter="filterPermissionList"
        @clear-filters="clearFilters"
      />
    </section>
    <!-- Permissions List: -->
    <section class="q-my-xl q-mx-lg q-pa-sm">
      <TableList
        :title="tableProperties.title"
        :loading="tableProperties.loading"
        :rows="tableProperties.rows"
        :columns="tableProperties.columns"
        :pages="tableProperties.pages"
        :rowsPerPageOptions="[500, 1000, 2000]"
        :custom-columns="['status', 'actions']"
        @update-page="updatePage"
      >
        <template v-if="props.formType !== 'view'" #custom-header-action>
          <q-btn
            no-caps
            unelevated
            outline
            class="btn-table__allow"
            label="Permitir todos"
            dense
            @click="allowDisallowAllPermissions(1)"
          />
          <q-btn
            no-caps
            unelevated
            class="btn-table__disallow"
            label="Remover todos"
            text-color="white"
            dense
            @click="allowDisallowAllPermissions(2)"
          />
        </template>

        <template #status="{ row }">
          <Badge
            v-if="row.status_id === 1"
            text="Permitido"
            :icon="defaultIconsLucide.checkCircle"
            color-bg="#ffeee3"
            color-icon="#e25d0f"
          />

          <Badge
            v-if="row.status_id === 2"
            text="No permitido"
            :icon="defaultIconsLucide.closeCircle"
            color-bg="#ffeaeb"
            color-icon="#d20008"
          />
        </template>

        <template v-if="props.formType !== 'view'" #actions="{ row }">
          <!-- No permitir -->
          <Button
            v-if="row.status_id === 1"
            :left-icon="defaultIconsLucide.closeCircle"
            :outline="false"
            flat
            label=""
            tooltip="No permitir"
            color="orange"
            colorIcon="#f45100"
            class="text-capitalize btn-filter custom"
            @click="updateStatus(row.id, 2)"
          />

          <!-- Permitir -->
          <Button
            v-if="row.status_id === 2"
            :left-icon="defaultIconsLucide.checkCircle"
            :outline="false"
            flat
            label=""
            tooltip="Permitir"
            color="orange"
            colorIcon="#f45100"
            class="text-capitalize btn-filter custom"
            @click="updateStatus(row.id, 1)"
          />

          <!-- Editar -->
          <Button
            :disabled="row.status_id === 2"
            :left-icon="
              props.formType == 'view'
                ? defaultIconsLucide.eye
                : defaultIconsLucide.edit
            "
            :outline="false"
            flat
            label=""
            tooltip="Editar"
            color="orange"
            colorIcon="#f45100"
            class="text-capitalize btn-filter custom"
            @click="openAlertModal(row)"
          />
        </template>
      </TableList>
      <q-separator />
    </section>
    <!-- Submit Button -->
    <section>
      <div class="q-px-xl q-mt-md q-mb-lg">
        <div class="row justify-end">
          <Button
            :outline="false"
            :label="btnLabel"
            :icon-right="btnIcon ? btnIcon : undefined"
            color-icon="white"
            color="orange"
            class="custom"
            :styleContent="{
              'place-items': 'center',
              'border-radius': '20px',
              'font-size': '13px',
            }"
            @click="handleClickButton"
          />
        </div>
      </div>
    </section>

    <!-- Modal -->
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 80%"
      title=""
      :description_message="''"
      :type_form="props.formType"
      @confirm="applyChildPermissionChanges"
    >
      <template #default-body>
        <p class="text-center text-h5 mb-4">
          Permisos especificos de
          <strong> {{ models_modal_permission_managment.description }}</strong>
        </p>
        <q-form
          ref="formModalRef"
          class="row justify-center items-center text-center q-pt-lg q-mx-xl"
        >
          <div
            v-for="(children, i) in models_modal_permission_managment.children"
            class="col-xs-12 col-sm-6 col-md-3 col-lg-3"
          >
            <q-checkbox
              v-model="children.isChecked"
              :label="translateLabel(children.name)"
              :key="i"
              color="orange"
              :disable="props.formType == 'view'"
              class="q-mb-md"
            >
            </q-checkbox>
          </div>
        </q-form>
      </template>
    </AlertModalComponent>
  </q-form>
</template>

<style lang="scss" src="./PermissionsForm.scss" />
