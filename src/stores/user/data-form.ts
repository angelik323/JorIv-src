import { IUserDataForm } from '@/interfaces/global/user'
import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from '@/stores'

export const useDataFormStore = defineStore('data-form', {
  state: () => {
    return {
      userDataForm: null as IUserDataForm | null,
      isInactiveRole: false,
      isInactiveBranch: false,
    }
  },
  actions: {
    _setUserDataForm(state: IUserDataForm | null) {
      this.userDataForm = {}
      if (state) this.userDataForm = state
    },
    _loadPersonalData() {
      const { userData } = storeToRefs(useUserStore())
      if (userData.value) {
        this.userDataForm!.role = userData.value?.role?.id
        this.userDataForm!.expiration_date = userData.value?.expiration_date
        this.userDataForm!.branch_id = userData.value?.branch_id
        this.userDataForm!.document_type_id = userData.value?.document_type_id
        this.userDataForm!.document = userData.value?.document
        this.userDataForm!.name = userData.value?.name
        this.userDataForm!.name = userData.value?.name
        this.userDataForm!.last_name = userData.value?.last_name
        this.userDataForm!.expedition_place_id =
          userData.value?.expedition_place?.id
        this.userDataForm!.sex = userData.value?.sex
        this.userDataForm!.phone = userData.value?.phone
        this.userDataForm!.email = userData.value?.email
        this.isInactiveRole = userData.value?.role?.status_id === 2
        this.isInactiveBranch = userData.value?.branch?.status_id === 2
      }
    },
  },
  getters: {
    isFormValid(): boolean {
      if (!this.userDataForm) return false
      if (this.isInactiveBranch) return false
      if (this.isInactiveRole) return false

      // Validaciones para cada campo del formulario
      const {
        role,
        expiration_date,
        branch_id,
        document_type_id,
        document,
        name,
        last_name,
        expedition_place_id,
        sex,
        phone,
        email,
      } = this.userDataForm

      // Regla para verificar la fecha: debe ser menor a la fecha actual
      const isValidDate = (date?: string) => {
        if (date) {
          const today = new Date()
          const inputDate = new Date(date)
          return inputDate > today
        } else if (!date) return true
      }

      // Regla para verificar longitud y contenido del nombre
      const isValidName = (name: string) => {
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/
        return name.length >= 2 && name.length <= 50 && nameRegex.test(name)
      }

      // Regla para verificar el documento
      const isValidDocument = (document: string) =>
        /^[a-zA-Z0-9]*$/.test(document) &&
        document.length >= 6 &&
        document.length <= 50

      // Regla para verificar el teléfono
      const isValidPhone = (phone: string) =>
        phone.length >= 3 &&
        phone.length <= 10 &&
        /^[0-9]*$/.test(phone) &&
        !/^-\d/.test(phone)

      // Regla para verificar el correo electrónico
      const isValidEmail = (email: string) =>
        /.+@.+\..+/.test(email) &&
        !/[áéíóúÁÉÍÓÚñÑ]/.test(email) &&
        /^[a-zA-Z0-9@._-]+$/.test(email)

      // Regla para verificar lugar de expedición
      const isValidExpeditionPlace = (id: number) => {
        if (document_type_id === 1) return !!id
        else if (document_type_id !== 1) return true
      }

      // Validación general
      return (
        role !== null &&
        (isValidDate(expiration_date as string) as boolean) &&
        branch_id !== null &&
        document_type_id !== null &&
        !!document &&
        isValidDocument(document) &&
        !!name &&
        isValidName(name) &&
        !/\s{2,}/.test(name) &&
        !!last_name &&
        isValidName(last_name) &&
        !/\s{2,}/.test(last_name) &&
        (isValidExpeditionPlace(expedition_place_id as number) as boolean) &&
        !!sex &&
        !!phone &&
        isValidPhone(phone) &&
        !!email &&
        isValidEmail(email)
      )
    },
  },
})
