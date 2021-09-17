/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EXPERIMENTAL_Table as Table,
  Checkbox,
  Input,
  Button,
  Modal,
  Tag,
  Textarea,
} from 'vtex.styleguide'
import useTableMeasures from '@vtex/styleguide/lib/EXPERIMENTAL_Table/hooks/useTableMeasures'
import useCheckboxTree from '@vtex/styleguide/lib/EXPERIMENTAL_useCheckboxTree/index'
import React, { useState, useEffect, useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from 'react-apollo'

import { titlesIntl } from '../utils/intl'
import ProductsTable from './ProductsTable'
import FilesColumn from './FilesColumn'
import { ErrorArrayMessage } from './ErrorMessage'
import { SuccessArrayMessage } from './SuccessMessage'
import LoadingSpinner from './LoadingSpinner'
import cancelOrder from '../graphql/cancelOrder.gql'
import updateDocument from '../graphql/updateDocument.gql'
import getPaymentTransaction from '../graphql/getPaymentTransaction.gql'
import paymentNotification from '../graphql/paymentNotification.gql'
import startHandlingOrder from '../graphql/startHandlingOrder.gql'
import invoiceOrder from '../graphql/invoiceOrder.gql'
import getOrderStatus from '../graphql/getOrderStatus.gql'
import getOrderDataToInvoice from '../graphql/getOrderDataToInvoice.gql'

export default function OrdersTable({ orderList }: TableProps) {
  const intl = useIntl()
  const [items, setItems] = useState(orderList)
  const [cancelOrderMutation] = useMutation(cancelOrder)
  const [updateDocumentMutation] = useMutation(updateDocument)
  const getPaymentTransactionQuery = useQuery(getPaymentTransaction)
  const [paymentNotificationMutation] = useMutation(paymentNotification)
  const [startHandlingOrderMutation] = useMutation(startHandlingOrder)
  const [invoiceOrderMutation] = useMutation(invoiceOrder)
  const getOrderStatusQuery = useQuery(getOrderStatus)
  const getOrderDataToInvoiceQuery = useQuery(getOrderDataToInvoice)

  // const [error, setError] = useState(false)
  const [errorArray, setErrorArray] = useState(false)
  // const [success, setSuccess] = useState(false)
  const [successArray, setSuccessArray] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [message, setMessage] = useState('')
  const [messageArraySuccess, setMessageArraySuccess] = useState<string[]>([])
  const [messageArrayError, setMessageArrayError] = useState<string[]>([])
  const [textInvoice, setTextInvoice] = useState('')

  const clearAlerts = useCallback(() => {
    // setError(false)
    setErrorArray(false)
    // setSuccess(false)
    setSuccessArray(false)
    setLoading(false)
    // setMessage('')
    setMessageArraySuccess([])
    setMessageArrayError([])
  }, [])

  const loadingAlert = useCallback(() => {
    // setError(false)
    setErrorArray(false)
    // setSuccess(false)
    setSuccessArray(false)
    setLoading(true)
    // setMessage('')
    setMessageArraySuccess([])
    setMessageArrayError([])
  }, [])

  const canceled = intl.formatMessage(titlesIntl.canceled)
  const created = intl.formatMessage(titlesIntl.created)
  const approved = intl.formatMessage(titlesIntl.approved)
  const confirmed = intl.formatMessage(titlesIntl.confirmed)

  const columns = [
    {
      id: 'status',
      title: intl.formatMessage(titlesIntl.ordersTableStatus),
      cellRenderer: ({ data }: any) => {
        let tag

        switch (data) {
          case 'canceled':
            tag = <Tag bgColor="#F71963">{canceled}</Tag>
            break

          case 'created':
            tag = <Tag bgColor="#E67E22">{created}</Tag>
            break

          case 'approved':
            tag = <Tag bgColor="#7D3C98">{approved}</Tag>
            break

          case 'confirmed':
            tag = <Tag bgColor="#16A085">{confirmed}</Tag>
            break

          default:
            break
        }

        return <div>{tag}</div>
      },
    },
    {
      id: 'orderId',
      title: intl.formatMessage(titlesIntl.ordersTableOrderId),
    },
    {
      id: 'products',
      title: intl.formatMessage(titlesIntl.ordersTableProducts),
      cellRenderer: ({ data }: any) => {
        return (
          <div>
            <Button
              variation="secondary"
              size="small"
              onClick={() => handleModalProductsToggle(data)}
            >
              {intl.formatMessage(titlesIntl.buttonShowProducts)}
            </Button>
          </div>
        )
      },
    },
    {
      id: 'files',
      title: intl.formatMessage(titlesIntl.ordersTableFiles),
      cellRenderer: ({ data }: any) => {
        return <FilesColumn orderId={data} />
      },
    },
    {
      id: 'invoice',
      title: intl.formatMessage(titlesIntl.invoiceNumber),
      cellRenderer: ({ data }: any) => {
        const itemIsChecked = (item: any) =>
          item.id === data.rowId && item.status === 'approved'

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const checked = checkboxes.checkedItems.some(itemIsChecked)
        const errorCondition = !textInvoice && checked

        return (
          <Input
            defaultValue={data.invoiceNumber}
            onChange={(e: any) => {
              const tempItems = items

              tempItems[data.rowId].invoice = {
                rowId: data.rowId,
                invoiceNumber: e.target.value,
              }
              setTextInvoice(e.target.value)
              setItems(tempItems)
            }}
            /*
            placeholder={intl.formatMessage(
              titlesIntl.placeholderInvoiceNumber
            )}
            */
            disabled={!checked}
            error={errorCondition}
            errorMessage={
              errorCondition &&
              intl.formatMessage(titlesIntl.placeholderInvoiceNumber)
            }
          />
        )
      },
    },
    {
      id: 'observations',
      title: 'observations',
      cellRenderer: ({ data }: any) => {
        return (
          <Textarea
            defaultValue={data.text}
            onChange={(e: any) => {
              const tempItems = items

              tempItems[data.rowId].observations = {
                rowId: data.rowId,
                text: e.target.value,
              }
              setItems(tempItems)
            }}
          />
        )
      },
    },
  ]

  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  const [orderIdToModal, setOrderIdToModal] = useState()

  const handleModalProductsToggle = (orderId: any) => {
    setOrderIdToModal(orderId)
    setIsProductModalOpen(!isProductModalOpen)
  }

  const [withCheckboxes, isRowActive, checkboxes] = useColumnsWithCheckboxes({
    columns,
    items,
  })

  const approveAction = {
    label: intl.formatMessage(titlesIntl.approve),
    onClick: () => handleApproveAction(checkboxes.checkedItems),
  }

  const confirmAction = {
    label: intl.formatMessage(titlesIntl.confirm),
    onClick: () => handleConfirmAction(checkboxes.checkedItems),
  }

  const cancelAction = {
    label: intl.formatMessage(titlesIntl.cancel),
    onClick: () => handleCancelAction(checkboxes.checkedItems),
  }

  async function handleApproveAction(selectedRows: any) {
    loadingAlert()
    const tempItems = items
    const successArrayTemp: string[] = []
    const errorArrayTemp: string[] = []

    for await (const row of selectedRows) {
      console.info('row', row)
      if (row.id === 'VTEX_CheckboxTreeRoot') {
        continue
      }

      if (row.status === 'created') {
        /*
        const dataFromUpdateDocumentMutation = await cancelOrderMutation({
          variables: {
            orderId: row.orderId,
          },
        })

        const { status } = dataFromUpdateDocumentMutation.data.cancelOrder
        */
        const statusFromSendNotification = 200

        if (statusFromSendNotification === 200) {
          const bodyToMasterData: BodyUpdateDocument = {
            orderId: row.orderId,
            status: 'approved',
            invoiceNumber: '',
          }

          const dataFromUpdateDocumentMutation = await updateDocumentMutation({
            variables: {
              documentId: row.idMasterData,
              body: bodyToMasterData,
            },
          })

          const { status: statusUpdateDocument } =
            dataFromUpdateDocumentMutation.data.updateDocument

          if (statusUpdateDocument === 200) {
            tempItems[row.id].status = 'approved'
            successArrayTemp.push(
              `${intl.formatMessage(titlesIntl.theOrder)} ${
                row.orderId
              } ${intl.formatMessage(titlesIntl.wasApproved)}`
            )
          } else {
            // aca habria que ver algo como intentar de actualizar el documento mas adelante
            errorArrayTemp.push(
              `${intl.formatMessage(titlesIntl.theOrder)} ${
                row.orderId
              } ${intl.formatMessage(titlesIntl.wasNotApproved)}`
            )
          }
        } else {
          errorArrayTemp.push(
            `${intl.formatMessage(titlesIntl.theOrder)} ${
              row.orderId
            } ${intl.formatMessage(titlesIntl.wasNotApproved)}`
          )
        }
      } else if (row.status === 'approved' || row.status === 'confirmed') {
        errorArrayTemp.push(
          `${intl.formatMessage(titlesIntl.theOrder)} ${
            row.orderId
          } ${intl.formatMessage(titlesIntl.wasAlreadyApproved)}`
        )
      } else {
        errorArrayTemp.push(
          `${intl.formatMessage(titlesIntl.theOrder)} ${
            row.orderId
          } ${intl.formatMessage(titlesIntl.isCanceled)}`
        )
      }
    }

    if (tempItems.length > 0) {
      setItems(tempItems)
    }

    if (successArrayTemp.length > 0) {
      setSuccessArray(true)
      setMessageArraySuccess(successArrayTemp)
    }

    if (errorArrayTemp.length > 0) {
      setErrorArray(true)
      setMessageArrayError(errorArrayTemp)
    }

    setLoading(false)
  }

  async function consult(orderId: string): Promise<any> {
    const dataFromGetOrderStatusQuery = await getOrderStatusQuery.refetch({
      orderId,
    })

    console.info('dataFromGetOrderStatusQuery', dataFromGetOrderStatusQuery)
    const statusOfOrder =
      dataFromGetOrderStatusQuery.data.getOrderStatus.data.status

    console.info('statusOfOrder inside', statusOfOrder)

    if (statusOfOrder === 'ready-for-handling') {
      return true
    }

    const awaitTimeout = (delay: number) =>
      new Promise((resolve) => setTimeout(resolve, delay * 1000))

    await awaitTimeout(2)

    return validarReintento(orderId)
  }

  async function validarReintento(orderId: string) {
    const response = await consult(orderId)

    return response
  }

  async function handleConfirmAction(selectedRows: any) {
    loadingAlert()
    const tempItems = items
    const successArrayTemp: string[] = []
    const errorArrayTemp: string[] = []

    for await (const row of selectedRows) {
      console.info('row', row)
      if (row.id === 'VTEX_CheckboxTreeRoot') {
        continue
      }

      if (row.status === 'approved') {
        const { invoiceNumber } = row.invoice

        if (invoiceNumber) {
          const dataFromGetPaymentTransactionQuery =
            await getPaymentTransactionQuery.refetch({
              orderId: row.orderId,
            })

          const { status: statusPaymentTransaction } =
            dataFromGetPaymentTransactionQuery.data.getPaymentTransaction

          if (statusPaymentTransaction === 200) {
            const { payments } =
              dataFromGetPaymentTransactionQuery.data.getPaymentTransaction.data

            const promiseInfo = payments.find(
              (p: any) => p.paymentSystemName === 'Promissory'
            )

            const paymentId = promiseInfo.id

            const dataFromPaymentNotificationMutation =
              await paymentNotificationMutation({
                variables: {
                  orderId: row.orderId,
                  paymentId,
                },
              })

            const { status: statusPaymentNotification } =
              dataFromPaymentNotificationMutation.data.paymentNotification

            if (await validarReintento(row.orderId)) {
              console.info('ok')
              if (statusPaymentNotification === 204) {
                console.info('statusPaymentNotification === 204')
                const dataFromStartHandlingOrderMutation =
                  await startHandlingOrderMutation({
                    variables: {
                      orderId: row.orderId,
                    },
                  })

                console.info(
                  'dataFromStartHandlingOrderMutation',
                  dataFromStartHandlingOrderMutation
                )
                const { status: statusStartHandlingOrder } =
                  dataFromStartHandlingOrderMutation.data.startHandlingOrder

                console.info(
                  'statusStartHandlingOrder',
                  statusStartHandlingOrder
                )

                const dataFromGetOrderStatusQuery =
                  await getOrderStatusQuery.refetch({
                    orderId: row.orderId,
                  })

                console.info(
                  'dataFromGetOrderStatusQuery',
                  dataFromGetOrderStatusQuery
                )
                const { status: statusOfOrder } =
                  dataFromGetOrderStatusQuery.data.getOrderStatus.data

                console.info('statusOfOrder', statusOfOrder)

                if (
                  statusStartHandlingOrder === 200 &&
                  statusOfOrder === 'handling'
                ) {
                  // Order invoice notification
                  const issuanceDate = new Date(Date.now()).toISOString()

                  console.info('datetime', issuanceDate)

                  const dataFromGetOrderDataToInvoiceQuery =
                    await getOrderDataToInvoiceQuery.refetch({
                      orderId: row.orderId,
                    })

                  console.info(
                    'dataFromGetOrderDataToInvoiceQuery',
                    dataFromGetOrderDataToInvoiceQuery
                  )

                  const { status: statusOfGetOrderDataToInvoice } =
                    dataFromGetOrderDataToInvoiceQuery.data.getOrder

                  if (statusOfGetOrderDataToInvoice === 200) {
                    const { value: invoiceValue, items: itemsToInvoice } =
                      dataFromGetOrderDataToInvoiceQuery.data.getOrder.data

                    const itemsToInvoiceBody = itemsToInvoice.map(
                      (item: any) => {
                        const itemAux = {
                          id: item.id,
                          quantity: item.quantity,
                          price: item.price,
                        }

                        return itemAux
                      }
                    )

                    console.info('issuanceDate', issuanceDate)
                    console.info('invoiceNumber', invoiceNumber)
                    console.info('invoiceValue', invoiceValue)
                    console.info('itemsToInvoiceBody', itemsToInvoiceBody)
                    const bodyInvoice: InvoiceBody = {
                      type: 'Output',
                      issuanceDate,
                      invoiceNumber,
                      invoiceValue,
                      items: itemsToInvoiceBody,
                    }

                    console.info('invoiceBody', bodyInvoice)
                    const dataFromInvoiceOrderMutation =
                      await invoiceOrderMutation({
                        variables: {
                          orderId: row.orderId,
                          bodyInvoice,
                        },
                      })

                    const { status: statusInvoiceOrder } =
                      dataFromInvoiceOrderMutation.data.invoiceOrder

                    console.info('statusInvoiceOrder', statusInvoiceOrder)

                    const bodyToMasterData: BodyUpdateDocument = {
                      orderId: row.orderId,
                      status: 'confirmed',
                      invoiceNumber,
                    }

                    const dataFromUpdateDocumentMutation =
                      await updateDocumentMutation({
                        variables: {
                          documentId: row.idMasterData,
                          body: bodyToMasterData,
                        },
                      })

                    const { status: statusUpdateDocument } =
                      dataFromUpdateDocumentMutation.data.updateDocument

                    if (statusUpdateDocument === 200) {
                      tempItems[row.id].status = 'confirmed'
                      successArrayTemp.push(
                        `${intl.formatMessage(titlesIntl.theOrder)} ${
                          row.orderId
                        } ${intl.formatMessage(titlesIntl.wasConfirmed)}`
                      )
                    } else {
                      // aca habria que ver algo como intentar de actualizar el documento mas adelante
                      errorArrayTemp.push(
                        `${intl.formatMessage(titlesIntl.theOrder)} ${
                          row.orderId
                        } ${intl.formatMessage(titlesIntl.wasNotConfirmed)}`
                      )
                    }
                  } else {
                    errorArrayTemp.push(
                      `${intl.formatMessage(titlesIntl.theOrder)} ${
                        row.orderId
                      } ${intl.formatMessage(titlesIntl.wasNotConfirmed)}`
                    )
                  }
                } else {
                  errorArrayTemp.push(
                    `${intl.formatMessage(titlesIntl.theOrder)} ${
                      row.orderId
                    } ${intl.formatMessage(titlesIntl.wasNotConfirmed)}`
                  )
                }
              } else {
                errorArrayTemp.push(
                  `${intl.formatMessage(titlesIntl.theOrder)} ${
                    row.orderId
                  } ${intl.formatMessage(titlesIntl.wasNotConfirmed)}`
                )
              }
            }
          } else {
            errorArrayTemp.push(
              `${intl.formatMessage(titlesIntl.theOrder)} ${
                row.orderId
              } ${intl.formatMessage(titlesIntl.wasNotConfirmed)}`
            )
          }
        } else {
          errorArrayTemp.push(
            `${intl.formatMessage(titlesIntl.theOrder)} ${
              row.orderId
            } ${intl.formatMessage(
              titlesIntl.wasNotConfirmed
            )} ${intl.formatMessage(titlesIntl.noInvoiceNumber)}`
          )
        }
      } else if (row.status === 'confirmed') {
        errorArrayTemp.push(
          `${intl.formatMessage(titlesIntl.theOrder)} ${
            row.orderId
          } ${intl.formatMessage(titlesIntl.wasAlreadyConfirmed)}`
        )
      } else if (row.status === 'created') {
        errorArrayTemp.push(
          `${intl.formatMessage(titlesIntl.theOrder)} ${
            row.orderId
          } ${intl.formatMessage(titlesIntl.approvedBeforeConfirming)}`
        )
      } else {
        errorArrayTemp.push(
          `${intl.formatMessage(titlesIntl.theOrder)} ${
            row.orderId
          } ${intl.formatMessage(titlesIntl.isCanceled)}`
        )
      }
    }

    if (tempItems.length > 0) {
      setItems(tempItems)
    }

    if (successArrayTemp.length > 0) {
      setSuccessArray(true)
      setMessageArraySuccess(successArrayTemp)
    }

    if (errorArrayTemp.length > 0) {
      setErrorArray(true)
      setMessageArrayError(errorArrayTemp)
    }

    setLoading(false)
  }

  async function handleCancelAction(selectedRows: any) {
    loadingAlert()
    const tempItems = items
    const successArrayTemp: string[] = []
    const errorArrayTemp: string[] = []

    for await (const row of selectedRows) {
      if (row.id === 'VTEX_CheckboxTreeRoot') {
        continue
      }

      console.info('row', row)
      if (row.status === 'confirmed') {
        errorArrayTemp.push(
          `${intl.formatMessage(titlesIntl.theOrder)} ${
            row.orderId
          } ${intl.formatMessage(titlesIntl.isConfirmed)}`
        )
      } else if (row.status !== 'canceled') {
        const dataFromUpdateDocumentMutation = await cancelOrderMutation({
          variables: {
            orderId: row.orderId,
          },
        })

        const { status } = dataFromUpdateDocumentMutation.data.cancelOrder

        if (status === 200) {
          tempItems[row.id].status = 'canceled'
          successArrayTemp.push(
            `${intl.formatMessage(titlesIntl.theOrder)} ${
              row.orderId
            } ${intl.formatMessage(titlesIntl.wasCanceled)}`
          )
        } else {
          errorArrayTemp.push(
            `${intl.formatMessage(titlesIntl.theOrder)} ${
              row.orderId
            } ${intl.formatMessage(titlesIntl.wasNotCanceled)}`
          )
        }
      } else {
        errorArrayTemp.push(
          `${intl.formatMessage(titlesIntl.theOrder)} ${
            row.orderId
          } ${intl.formatMessage(titlesIntl.wasAlreadyCanceled)}`
        )
      }
    }

    if (tempItems.length > 0) {
      setItems(tempItems)
    }

    if (successArrayTemp.length > 0) {
      setSuccessArray(true)
      setMessageArraySuccess(successArrayTemp)
    }

    if (errorArrayTemp.length > 0) {
      setErrorArray(true)
      setMessageArrayError(errorArrayTemp)
    }

    setLoading(false)
  }

  const [filteredItems, setFilteredItems] = useState(items)
  const [filterStatements, setFilterStatements] = useState([])

  const ITEMS_PER_PAGE = 5

  const { slicedItems, ...paginationProps } = usePagination(
    ITEMS_PER_PAGE,
    filteredItems
  )

  const listOfRowsOptions: number[] = [5]

  if (filteredItems.length >= 5) {
    listOfRowsOptions.push(10)
    if (filteredItems.length >= 10) {
      listOfRowsOptions.push(15)
    }
  }

  const pagination = {
    ...paginationProps,
    textOf: intl.formatMessage(titlesIntl.textOf),
    rowsOptions: listOfRowsOptions,
    textShowRows: intl.formatMessage(titlesIntl.textShowRows),
    totalItems: filteredItems.length,
  }

  const measures = useTableMeasures({
    size:
      pagination.totalItems < pagination.tableSize
        ? pagination.totalItems
        : pagination.tableSize,
    density: 'comfortable',
  })

  function handleFiltersChange(statements = []) {
    let newData = items.slice()

    statements.forEach((st: any) => {
      if (!st || !st.object) return
      const { subject, verb, object } = st

      switch (subject) {
        case 'orderId':
          if (verb === 'contains') {
            newData = newData.filter((item: any) => {
              return item[subject].includes(object)
            })
          } else if (verb === '=') {
            newData = newData.filter((item: any) => item[subject] === object)
          } else if (verb === '!=') {
            newData = newData.filter((item: any) => item[subject] !== object)
          }

          break

        case 'status':
          if (!object) return
          // eslint-disable-next-line no-case-declarations
          const selectedStatus = Object.keys(object).reduce(
            (acc: any, item: any) => (object[item] ? [...acc, item] : acc),
            []
          )

          newData = newData.filter((item: any) => {
            let status

            switch (item[subject]) {
              case 'canceled':
                status = canceled
                break

              case 'created':
                status = created
                break

              case 'approved':
                status = approved
                break

              case 'confirmed':
                status = confirmed
                break

              default:
                break
            }

            return selectedStatus.includes(status)
          })
          break

        default:
          break
      }
    })
    setFilteredItems(newData)
    setFilterStatements(statements)
  }

  const filterClear = intl.formatMessage(titlesIntl.filterClear)
  const filterAll = intl.formatMessage(titlesIntl.filterAll)
  const filterNone = intl.formatMessage(titlesIntl.filterNone)
  const filterAny = intl.formatMessage(titlesIntl.filterAny)
  const filterIs = intl.formatMessage(titlesIntl.filterIs)
  const filterIsNot = intl.formatMessage(titlesIntl.filterIsNot)
  const filterContains = intl.formatMessage(titlesIntl.filterContains)
  const filterApply = intl.formatMessage(titlesIntl.filterApply)

  const filters = {
    alwaysVisibleFilters: ['status', 'orderId'],
    statements: filterStatements,
    onChangeStatements: handleFiltersChange,
    clearAllFiltersButtonLabel: filterClear,
    collapseLeft: true,
    submitFilterLabel: filterApply,
    options: {
      status: {
        label: intl.formatMessage(titlesIntl.ordersTableStatus),
        renderFilterLabel: (st: any) => {
          if (!st || !st.object) {
            return filterAll
          }

          const keys: any = st.object ? Object.keys(st.object) : {}
          const isAllTrue = !keys.some((key: any) => !st.object[key])
          const isAllFalse = !keys.some((key: any) => st.object[key])
          const trueKeys = keys.filter((key: any) => st.object[key])
          let trueKeysLabel = ''

          trueKeys.forEach((key: any, index: any) => {
            trueKeysLabel += `${key}${
              index === trueKeys.length - 1 ? '' : ', '
            }`
          })

          const labelsArray = trueKeysLabel
            .split(',')
            .map((item: any) => item.trim())

          return `${
            isAllTrue ? filterAll : isAllFalse ? filterNone : `${labelsArray}`
          }`
        },
        verbs: [
          {
            value: 'includes',
            object: {
              renderFn: statusSelectorObject,
              extraParams: {},
            },
          },
        ],
      },
      orderId: {
        label: intl.formatMessage(titlesIntl.ordersTableOrderId),
        ...simpleInputVerbsAndLabel(),
      },
    },
  }

  function simpleInputObject({ values, onChangeObjectCallback }: any) {
    return (
      <Input
        value={values || ''}
        onChange={(e: any) => onChangeObjectCallback(e.target.value)}
      />
    )
  }

  function simpleInputVerbsAndLabel() {
    return {
      renderFilterLabel: (st: any) => {
        if (!st || !st.object) {
          // you should treat empty object cases only for alwaysVisibleFilters
          return filterAny
        }

        return `${
          st.verb === '='
            ? filterIs
            : st.verb === '!='
            ? filterIsNot
            : filterContains
        } ${st.object}`
      },
      verbs: [
        {
          label: filterIs,
          value: '=',
          object: {
            renderFn: simpleInputObject,
            extraParams: {},
          },
        },
        {
          label: filterIsNot,
          value: '!=',
          object: {
            renderFn: simpleInputObject,
            extraParams: {},
          },
        },
        {
          label: filterContains,
          value: 'contains',
          object: {
            renderFn: simpleInputObject,
            extraParams: {},
          },
        },
      ],
    }
  }

  function statusSelectorObject({ values, onChangeObjectCallback }: any) {
    const initialValue = {
      [created]: true,
      [approved]: true,
      [confirmed]: true,
      [canceled]: true,
      ...(values || {}),
    }

    const toggleValueByKey = (key: any) => {
      const newValues = {
        ...(values || initialValue),
        [key]: values ? !values[key] : false,
      }

      return newValues
    }

    return (
      <div>
        {Object.keys(initialValue).map((opt, index) => {
          return (
            <div className="mb3" key={`class-statment-object-${opt}-${index}`}>
              <Checkbox
                checked={values ? values[opt] : initialValue[opt]}
                label={opt}
                name="default-checkbox-group"
                onChange={() => {
                  const newValue = toggleValueByKey(`${opt}`)
                  const newValueKeys = Object.keys(newValue)
                  const isEmptyFilter = !newValueKeys.some(
                    (key) => !newValue[key]
                  )

                  onChangeObjectCallback(isEmptyFilter ? null : newValue)
                }}
                value={opt}
              />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <div className="messagesOrderTable">
        {loading && <LoadingSpinner />}
        {successArray && (
          <SuccessArrayMessage
            onClose={clearAlerts}
            messages={messageArraySuccess}
          />
        )}
        {errorArray && (
          <ErrorArrayMessage
            onClose={clearAlerts}
            messages={messageArrayError}
          />
        )}
      </div>
      <Table
        measures={measures}
        columns={withCheckboxes}
        items={slicedItems}
        isRowActive={isRowActive}
      >
        <Table.Bulk active={checkboxes.someChecked}>
          <Table.Bulk.Actions>
            <Table.Bulk.Actions.Primary {...approveAction} />
            <Table.Bulk.Actions.Primary {...confirmAction} />
            <Table.Bulk.Actions.Primary {...cancelAction} />
          </Table.Bulk.Actions>
          <Table.Bulk.Tail>
            {!checkboxes.allChecked && (
              <Table.Bulk.Tail.Info>
                {intl.formatMessage(titlesIntl.selectedOrders)}{' '}
                {checkboxes.checkedItems?.length}
              </Table.Bulk.Tail.Info>
            )}
            <Table.Bulk.Tail.Toggle
              button={{
                text: intl.formatMessage(titlesIntl.selectAllOrders),
                onClick: checkboxes.checkAll,
              }}
              active={checkboxes.allChecked}
            >
              {intl.formatMessage(titlesIntl.selectedOrders)} {items.length}
            </Table.Bulk.Tail.Toggle>
            <Table.Bulk.Tail.Dismiss onClick={checkboxes.uncheckAll} />
          </Table.Bulk.Tail>
        </Table.Bulk>
        <Table.FilterBar {...filters} />
        <Table.Pagination {...pagination} />
      </Table>
      <Modal
        centered
        isOpen={isProductModalOpen}
        onClose={() => handleModalProductsToggle(null)}
      >
        <ProductsTable orderId={orderIdToModal} />
      </Modal>
    </div>
  )
}

function useColumnsWithCheckboxes({ columns, items }: any) {
  const checkboxes = useCheckboxTree({
    items,
  })

  const mappedCheckboxes = checkboxes.itemTree.children.map(
    (item: { id: any }) => {
      const id = `${item.id}`

      return (
        <Checkbox
          key={id}
          id={id}
          checked={checkboxes.isChecked(item)}
          partial={checkboxes.isPartiallyChecked(item)}
          disabled={checkboxes.isDisabled(item)}
          onChange={() => checkboxes.toggle(item)}
        />
      )
    }
  )

  const withCheckboxes = [
    {
      id: 'checkbox',
      title: (
        <Checkbox
          id={`${checkboxes.itemTree.id}`}
          checked={checkboxes.allChecked}
          partial={checkboxes.someChecked}
          onChange={checkboxes.toggleAll}
        />
      ),
      width: 32,
      extended: true,
      cellRenderer: ({ data }: any) => {
        return <div>{mappedCheckboxes[data.id]}</div>
      },
    },
    ...columns,
  ]

  return [withCheckboxes, (data: any) => checkboxes.isChecked(data), checkboxes]
}

function usePagination(initialSize: number, itemsToPaginate: any) {
  const [state, setState] = useState({
    tableSize: initialSize,
    currentPage: 1,
    currentItemFrom: 1,
    currentItemTo: initialSize,
    slicedItems: [...itemsToPaginate].slice(0, initialSize),
  })

  /** resets state on items change */
  useEffect(() => {
    setState({
      tableSize: initialSize,
      currentPage: 1,
      currentItemFrom: 1,
      currentItemTo: initialSize,
      slicedItems: [...itemsToPaginate].slice(0, initialSize),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsToPaginate])

  /** gets the next page */
  const onNextClick = useCallback(() => {
    const newPage = state.currentPage + 1
    const itemFrom = state.currentItemTo + 1
    const itemTo = state.tableSize * newPage
    const newItems = [...itemsToPaginate].slice(itemFrom - 1, itemTo)

    setState({
      ...state,
      currentPage: newPage,
      currentItemFrom: itemFrom,
      currentItemTo: itemTo,
      slicedItems: newItems,
    })
  }, [state, itemsToPaginate])

  /** gets the previous page */
  const onPrevClick = useCallback(() => {
    if (state.currentPage === 0) return
    const newPage = state.currentPage - 1
    const itemFrom = state.currentItemFrom - state.tableSize
    const itemTo = state.currentItemFrom - 1
    const newItems = [...itemsToPaginate].slice(itemFrom - 1, itemTo)

    setState({
      ...state,
      currentPage: newPage,
      currentItemFrom: itemFrom,
      currentItemTo: itemTo,
      slicedItems: newItems,
    })
  }, [state, itemsToPaginate])

  /** deals rows change of Pagination component */
  const onRowsChange = useCallback(
    (_, value) => {
      const rowValue = parseInt(value, 10)

      setState({
        ...state,
        tableSize: rowValue,
        currentItemTo: rowValue,
        slicedItems: [...itemsToPaginate].slice(
          state.currentItemFrom - 1,
          rowValue
        ),
      })
    },
    [state, itemsToPaginate]
  )

  return {
    onNextClick,
    onPrevClick,
    onRowsChange,
    ...state,
  }
}
