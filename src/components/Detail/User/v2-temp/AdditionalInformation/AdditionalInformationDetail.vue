<script setup lang="ts">
// Utils:
import { defaultIcons } from '@/utils';
// Components
import ViewerFileComponent from '@/components/common/ViewerFile/ViewerFileComponent.vue'
import TableList from '@/components/table-list/TableList.vue';
// Logic
import { useAdditionalInformationDetail } from '@/components/Detail/User/v2-temp/AdditionalInformation/AdditionalInformationDetail';

const { tableProps, viewerFileComponentRef, userData, viewFile } = useAdditionalInformationDetail()
</script>
<template>
  <!-- User data -->
  <section>
    <div class="q-mx-md q-mt-lg">
      <div class="row q-px-md q-col-gutter-md">
        <div class="col-12">
          <p class="text-black-10 text-weight-bold text-h6 mb-0">
            Contacto de emergencia (Opcional)
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            Nombre completo (Opcional)
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.emergency_contact_name ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            Teléfono (Opcional)
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.emergency_contact_phone ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            Parentesco (Opcional)
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.emergency_contact_relationship ?? 'No registró' }}
          </p>
        </div>
      </div>
      <div class="q-mx-md">
        <q-separator />
      </div>
    </div>
  </section>

  <!-- Bank Data -->
  <section>
    <div class="q-mx-md q-mt-lg">
      <div class="row q-px-md q-col-gutter-md">
        <div class="col-12">
          <p class="text-black-10 text-weight-bold text-h6 mb-0">
            Datos financieros (Opcional)
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">Banco (Opcional)</p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.bank?.description ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            N.º de cuenta (Opcional)
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.account_number ?? 'No registró' }}
          </p>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <p class="text-black-10 text-weight-medium mb-1">
            Tipo de cuenta (Opcional)
          </p>
          <p class="text-grey-6 text-weight-medium text__wrap-custom">
            {{ userData?.account_type ?? 'No registró' }}
          </p>
        </div>
      </div>
      <div class="q-mx-md">
        <q-separator />
      </div>
    </div>
  </section>

  <!-- Documents list -->
  <section class="q-mx-md q-mt-xl">
    <div class="q-px-md q-pa-sm">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :rows="tableProps.rows"
        :columns="tableProps.columns"
        :custom-columns="['attach']"
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
      </TableList>
    </div>
    <ViewerFileComponent ref="viewerFileComponentRef" />
  </section>
</template>
<style lang="scss" scoped>
.btn-table {
  width: 120px;
  height: 20px;
  border-radius: 20px;
}
</style>
