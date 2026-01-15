<template>
  <q-form class="q-pa-lg">
    <section class="q-mb-xl">
      <div class="row justify-between items-center q-mb-md">
        <span class="text-weight-bold">Importar plantilla</span>
        <Button
          label="Descargar plantilla"
          color="primary"
          outline
          @click="downloadTemplate"
        />
      </div>

      <UploadFile
        v-if="!hasFileLoaded"
        :title="null"
        accept=".xlsx"
        :styles-customs="'width: 100%;'"
        :bordered="false"
        @added="addedFiles"
        @removed="removeUploadedFile"
      />

      <TableList
        v-else
        :rows="uploadTable.rows"
        :columns="uploadTable.columns"
        :loading="uploadTable.loading"
        :pages="uploadTable.pages"
        :custom-columns="['status', 'actions']"
      >
        <template #status="{ row }">
          <div
            class="q-pa-md row items-center"
            :class="row.status !== 'LOADING' ? 'justify-center' : ''"
          >
            <div class="q-mr-md">
              <ShowStatus
                :type="
                  row.status === 'LOADING'
                    ? 20
                    : row.status === 'SUCCESS'
                    ? 104
                    : 105
                "
              />
            </div>

            <q-linear-progress
              v-if="row.status === 'LOADING'"
              :value="progressValue"
              color="primary_fiduciaria"
              size="7px"
              style="flex: 1; border-radius: 9999px; overflow: hidden"
            />
          </div>
        </template>

        <template #actions>
          <Button
            label="Eliminar"
            color="orange"
            outline
            flat
            @click="removeUploadedFile"
          />
        </template>
      </TableList>
    </section>

    <section v-if="hasDetailRows" class="q-mb-xl">
      <div class="row justify-between items-center q-mb-md">
        <span class="text-weight-bold">Detalle de embargo masivo</span>

        <Button
          label="Descargar detalle"
          color="primary"
          outline
          @click="downloadDetailMassive"
        />
      </div>

      <TableList
        :rows="detailTable.rows"
        :columns="detailTable.columns"
        :loading="detailTable.loading"
        :pages="detailTable.pages"
      />
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Componentes
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

//logic view
import useSeizuresFormMassive from '@/components/Forms/Seizures/SeizuresFormMassive/SeizuresFormMassive'

const {
  uploadTable,
  detailTable,
  hasFileLoaded,
  hasDetailRows,
  isValid,
  progressValue,
  downloadDetailMassive,
  getMassivePayload,
  downloadTemplate,
  addedFiles,
  removeUploadedFile,
} = useSeizuresFormMassive()

defineExpose({
  hasFileLoaded,
  isValid,
  getMassivePayload,
})
</script>
