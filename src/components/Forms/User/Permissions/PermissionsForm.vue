<script lang="ts" setup>
import { defaultIcons } from '@/utils'
// Logic
import { usePermissionsForm } from '@/components/Forms/User/Permissions/PermissionsForm'
// Components:
import FiltersComponent from '@/components/common/Filters/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import BannerListComponent from '@/components/common/BannerList/BannerListComponent.vue'

// Props
const props = defineProps({
  formType: {
    type: String,
    required: true,
  },
  showBtn: {
    type: Boolean,
    required: false,
    default: false,
  },
  btnLabel: {
    type: String,
    required: false,
    default: 'Continuar',
  },
  btnIcon: {
    type: String,
    required: false,
    default: defaultIcons.next,
  },
  showBackBtn: {
    type: Boolean,
    required: false,
    defaulte: false,
  },
  btnBackLabel: {
    type: String,
    required: false,
    default: 'Atrás',
  },
  btnBackIcon: {
    type: String,
    required: false,
    default: defaultIcons.back,
  },
})

// Handle emits to view:
const emit = defineEmits(['onContinue', 'onBack'])

const {
  tableProperties,
  bannerProps,
  handleClickButton,
  filterPermissionList,
  clearFilters,
  updateStatus,
  allowDisallowAllPermissions,
} = usePermissionsForm(props, emit)
</script>
<template>
  <q-form @submit.prevent="handleClickButton">
    <!-- Title -->
    <section v-if="props.formType === 'update'">
      <div class="q-px-lg q-pt-sm q-mr-lg q-pb-sm">
        <div class="row items-center justify-between">
          <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
            <p class="text-black-10 text-weight-bold text-h6 mb-0">
              Permisos del usuario
            </p>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-7 col-lg-4">
            <div class="row justify-end">
              <div class="col-xs-12 col-sm-12 col-md-11">
                <BannerListComponent :message="bannerProps.message" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="props.formType === 'create'">
      <div class="q-px-lg q-mt-lg q-pb-lg q-mb-sm">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Permisos del usuario
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
        :rows-per-page-options="tableProperties.rowsLength"
        :hide-bottom="tableProperties.hiddeQta"
        :custom-columns="['status', 'actions']"
      >
        <template #custom-header-action>
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
          <q-badge
            v-if="row.status_id === 1"
            class="justify-center"
            style="
              background: #e7ffe4;
              color: #333742;
              width: 8em !important;
              height: 2em !important;
              border-radius: 200px;
              justify-content: space-around;
            "
          >
            Permitido
            <q-icon
              :name="defaultIcons?.checkCircle"
              style="color: #39ba2e"
              class="pl-1"
              size="xs"
            />
          </q-badge>
          <q-badge
            v-if="row.status_id === 2"
            class="justify-center"
            style="
              background: #ffeaeb;
              color: #333742;
              width: 8em !important;
              height: 2em !important;
              border-radius: 200px;
              justify-content: space-around;
            "
          >
            No permitido
            <q-icon
              :name="defaultIcons?.closeCircle"
              style="color: #d20008"
              class="pl-1"
              size="xs"
            />
          </q-badge>
        </template>

        <template #actions="{ row }">
          <!-- No permitir -->
          <q-btn
            v-if="row.status_id === 1"
            flat
            rounded
            size="14px"
            :icon="defaultIcons.closeCircle"
            style="color: #5d699a"
            @click="updateStatus(row.id, 2)"
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              class="indigo-10"
            >
              <p class="q-ma-none text-body2">No permitir</p>
            </q-tooltip>
          </q-btn>

          <!-- Permitir -->
          <q-btn
            v-if="row.status_id === 2"
            flat
            rounded
            size="14px"
            :icon="defaultIcons.checkCircle"
            style="color: #5d699a"
            @click="updateStatus(row.id, 1)"
          >
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              class="indigo-10"
            >
              <p class="q-ma-none text-body2">Permitir</p>
            </q-tooltip>
          </q-btn>
        </template>
      </TableList>
      <q-separator />
    </section>

    <!-- Submit Button -->
    <section v-if="showBtn === false">
      <div class="q-px-xl q-mt-md q-mb-lg">
        <div class="row justify-end">
          <q-btn
            v-if="showBackBtn"
            no-caps
            unelevated
            outline
            class="text-initial btn-custom-style col-2 q-ma-sm"
            text-color="indigo-10"
            size="md"
            color="white"
            :label="btnBackLabel"
            :style="{ width: '150px', height: '40px' }"
            :icon="btnBackIcon"
            @click="() => emit('onBack', true)"
          />
          <q-btn
            class="text-initial btn__history col-2 q-ma-sm"
            type="submit"
            size="md"
            unelevated
            no-caps
            :label="btnLabel"
            :style="{ width: '150px', height: '50px' }"
            :icon-right="btnIcon"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<style lang="scss" src="./PermissionsForm.scss" />
