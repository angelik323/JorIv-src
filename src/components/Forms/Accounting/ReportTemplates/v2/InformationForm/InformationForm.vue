<template>
  <q-form
    ref="informationFormRef"
    aria-label="Formulario de información de la creación de plantillas de informes contables"
  >
    <VCard class="q-mt-md q-pa-xl">
      <template #content-card>
        <section v-if="props.section === 'template'">
          <h4>Plantilla</h4>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pa-md">
            <div class="col-12 col-md-2 q-my-sm">Nombre de la plantilla</div>
            <div class="col-12 col-md-5">
              <GenericInputComponent
                :default_value="models.name"
                auto_complete
                placeholder="Ingrese el nombre"
                max_length="100"
                required
                label="Nombre"
                :rules="[
                  (val: string) => useRules().is_required(val, 'El nombre de la plantilla es requerido'),
                  (val: string) =>
                    useRules().max_length(
                      val,
                      100,
                    ),
    
                ]"
                @update:model-value="(val) => (models.name = val)"
              />
            </div>
          </div>
        </section>
        <section v-if="props.section === 'header'">
          <h4>Encabezado del reporte</h4>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pa-md">
            <div class="col-12 col-md-4 q-mt-lg">Aplicado encabezado 1</div>
            <div class="col-12 col-md-4 flex items-center justify-center">
              <RadioYesNo
                :model-value="models.header.has_first_header"
                @update:model-value="(val: boolean) => models.header.has_first_header = val"
              />
            </div>
            <div class="col-12 col-md-4">
              <GenericInputComponent
                :disabled="!models.header.has_first_header"
                :default_value="models.header.text_first_header"
                auto_complete
                placeholder="Ingrese el nombre"
                max_length="80"
                label="Nombre encabezado 1"
                :required="false"
                :rules="[
              (val: string) => useRules().is_required(val, 'El nombre es requerido'),
              (val: string) =>
                useRules().max_length(
                  val,
                  80,
                ),

            ]"
                @update:model-value="(val: string) => (models.header.text_first_header = val)"
              />
            </div>
            <div class="col-12 col-md-4 q-mt-lg">Logo 1</div>
            <div class="col-12 col-md-4 flex items-center justify-center">
              <RadioYesNo
                :model-value="models.header.has_first_logo"
                @update:model-value="(val: boolean) => {
                    if(!val) {
                      models.header.first_logo_id = null
                    }
                    models.header.has_first_logo = val
                }"
              />
            </div>
            <div class="col-12 col-md-4">
              <GenericSelectorComponent
                :disabled="!models.header.has_first_logo"
                :default_value="models.header.first_logo_id"
                auto_complete
                placeholder="Ingrese"
                map_options
                :manual_option="report_template_logos"
                label="Nombre logo"
                :required="false"
                :rules="[
              (val: string) => useRules().is_required(val, 'El nombre del logo es requerido'),
          

            ]"
                @update:model-value="(val:number) => (models.header.first_logo_id = val)"
              />
            </div>
            <div class="col-12 col-md-4 q-mt-lg">Logo 2</div>
            <div class="col-12 col-md-4 flex items-center justify-center">
              <RadioYesNo
                :model-value="models.header.has_second_logo"
                @update:model-value="(val: boolean) => {
                    if(!val) {
                      models.header.second_logo_id = null
                    }
                    models.header.has_second_logo = val
                }"
              />
            </div>
            <div class="col-12 col-md-4">
              <GenericSelectorComponent
                :disabled="!models.header.has_second_logo"
                :default_value="models.header.second_logo_id"
                auto_complete
                placeholder="Ingrese"
                map_options
                :manual_option="report_template_logos"
                label="Nombre logo"
                :required="false"
                :rules="[
              (val: string) => useRules().is_required(val, 'El nombre del logo es requerido'),
            ]"
                @update:model-value="(val : number) => models.header.second_logo_id = val"
              />
            </div>
            <div class="col-12 col-md-1 q-mt-lg">
              ¿Muestra el nombre de campos encabezados?
            </div>
            <div class="col-12 col-md-10 flex items-center justify-center">
              <RadioYesNo
                :model-value="models.header.show_header_name"
                @update:model-value="(val: boolean) => models.header.show_header_name = val"
              />
            </div>
            <div class="col-12 col-md-2 q-mt-lg">¿Muestra tipo de negocio</div>
            <div class="col-12 col-md-8 flex items-center justify-center">
              <RadioYesNo
                :model-value="models.header.show_business_type"
                @update:model-value="(val: boolean) => models.header.show_business_type = val"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-lg">
              Presentación código de negocio
            </div>
            <div class="col-12 col-md-6 q-ml-md">
              <GenericSelectorComponent
                :default_value="models.header.presentation_business_type"
                auto_complete
                map_options
                :manual_option="presentation_business_report_headers"
                placeholder="Ingrese el nombre"
                max_length="80"
                required
                :rules="[
              (val: string) => useRules().is_required(val, 'El nombre del logo es requerido'),
            
            ]"
                @update:model-value="(val: number) => (models.header.presentation_business_type = val)"
              />
            </div>
            <div class="col-12 col-md-3 q-mt-lg">Libro contable</div>
            <div class="col-12 col-md-6 flex items-center justify-center">
              <RadioYesNo
                :model-value="models.header.has_accounting_book"
                @update:model-value="(val: boolean) => models.header.has_accounting_book = val"
              />
            </div>
            <div class="col-12 col-md-4 q-mt-lg">Aplica encabezado 2</div>
            <div class="col-12 col-md-4 flex items-center justify-center">
              <RadioYesNo
                :model-value="models.header.has_second_header"
                @update:model-value="(val: boolean) => models.header.has_second_header = val"
              />
            </div>
            <div class="col-12 col-md-4">
              <GenericInputComponent
                :disabled="!models.header.has_second_header"
                :default_value="models.header.text_second_header"
                auto_complete
                placeholder="Ingrese el nombre"
                max_length="80"
                label="Nombre encabezado 2"
                required
                :rules="[
              (val: string) => useRules().is_required(val, 'El nombre del encabezado 2 es requerido'),
            ]"
                @update:model-value="(val: string) => (models.header.text_second_header = val)"
              />
            </div>
          </div>
          <h4>Notas o declaraciones contables</h4>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pa-md">
            <div class="col-12 col-md-6 q-mt-lg">
              ¿Aplica notas en el informe?
            </div>
            <div class="col-12 col-md-6 flex items-center justify-start">
              <RadioYesNo
                :model-value="modelNotes.has_note"
                @update:model-value="(val: boolean) => (modelNotes.has_note = val)"
              />
            </div>
            <div class="col-12 col-md-12 q-mt-md">
              <GenericInputComponent
                :disabled="!modelNotes.has_note"
                :default_value="modelNotes.description"
                auto_complete
                type="textarea"
                placeholder="Ingrese la nota"
                max_length="80"
                label="Nota"
                :required="false"
                :rules="[
              (val: string) => useRules().is_required(val, 'La nota es requerida'),
            
            ]"
                @update:model-value="(val: string) => (modelNotes.description = val)"
              />
            </div>
            <div class="col-12 col-md-6 q-mt-lg">Nota 2</div>
            <div class="col-12 col-md-6 flex justify-start">
              <RadioYesNo
                :model-value="modelNotes.has_second_note"
                @update:model-value="(val: boolean) => (modelNotes.has_second_note = val)"
              />
            </div>
            <div
              class="col-12 col-md-12 q-mt-md"
              v-if="modelNotes.has_second_note"
            >
              <GenericInputComponent
                :default_value="modelNotes.description_second_note"
                auto_complete
                type="textarea"
                placeholder="Ingrese la nota"
                max_length="80"
                label="Nota 2"
                :required="false"
                :rules="[
              (val: string) => useRules().is_required(val, 'La nota es requerida'),
              (val: string) =>
                useRules().max_length(
                  val,
                  80,
                ),

            ]"
              />
            </div>
            <div class="col-12 col-md-6 q-mt-lg">Notas 3</div>
            <div class="col-12 col-md-6 flex items-center justify-start">
              <RadioYesNo
                :model-value="modelNotes.has_third_note"
                @update:model-value="(val: boolean) => (modelNotes.has_third_note = val)"
              />
            </div>
            <div
              class="col-12 col-md-12 q-mt-md"
              v-if="modelNotes.has_third_note"
            >
              <GenericInputComponent
                :default_value="modelNotes.description_third_note"
                auto_complete
                type="textarea"
                placeholder="Ingrese la nota"
                max_length="80"
                label="Nota 3"
                :required="false"
                :rules="[
              (val: string) => useRules().is_required(val, 'La nota es requerida'),
            ]"
                @update:model-value="(val: string) => (modelNotes.description_third_note = val)"
              />
            </div>
          </div>
        </section>
        <section v-if="props.section === 'signature'">
          <h4>Firmas</h4>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pa-md">
            <div class="col-12 col-md-6 q-mt-lg">¿Maneja firmas?</div>
            <div class="col-12 col-md-6 flex items-center justify-start">
              <RadioYesNo
                :model-value="modelsSignatures.manage_signature"
                @update:model-value="(val: boolean) => (modelsSignatures.manage_signature = val)"
              />
            </div>

            <div class="col-12 col-md-6 q-mt-lg">'Seleccione la firma'</div>
            <div class="col-12 col-md-6">
              <GenericSelectorComponent
                :disabled="!modelsSignatures.manage_signature"
                :default_value="modelsSignatures.report_signature_id"
                auto_complete
                map_options
                :manual_option="report_template_signatures"
                placeholder="Selecciona la firma"
                label="Firma"
                required
                :rules="[
              (val: string) => useRules().is_required(val, 'La firma es requerida'),
            ]"
                @update:model-value="
                  (val) => (modelsSignatures.report_signature_id = val)
                "
              />
            </div>
            <div class="col-12 col-md-6 q-mt-lg">Tipo de responsable</div>
            <div class="col-12 col-md-6">
              <GenericSelectorComponent
                :disabled="!modelsSignatures.manage_signature"
                :default_value="modelsSignatures.responsible_type"
                auto_complete
                placeholder="Seleccione"
                map_options
                :manual_option="responsible_report_signatures"
                label="Responsable"
                required
                :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de responsable es requerido'),            
            ]"
                @update:model-value="
                  (val) => (modelsSignatures.responsible_type = val)
                "
              />
            </div>
            <div class="col-12 col-md-6 q-mt-lg">
              Orden de presentación en el reporte
            </div>
            <div class="col-12 col-md-6">
              <GenericInputComponent
                :disabled="!modelsSignatures.manage_signature"
                :default_value="modelsSignatures.order"
                auto_complete
                placeholder="Ingrese"
                label="Orden de presentación"
                max_length="1"
                required
                :rules="[
              (val: string) => useRules().is_required(val, 'El orden de presentación en el reporte es requerido'),
              (val: string) =>
                useRules().max_value(val, 6),
            (val: string) => useRules().min_value(val, 1),


            ]"
                @update:model-value="(val:number) => (modelsSignatures.order = val)
                "
              />
            </div>
            <div class="col-12 col-md-6 q-mt-lg">Tipo de firma</div>
            <div class="col-12 col-md-6">
              <GenericSelectorComponent
                :disabled="!modelsSignatures.manage_signature"
                :default_value="modelsSignatures.signature_type"
                auto_complete
                map_options
                :manual_option="type_report_signatures"
                placeholder="Ingrese"
                label="Tipo de firma"
                required
                :rules="[
              (val: string) => useRules().is_required(val, 'El tipo de firma es requerido'),
            ]"
                @update:model-value="
                  (val) => (modelsSignatures.signature_type = val)
                "
              />
            </div>
            <div class="col-12 col-md-6 q-mt-lg">¿Muestra cargo?</div>
            <div class="col-12 col-md-6 flex items-center justify-start">
              <RadioYesNo
                :is-disabled="!modelsSignatures.manage_signature"
                :model-value="modelsSignatures.show_position"
                @update:model-value="(val: boolean) => (modelsSignatures.show_position = val)"
              />
            </div>
            <div class="col-12 col-md-6 q-mt-lg">¿Muestra identificación?</div>
            <div class="col-12 col-md-6 flex items-center justify-start">
              <RadioYesNo
                :is-disabled="!modelsSignatures.manage_signature"
                :model-value="modelsSignatures.show_identification_number"
                @update:model-value="(val: boolean) => (modelsSignatures.show_identification_number = val)"
              />
            </div>
            <div class="col-12 col-md-6 q-mt-lg">
              ¿Maneja tarjeta profesional?
            </div>
            <div class="col-12 col-md-2 flex justify-start">
              <RadioYesNo
                :is-disabled="!modelsSignatures.manage_signature"
                :model-value="modelsSignatures.show_professional_card"
                @update:model-value="(val: boolean) => (modelsSignatures.show_professional_card = val)"
              />
            </div>
            <div class="col-12 col-md-4">
              <GenericInputComponent
                :disabled="
                  !modelsSignatures.show_professional_card ||
                  !modelsSignatures.manage_signature
                "
                :default_value="modelsSignatures.profession_card_number"
                auto_complete
                placeholder="Ingrese"
                max_length="10"
                label="Tarjeta profesional"
                :required="false"
                :rules="[
              (val: string) => useRules().is_required(val, 'La tarjeta profesional es requerido'),
              (val: string) =>
                useRules().max_length(
                  val,
                  10,
                ),
            ]"
                @update:model-value="(val: string) => (modelsSignatures.profession_card_number = val)"
              />
            </div>
            <div class="col-12 col-md-6 q-mt-lg">
              ¿Imprime imágen de la firma?
            </div>
            <div class="col-12 col-md-4 flex items-center justify-start">
              <RadioYesNo
                :is-disabled="!modelsSignatures.manage_signature"
                :model-value="modelsSignatures.show_signature_image"
                @update:model-value="(val: boolean) => (modelsSignatures.show_signature_image = val)"
              />
            </div>
            <div class="col-12 col-md-6 q-mt-lg">
              ¿Imprime leyenda de la firma?
            </div>
            <div class="col-12 col-md-2 flex justify-start">
              <RadioYesNo
                :is-disabled="!modelsSignatures.manage_signature"
                :model-value="modelsSignatures.show_signature_legend"
                @update:model-value="(val: boolean) => (modelsSignatures.show_signature_legend = val)"
              />
            </div>
            <div class="col-12 col-md-4">
              <GenericInputComponent
                :disabled="
                  !modelsSignatures.show_signature_legend ||
                  !modelsSignatures.manage_signature
                "
                :default_value="modelsSignatures.signature_legend"
                auto_complete
                placeholder="Ingrese"
                max_length="60"
                label="Leyenda"
                :required="false"
                :rules="[
              (val: string) => useRules().is_required(val, 'La leyenda es requerida'),
                (val: string) =>
                    useRules().max_length(
                    val,
                    60,
                    ),
            ]"
                @update:model-value="(val: string) => (modelsSignatures.signature_legend = val)"
              />
            </div>
          </div>
          <div class="flex justify-end q-pt-md">
            <Button
              color="orange"
              :class-custom="'custom'"
              :outline="true"
              :flat="false"
              :disabled="!modelsSignatures.manage_signature"
              label="Agregar otra firma"
              @click="loadSignaturePartial"
            />
          </div>
          <div class="q-pt-md">
            <TableList
              :title="tablePropertiesSignatures.title"
              :loading="tablePropertiesSignatures.loading"
              :rows="tablePropertiesSignatures.rows"
              :columns="tablePropertiesSignatures.columns"
              :pages="tablePropertiesSignatures.pages"
              :custom-columns="['actions']"
            >
              <template #actions="{ row }">
                <Button
                  :right-icon="defaultIconsLucide.eye"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Ver"
                  @click="getFullSignatureById(row.id)"
                />
                <Button
                  :right-icon="defaultIconsLucide.edit"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Editar"
                />
                <Button
                  :right-icon="defaultIconsLucide.delete"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Eliminar"
                  @click="deleteSignaturePartial(row.id)"
                />
              </template>
            </TableList>
          </div>
        </section>
        <section v-if="props.section === 'reports'">
          <h4>Asignación de reportes</h4>
          <div class="q-pt-md">
            <TableList
              :title="tablePropertiesFinancialStatements.title"
              :loading="tablePropertiesFinancialStatements.loading"
              :rows="tablePropertiesFinancialStatements.rows"
              :columns="tablePropertiesFinancialStatements.columns"
              :pages="tablePropertiesFinancialStatements.pages"
              :custom-columns="['check']"
              :selection="'multiple'"
              v-model:selected="selectedRows"
            />
          </div>
          <div class="q-pt-md">
            <TableList
              :title="tablePropertiesBooks.title"
              :loading="tablePropertiesBooks.loading"
              :rows="tablePropertiesBooks.rows"
              :columns="tablePropertiesBooks.columns"
              :pages="tablePropertiesBooks.pages"
              :custom-columns="['check']"
              :selection="'multiple'"
              v-model:selected="selectedRows"
            />
          </div>
          <div class="q-pt-md">
            <TableList
              :title="tablePropertiesBalance.title"
              :loading="tablePropertiesBalance.loading"
              :rows="tablePropertiesBalance.rows"
              :columns="tablePropertiesBalance.columns"
              :pages="tablePropertiesBalance.pages"
              :custom-columns="['check']"
              :selection="'multiple'"
              v-model:selected="selectedRows"
            />
          </div>
          <div class="q-pt-md">
            <TableList
              :title="tablePropertiesAuxReports.title"
              :loading="tablePropertiesAuxReports.loading"
              :rows="tablePropertiesAuxReports.rows"
              :columns="tablePropertiesAuxReports.columns"
              :pages="tablePropertiesAuxReports.pages"
              row-key="uniqueKey"
              :selection="'multiple'"
              :custom-columns="['check']"
              v-model:selected="selectedRows"
            />
          </div>
        </section>
      </template>
    </VCard>
  </q-form>
</template>

<script setup lang="ts">
//Components
import Button from '@/components/common/Button/Button.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'

//Interfaces
import { IReportTemplatePayload } from '@/interfaces/customs/accounting/ReportTemplates'
import { ActionType } from '@/interfaces/global/Action'
import { ReportTemplateActions } from '@/interfaces/global/Action'

//Composables
import { useRules } from '@/composables/useRules'

//Logic view
import useInformationForm from '@/components/Forms/Accounting/ReportTemplates/v2/InformationForm/InformationForm'

const props = defineProps<{
  action: ActionType
  section: ReportTemplateActions | string
  data?: IReportTemplatePayload
}>()

const emits =
  defineEmits<(e: 'update:data', value: IReportTemplatePayload) => void>()

const {
  //Table properties
  tablePropertiesFinancialStatements,
  tablePropertiesBooks,
  tablePropertiesBalance,
  tablePropertiesAuxReports,
  tablePropertiesSignatures,
  loadSignaturePartial,
  deleteSignaturePartial,
  getFullSignatureById,

  //Others
  selectedRows,
  defaultIconsLucide,

  //Models
  models,
  modelsSignatures,
  modelNotes,

  //Data
  type_report_signatures,
  presentation_business_report_headers,
  report_template_logos,
  report_template_signatures,
  responsible_report_signatures,
  informationFormRef,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
