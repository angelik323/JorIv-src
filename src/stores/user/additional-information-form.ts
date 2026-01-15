import { IFileField, IUploadedFile } from '@/interfaces/global/File'
import { Document, IAdditionalInformationForm } from '@/interfaces/global/user'
import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from '@/stores'
import { urlToFile } from '@/utils'

export const useAdditionalInformationFormStore = defineStore(
  'additional-information',
  {
    state: () => {
      return {
        userAdditionalInformationForm:
          null as IAdditionalInformationForm | null,
        fileRowList: [] as IFileField[],
        infoLoaded: false,
        isInactiveBank: false,
      }
    },
    actions: {
      _setUserAdditionalInformationForm(
        state: IAdditionalInformationForm | null
      ) {
        this.userAdditionalInformationForm = null
        if (state) this.userAdditionalInformationForm = state
      },
      async _loadAdditionalInformationData() {
        const { userData } = storeToRefs(useUserStore())
        if (userData.value) {
          if (!this.userAdditionalInformationForm) {
            this.userAdditionalInformationForm = {}
          }
          this.userAdditionalInformationForm.emergency_contact_name =
            userData.value?.emergency_contact_name
          this.userAdditionalInformationForm.emergency_contact_phone =
            userData.value?.emergency_contact_phone
          this.userAdditionalInformationForm.emergency_contact_relationship =
            userData.value?.emergency_contact_relationship
          this.userAdditionalInformationForm.bank_id =
            userData.value?.bank_id === 0 ? null : userData.value?.bank_id
          this.userAdditionalInformationForm.account_number =
            userData.value?.account_number
          this.userAdditionalInformationForm.account_type =
            userData.value?.account_type
          this.isInactiveBank = userData.value?.bank?.status_id === 2
          if (userData.value?.documents) {
            const files = userData.value.documents
            await this._convertDocumentsToFiles(files)
          }
        }
      },
      async _convertDocumentsToFiles(
        documents: Document[]
      ): Promise<IUploadedFile[]> {
        const files: IUploadedFile[] = []

        for (const doc of documents) {
          const file = await urlToFile(doc.url, doc.name, doc.mime_type, doc.id)

          if (file) {
            const uploadedFile = {
              __key: doc.id.toString(),
              __progress: 100,
              __progressLabel: '100%',
              __sizeLabel: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              __status: 'uploaded',
              __uploaded: file?.size,
              lastModified: file?.lastModified,
              lastModifiedDate: file?.lastModified
                ? new Date(file?.lastModified)
                : new Date(),
              name: file.name,
              size: file.size,
              type: file.type,
              webkitRelativePath: '',
            }
            this._addNewFile(file as never)
            files.push(uploadedFile)
          }
        }
        return files
      },
      _addNewFile(file: IUploadedFile) {
        const newFile: IFileField = {
          id: file.__key,
          description: file.name,
          file: file,
        }
        this.fileRowList.push(newFile)

        if (!this.userAdditionalInformationForm?.resume) {
          this.userAdditionalInformationForm!.resume = []
        }
        if (!this.userAdditionalInformationForm?.resume_name) {
          this.userAdditionalInformationForm!.resume_name = []
        }

        this.userAdditionalInformationForm?.resume.push(file)
        this.userAdditionalInformationForm?.resume_name.push(file.name)
      },
    },
  }
)
