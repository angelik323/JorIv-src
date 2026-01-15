<script lang="ts" setup>
import { defaultIcons } from '@/utils'
// Logic:
import { useAdditionalInformationForm } from '@/components/Forms/User/AdditionalInformation/AdditionalInformationForm'
// Components:
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import ViewerFileComponent from '@/components/common/ViewerFile/ViewerFileComponent.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'

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
  showBtnWithoutIcon: {
    type: Boolean,
    required: false,
    default: false,
  },
})

// Handle emits to view:
const emit = defineEmits(['onAction', 'onBack'])

const {
  formValues,
  styleCustomAttachFile,
  attachCvvRef,
  viewerFileComponentRef,
  tableProps,
  banks,
  bank_type,
  relationship_type,
  submit,
  addedFiles,
  rejectedFiles,
  removeFile,
  viewFile,
} = useAdditionalInformationForm(props, emit)
</script>
<template>
  <q-form @submit.prevent="submit">
    <!-- Emergency contact information -->
    <section>
      <div class="q-px-lg q-mt-lg">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Contacto de emergencia (Opcional)
        </p>
        <div class="row">
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <p class="text-grey-6 text-weight-medium mb-0">
              Nombre completo (Opcional)
            </p>
            <q-input
              outlined
              v-model="formValues.emergency_contact_name"
              dense
              type="text"
              placeholder="Ingrese nombre"
              :rules="[
                (v) => !v || v.length >= 2 || 'Debe tener mínimo 2 caracteres',
                (v) =>
                  !v || v.length <= 100 || 'Debe tener máximo 100 caracteres',
                (v) =>
                  !v || /^[a-zA-ZÀ-ÿ ]*$/.test(v) || 'Debe tener solo letras',
                (v) =>
                  !v ||
                  !/\s{2,}/.test(v) ||
                  'No debe contener espacios consecutivos',
              ]"
            />
          </div>
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <p class="text-grey-6 text-weight-medium mb-0">
              Teléfono (Opcional)
            </p>
            <q-input
              outlined
              v-model="formValues.emergency_contact_phone"
              dense
              type="number"
              placeholder="Ingrese teléfono"
              :rules="[
                (v) =>
                  !v || v.length >= 3 || 'Debe de tener mínimo 3 caracteres',
                (v) =>
                  !v || v.length <= 10 || 'Debe tener máximo 10 caracteres',
                (v) =>
                  !v ||
                  /^[a-zA-Z0-9]*$/.test(v) ||
                  'No se permiten caracteres especiales',
                (v) =>
                  !v || !/^-\d/.test(v) || 'No se permiten números negativos',
              ]"
            />
          </div>
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.emergency_contact_relationship"
              :manual_option="relationship_type"
              label="Parentesco (Opcional)"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El parentesco es requerido']"
              @update:modelValue="
                formValues.emergency_contact_relationship = $event
              "
            />
          </div>
        </div>
        <q-separator />
      </div>
    </section>

    <!-- Bank information -->
    <section>
      <div class="q-px-lg q-mt-lg">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Datos financieros (Opcional)
        </p>
        <div class="row">
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.bank_id"
              :manual_option="banks"
              label="Banco (Opcional)"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El banco es requerido']"
              @update:modelValue="formValues.bank_id = $event"
            />
          </div>
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <p class="text-grey-6 text-weight-medium mb-0">
              N.º de cuenta (Opcional)
            </p>
            <q-input
              outlined
              v-model="formValues.account_number"
              dense
              type="number"
              placeholder="Ingrese número de cuenta"
              :rules="[
                (v) =>
                  !v ||
                  /^[a-zA-Z0-9]*$/.test(v) ||
                  'No se permiten caracteres especiales',
                (v) =>
                  !v || v.length >= 3 || 'Debe de tener mínimo 3 caracteres',
                (v) =>
                  !v || v.length <= 20 || 'Debe tener máximo 20 caracteres',
                (v) =>
                  !v || !/^-\d/.test(v) || 'No se permiten números negativos',
              ]"
            />
          </div>
          <div
            class="col-4 q-py-lg q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-4"
          >
            <GenericSelectorComponent
              :default_value="formValues.account_type"
              :manual_option="bank_type"
              label="Tipo de cuenta (Opcional)"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              :map_options="true"
              :rules="[(val: string) => !!val || 'El tipo de cuenta es requerido']"
              @update:modelValue="formValues.account_type = $event"
            />
          </div>
        </div>
        <q-separator />
      </div>
    </section>

    <!-- Files CCV -->
    <section>
      <div class="q-px-lg q-mt-lg">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Hoja de vida (Opcional)
        </p>
        <div class="row" style="text-align: -webkit-center">
          <div class="col-12 q-py-lg q-pa-sm">
            <UploadFile
              ref="attachCvvRef"
              multipleFiles
              labelUploadBtn="Seleccione los archivos para subir"
              classNameTitle="text-weight-medium text-grey-6 mb-0 text-center"
              accept="image/jpeg, image/png, image/pjpeg, application/msword, application/pdf"
              :title="null"
              :showPreview="false"
              :showNameFile="false"
              :showBorder="false"
              :stylesCustoms="styleCustomAttachFile"
              @added="addedFiles"
              @rejected="rejectedFiles"
            />
          </div>
        </div>
        <q-separator />
      </div>
    </section>

    <!-- Additional Documents List -->
    <section>
      <div class="q-px-lg q-mt-lg">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :custom-columns="['actions', 'attach']"
        >
          <template #attach="{ row }">
            <!-- Ver -->
            <q-btn
              no-caps
              unelevated
              outline
              class="btn-table"
              text-color="indigo-10"
              size="md"
              color="white"
              label="Ver adjunto"
              :icon="defaultIcons.eye"
              @click="viewFile(row.file)"
            >
            </q-btn>
          </template>

          <template #actions="{ row }">
            <!-- Eliminar -->
            <q-btn
              flat
              rounded
              size="14px"
              :icon="defaultIcons.trash"
              style="color: #5d699a"
              @click="removeFile(row.id)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                class="indigo-10"
              >
                <p class="q-ma-none text-body2">Eliminar</p>
              </q-tooltip>
            </q-btn>
          </template>
        </TableList>
      </div>
      <ViewerFileComponent ref="viewerFileComponentRef" />
    </section>

    <!-- Buttons -->
    <section v-if="showBtn === false">
      <div class="q-px-xl q-mt-md q-mb-lg">
        <div class="row justify-end">
          <q-btn
            v-if="showBackBtn"
            no-caps
            unelevated
            outline
            class="text-initial btn-custom-size btn__history col-2 q-ma-sm"
            text-color="indigo-10"
            size="md"
            color="white"
            :label="btnBackLabel"
            :icon="btnBackIcon"
            @click="() => emit('onBack', true)"
          />
          <q-btn
            v-if="!showBtnWithoutIcon"
            class="text-initial btn-custom-size btn__history col-2 q-ma-sm"
            type="submit"
            size="md"
            unelevated
            no-caps
            :icon-right="btnIcon"
            :label="btnLabel"
          />
          <q-btn
            v-if="showBtnWithoutIcon"
            class="text-initial btn-custom-size btn__history col-2 q-ma-sm"
            type="submit"
            size="md"
            unelevated
            no-caps
            :label="btnLabel"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>
<style lang="scss" scoped>
.btn-custom-size {
  width: 150px;
  height: 50px;
  border-radius: 10px;
  padding: 9px 20px;
}

.btn-table {
  width: 120px;
  height: 20px;
  border-radius: 20px;
}
</style>
