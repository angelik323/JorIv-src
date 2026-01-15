<script lang="ts" src="./ThirdPartiesList.ts" />

<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      @to="handlerGoTo('ThirdPartiesCreate')"
    >
      <template #addBefore>
        <div
          v-if="validateRouter('ThirdParty', 'ThirdPartiesList', 'create')"
          class="row q-gutter-sm"
        >
          <Button
            :left-icon="defaultIconsLucide.plusCircleOutline"
            label="Crear"
            color="white"
            color-icon="white"
            :outline="false"
            :dropdown-options="optionsThird"
            @select="gotoCreate($event.type)"
          />
        </div>
      </template>

      <FiltersComponent
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <div class="q-pt-md q-my-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="customColumns"
          @update-page="updatePage"
          @updateRowsPerPage="updateRows"
        >
          <!-- Status warehouse -->
          <template #status_id="{ row }">
            <ShowStatus :type="row.status.id" class-custom="q-px-sm q-py-xs" />
          </template>

          <!-- Actions -->
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="validateRouter('ThirdParty', 'ThirdPartiesList', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handleOptions('view', row.id)"
            />

            <!-- Editar -->
            <Button
              v-if="
                validateRouter('ThirdParty', 'ThirdPartiesList', 'edit') &&
                !row?.is_fideicomiso
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />

            <!-- Activar -->
            <Button
              v-if="
                row.status.id == 2 &&
                validateRouter('ThirdParty', 'ThirdPartiesList', 'edit') &&
                !row?.is_fideicomiso
              "
              :left-icon="defaultIconsLucide.ArrowLeftRight"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Cambiar estado"
              @click="openAlertModal('activar', row.id)"
            />

            <!-- Inactivar -->
            <Button
              v-if="
                row.status.id == 1 &&
                validateRouter('ThirdParty', 'ThirdPartiesList', 'edit') &&
                !row?.is_fideicomiso
              "
              :left-icon="defaultIconsLucide.ArrowLeftRight"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Cambiar estado"
              @click="openAlertModal('inactivar', row.id)"
            />
          </template>
        </TableList>
      </div>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :title="alertModalConfig.title"
        :description_message="alertModalConfig.description"
        @confirm="changeStatus()"
      />
    </ContentComponent>
  </div>
</template>

<style lang="scss">
.thirdy-party-list-actions {
  .q-icon.q-btn-dropdown__arrow.q-btn-dropdown__arrow-container {
    display: none !important;
  }
}
</style>
