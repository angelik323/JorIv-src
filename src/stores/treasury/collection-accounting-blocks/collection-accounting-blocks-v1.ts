import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { ICollectionAccountingBlocksResponse, ICollectionAccountingParameterList, IBusiness } from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const TIMEOUT_ALERT = 3000

const VALID_PATTERNS = [/.*/]

export const useCollectionAccountingBlocksV1 = defineStore(
  'collection-accounting-blocks-v1',
  {
    state: () => ({
      version: 'v1',
      accounting_blocks_collections_list: [] as ICollectionAccountingBlocksResponse[],
      accounting_blocks_collections_pages: {
        currentPage: 0,
        lastPage: 0,
      },

      type_accounting_blocks_collections_request: null as ICollectionAccountingBlocksResponse | null,

      bussiness_trusts_list: [] as IBusiness[],
      bussiness_trusts_pages: {
        currentPage: 0,
        lastPage: 0,
      },

      accounting_parameters_collections_list: [] as ICollectionAccountingParameterList[],
      collectionAccountingBlockSelected: 0 as number,
      collectionAccountParameterSelected: 0 as number,

      data_information_form: null as ICollectionAccountingBlocksResponse | null,
      collectionAccountingBlocksId: null as number | null,
      error_information_form: null as string | null,
    }),

    actions: {
      async _getAccountingBlocksCollection(params: string = '', pages: number = 1) {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/v2/accounting-blocks-collections?paginate=true&page=${pages}${params}`)
          .then((response) => {
            if (response.data.success) {
              this.accounting_blocks_collections_list = response.data?.data?.data ?? []
              this.accounting_blocks_collections_pages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
              }
            } else {
              this._cleanCollectionAccountingBlocksData()
            }
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            this._cleanCollectionAccountingBlocksData()
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getByIdCollectionAccountingBlocks(id: number, params: string = '', pages: number = 20) {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/v2/accounting-blocks-collections/${id}?paginate=1&rows=${pages}${params}`)
          .then((response) => {
            if (response.data.success) {
              const res: ICollectionAccountingBlocksResponse = response.data?.data
              if (res) {
                this.type_accounting_blocks_collections_request = res
              }
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getBussinessTrust(id: number, params: string = '') {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/v2/accounting-blocks-collections/${id}/business-trusts?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              const res: IBusiness[] = response.data?.data?.data
              if (res) {
                this.bussiness_trusts_list = res
                this.bussiness_trusts_pages = {
                  currentPage: response.data?.data?.current_page ?? 1,
                  lastPage: response.data?.data?.last_page ?? 1,
                }
              }
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadRegisters(params: number) {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/v2/accounting-blocks-collections/export?ids[]=${params}`, {
            responseType: 'arraybuffer',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
  
            const name = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, name)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _createCollectionAccountingBlocks(data: ICollectionAccountingBlocksResponse): Promise<boolean> {
        let success = false
        await executeApi()
          .post(`${URL_PATH_TREASURIES}/v2/accounting-blocks-collections`, data)
          .then((response) => {
            success = response.data.success
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            const message = error.response?.data?.message
            if (this._isValidMessageLike(message)) {
              this.error_information_form = message
            } else {
              this.error_information_form = null
            }
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _updateCollectionAccountingBlocks(data: ICollectionAccountingBlocksResponse, id: number): Promise<boolean> {
        let success = false
        this.type_accounting_blocks_collections_request = null

        await executeApi()
          .put(
            `${URL_PATH_TREASURIES}/v2/accounting-blocks-collections/${id}`,
            data
          )
          .then((response) => {
            success = response.data.success
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            const message = error.response?.data?.message
            if (this._isValidMessageLike(message)) {
              this.error_information_form = message
            } else {
              this.error_information_form = null
            }
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _deleteCollectionAccountingBlock(id: number) {
        await executeApi()
          .delete(`${URL_PATH_TREASURIES}/v2/accounting-blocks-collections/${id}`)
          .then((response) => {
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      
      async _changeStatusAction(id: number) { //replantear si se debe eliminar.
        await executeApi()
          .delete(`${URL_PATH_TREASURIES}/accounting_blocks_collections/${id}`)
          .then((response) => {
            this._getAccountingBlocksCollection('')
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _setDataCollectionAccountingBlockSelected(data:number) {
        this.collectionAccountingBlockSelected = data ?? 0
      },

      _setCollectionAccountParameterSelected(data:number){
        this.collectionAccountParameterSelected = data ?? 0
      },

      _setDataInformationForm(
        data_to_set: ICollectionAccountingBlocksResponse | null
      ) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _cleanCollectionAccountingBlocksData() {
        this.accounting_blocks_collections_list = []
        this.accounting_blocks_collections_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },

      async _setCollectionAccountingBlocksRequest(
        data: ICollectionAccountingBlocksResponse | null
      ) {
        this.type_accounting_blocks_collections_request = data
          ? { ...data }
          : null
      },

      _isValidMessageLike(message: string) {
        if (typeof message !== 'string') return false
        return VALID_PATTERNS.some((pattern) => pattern.test(message))
      },
    },
  }
)
