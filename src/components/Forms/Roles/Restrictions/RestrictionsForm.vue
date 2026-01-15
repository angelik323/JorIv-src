<script lang="ts" src="./RestrictionsForm.ts" />
<template>
  <q-form ref="formData">
    <section>
      <div class="q-px-lg q-mt-lg q-pb-lg q-mb-sm">
        <p class="text-black-10 text-weight-bold text-h6 mb-0">
          Restricciones de acceso
        </p>
      </div>
      <div class="mx-3 mt-0 mb-3">
        <div class="row items-center">
          <div class="col-xs-12 col-sm-12 col-md-6 p-2">
            <q-checkbox
              color="orange"
              v-model="dataForm.is_schedule_restricted"
              label="Restricciones de horario"
              :disable="props.formType == 'view'"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 p-2 row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-6">
              <p class="text-grey-6">Hora inicial</p>
              <GenericTimeInput
                v-if="props.formType !== 'view'"
                :default_value="dataForm.schedule_start_hour"
                placeholder="00:00"
                :required="true"
                now_btn
                @update:modelValue="dataForm.schedule_start_hour = $event"
                :rules="[
                  (val: string) => useRules().is_required(val, 'La hora inical es requerida.'),
                  (val: string) => useRules().valid_format_time(val)
                ]"
              />
              <div v-else>
                <p>
                  {{ dataForm.schedule_start_hour || 'No registra' }}
                </p>
                <br />
              </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6">
              <p class="text-grey-6">Hora final</p>
              <GenericTimeInput
                v-if="props.formType !== 'view'"
                :default_value="dataForm.schedule_end_hour"
                placeholder="00:00"
                :required="true"
                now_btn
                @update:modelValue="dataForm.schedule_end_hour = $event"
                :rules="[
                  (val: string) => useRules().is_required(val, 'La hora final es requerida.'),
                  (val: string) => useRules().valid_format_time(val)
                ]"
              />
              <div v-else>
                <p>
                  {{ dataForm.schedule_end_hour || 'No registra' }}
                </p>
                <br />
              </div>
            </div>
          </div>
        </div>
        <q-separator class="q-mt-md" />
      </div>

      <div class="mx-3 mt-0 mb-3">
        <div class="row items-center">
          <div class="col-xs-12 col-sm-12 col-md-6 p-2">
            <q-checkbox
              color="orange"
              v-model="dataForm.has_expiration"
              label="Vencimiento"
              :disable="props.formType == 'view'"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 p-2">
            <GenericSelectorComponent
              v-if="props.formType !== 'view'"
              label="Expiración de usuario"
              :default_value="dataForm.expired_months"
              :manual_option="list.months"
              :auto_complete="false"
              clearable
              map_option
              @update:modelValue="dataForm.expired_months = $event"
              :disabled="!dataForm.has_expiration"
              :rules="dataForm.expired_months ? [] : [(v: string) => useRules().is_required(v)]"
            />
            <div v-else>
              <p>
                {{
                  returnLabel(
                    dataForm.expired_months?.value
                      ? dataForm.expired_months.value
                      : dataForm.expired_months,
                    list.months
                  ) || 'No registra'
                }}
              </p>
              <br />
            </div>
          </div>
        </div>
        <q-separator class="q-mt-md" />
      </div>

      <div class="mx-3 mt-0 mb-3">
        <div class="row items-center q-col-gutter-sm">
          <div class="col-xs-12 col-sm-12 col-md-6 p-2">
            <q-checkbox
              color="orange"
              v-model="dataForm.requires_mfa"
              label="MFA"
              :disable="props.formType == 'view'"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 p-2">
            <GenericSelectorComponent
              v-if="props.formType !== 'view'"
              label="Obligar MFA al usuario"
              :default_value="dataForm.mfa_duration_months"
              :manual_option="list.months"
              :auto_complete="false"
              clearable
              map_option
              @update:modelValue="dataForm.mfa_duration_months = $event"
              :disabled="!dataForm.requires_mfa"
              :rules="dataForm.mfa_duration_months ? [] : [(v: string) => useRules().is_required(v)]"
            />
            <div v-else>
              <p>
                {{
                  returnLabel(
                    dataForm.mfa_duration_months?.value
                      ? dataForm.mfa_duration_months.value
                      : dataForm.mfa_duration_months,
                    list.months
                  ) || 'No registra'
                }}
              </p>
              <br />
            </div>
          </div>
        </div>
        <q-separator class="q-mt-md" />
      </div>

      <div class="mx-3 mt-0 mb-3">
        <div class="row items-center">
          <div class="col-xs-12 col-sm-12 col-md-6 p-2">
            <q-checkbox
              color="orange"
              v-model="dataForm.has_password_policy"
              label="Políticas de contraseñas"
              :disable="props.formType == 'view'"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 p-2">
            <GenericSelectorComponent
              v-if="props.formType !== 'view'"
              label="Solicitar cambio de contraseña cada"
              :default_value="dataForm.password_expiration_days"
              :manual_option="list.months"
              :auto_complete="false"
              clearable
              map_option
              @update:modelValue="dataForm.password_expiration_days = $event"
              :disabled="!dataForm.has_password_policy"
              :rules="dataForm.password_expiration_days ? [] : [(v: string) => useRules().is_required(v)]"
            />
            <div v-else>
              <p>
                {{
                  returnLabel(
                    dataForm.password_expiration_days?.value
                      ? dataForm.password_expiration_days.value
                      : dataForm.password_expiration_days,
                    list.days
                  ) || 'No registra'
                }}
              </p>
              <br />
            </div>
          </div>
        </div>
        <q-separator class="q-mt-md" />
      </div>
    </section>
    <!-- Submit Button -->
    <section>
      <div class="q-px-xl q-mt-md q-mb-lg">
        <div class="row justify-end q-gutter-sm">
          <Button
            :outline="false"
            :label="props.btnBackLabel"
            :left-icon="props.btnBackIcon"
            color-icon="white"
            color="orange"
            class="custom"
            :styleContent="{
              'place-items': 'center',
              'border-radius': '20px',
              'font-size': '13px',
            }"
            @click="emit('onBack', true)"
          />

          <Button
            :outline="false"
            :label="props.btnLabel"
            color-icon="white"
            color="orange"
            class="custom"
            :styleContent="{
              'place-items': 'center',
              'border-radius': '20px',
              'font-size': '13px',
            }"
            @click="handlerClickButton"
          />
        </div>
      </div>
    </section>
  </q-form>
</template>

<style lang="scss" src="./RestrictionsForm.scss" />
