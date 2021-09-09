/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EXPERIMENTAL_Table as Table,
  Checkbox,
  Input,
  Button,
  Modal,
} from 'vtex.styleguide'
import useTableMeasures from '@vtex/styleguide/lib/EXPERIMENTAL_Table/hooks/useTableMeasures'
import useCheckboxTree from '@vtex/styleguide/lib/EXPERIMENTAL_useCheckboxTree/index'
import React, { useState, useEffect, useCallback } from 'react'
import { useIntl } from 'react-intl'

import { titlesIntl } from '../utils/intl'
import ProductsTable from './ProductsTable'
import FilesColumn from './FilesColumn'
import { ErrorArrayMessage } from './ErrorMessage'
import SuccessMessage from './SuccessMessage'
import LoadingSpinner from './LoadingSpinner'

export default function OrdersTable({ orderList }: TableProps) {
  const intl = useIntl()
  const [items, setItems] = useState(orderList)

  // const [error, setError] = useState(false)
  const [errorArray, setErrorArray] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageArray, setMessageArray] = useState<string[]>([])

  const clearAlerts = useCallback(() => {
    // setError(false)
    setErrorArray(false)
    setSuccess(false)
    setLoading(false)
    setMessage('')
    setMessageArray([])
  }, [])

  const errorArrayAlert = useCallback(() => {
    // setError(false)
    setErrorArray(true)
    setSuccess(false)
    setLoading(false)
  }, [])

  const successAlert = useCallback(() => {
    // setError(false)
    setErrorArray(false)
    setSuccess(true)
    setLoading(false)
  }, [])

  const loadingAlert = useCallback(() => {
    // setError(false)
    setErrorArray(false)
    setSuccess(false)
    setLoading(true)
    setMessage('')
    setMessageArray([])
  }, [])

  const columns = [
    {
      id: 'status',
      title: intl.formatMessage(titlesIntl.ordersTableStatus),
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
    console.info('handleApproveAction selectedRows', selectedRows)
    setMessageArray(['Error1', 'Error2'])
    errorArrayAlert()
  }

  async function handleConfirmAction(selectedRows: any) {
    loadingAlert()
    console.info('handleConfirmAction selectedRows', selectedRows)
    setMessageArray(['Error3', 'Error4'])
    errorArrayAlert()
  }

  async function handleCancelAction(selectedRows: any) {
    loadingAlert()
    const tempItems = items

    selectedRows.forEach((row: any) => {
      tempItems[row.id].status = 'canceled'
    })

    setItems(tempItems)
    successAlert()
    setMessage('Cancelar con exito')
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

        default:
          break
      }
    })
    setFilteredItems(newData)
    setFilterStatements(statements)
  }

  const filterClear = intl.formatMessage(titlesIntl.filterClear)
  // const filterAll = intl.formatMessage(titlesIntl.filterAll)
  // const filterNone = intl.formatMessage(titlesIntl.filterNone)
  const filterAny = intl.formatMessage(titlesIntl.filterAny)
  const filterIs = intl.formatMessage(titlesIntl.filterIs)
  const filterIsNot = intl.formatMessage(titlesIntl.filterIsNot)
  const filterContains = intl.formatMessage(titlesIntl.filterContains)
  const filterApply = intl.formatMessage(titlesIntl.filterApply)

  const filters = {
    alwaysVisibleFilters: ['orderId'],
    statements: filterStatements,
    onChangeStatements: handleFiltersChange,
    clearAllFiltersButtonLabel: filterClear,
    collapseLeft: true,
    submitFilterLabel: filterApply,
    options: {
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

  return (
    <div>
      <div className="messagesOrderTable">
        {loading && <LoadingSpinner />}
        {success && <SuccessMessage onClose={clearAlerts} message={message} />}
        {errorArray && (
          <ErrorArrayMessage onClose={clearAlerts} messages={messageArray} />
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
