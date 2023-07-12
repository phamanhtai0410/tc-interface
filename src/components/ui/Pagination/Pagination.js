import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Pager from './Pagers'
import Prev from './Prev'
import Next from './Next'
import Total from './Total'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useConfig } from '../ConfigProvider'

const Pagination = (props) => {
    const { className, currentPage, displayTotal, onChange, pageSize, total,setQuerySize } =
        props

    const [paginationTotal, setPaginationTotal] = useState(total)
    const [internalPageSize, setInternalPageSize] = useState(pageSize)

    const getInternalPageCount = useMemo(() => {
        if (typeof paginationTotal === 'number') {
            return Math.ceil(paginationTotal / internalPageSize)
        }
        return null
    }, [paginationTotal, internalPageSize])

    const getValidCurrentPage = useCallback(
        (count) => {
            const value = parseInt(count, 10)
            let internalPageCount = getInternalPageCount
            let resetValue
            if (!internalPageCount) {
                if (isNaN(value) || value < 1) {
                    resetValue = 1
                }
            } else {
                if (value < 1) {
                    resetValue = 1
                }
                if (value > internalPageCount) {
                    resetValue = internalPageCount
                }
            }

            if (
                (resetValue === undefined && isNaN(value)) ||
                resetValue === 0
            ) {
                resetValue = 1
            }

            return resetValue === undefined ? value : resetValue
        },
        [getInternalPageCount]
    )

    const [internalCurrentPage, setInternalCurrentPage] = useState(
        currentPage ? getValidCurrentPage(currentPage) : 1
    )

    useEffect(() => {
        if (total !== paginationTotal) {
            setPaginationTotal(total)
        }

        if (pageSize !== internalPageSize) {
            setInternalPageSize(pageSize)
        }

        if (currentPage !== internalCurrentPage) {
            setInternalCurrentPage(currentPage)
        }
    }, [total, pageSize, currentPage])

    const onPaginationChange = (val) => {
        // set internal current page to display active pager
        setInternalCurrentPage(getValidCurrentPage(val))
        // set update state Page in index page to update ui
        setQuerySize((currentPage) => ({ ...currentPage, page: getValidCurrentPage(val), page_size: currentPage.page_size+5000}))
        onChange?.(getValidCurrentPage(val))
    }

    const onPrev = useCallback(() => {
        const newPage = internalCurrentPage - 1
        // set internal current page to display active pager
        setInternalCurrentPage(getValidCurrentPage(newPage))
        // set update state Page in index page to update ui
        setQuerySize((currentPage)=>({...currentPage,page:getValidCurrentPage(newPage)}))

        onChange?.(getValidCurrentPage(newPage))
    }, [onChange, internalCurrentPage, getValidCurrentPage])

    const onNext = useCallback(() => {
        const newPage = internalCurrentPage + 1
        // set internal current page to display active pager
        setInternalCurrentPage(getValidCurrentPage(newPage))
        // set update state Page in index page to update ui
        setQuerySize((currentPage)=>({...currentPage,page:getValidCurrentPage(newPage)}))
        onChange?.(getValidCurrentPage(newPage))
    }, [onChange, internalCurrentPage, getValidCurrentPage])

    const pagerClass = {
        default: ' cursor-pointer relative mx-1 p-[6px] rounded-lg inline-flex items-center h-8 justify-center text-sm font-semibold select-none',
        inactive: 'bg-[#E6E9ED] text-[#6E757C]',
        active: "bg-[#0C72FA] text-[#fff]",
        disabled: ' text-[#A2A8B6] bg-[#E6E9ED]',
    }

    const paginationClass = classNames('pagination', className)

    return (
        <div className={paginationClass}>
            {displayTotal && <Total total={total} />}
            <Prev
                currentPage={internalCurrentPage}
                pagerClass={pagerClass}
                onPrev={onPrev}
            />
            <Pager
                onChange={onPaginationChange}
                pageCount={getInternalPageCount}
                currentPage={internalCurrentPage}
                pagerClass={pagerClass}
            />
            <Next
                currentPage={internalCurrentPage}
                pageCount={getInternalPageCount}
                pagerClass={pagerClass}
                onNext={onNext}
            />
        </div>
    )
}

Pagination.propTypes = {
    total: PropTypes.number,
    displayTotal: PropTypes.bool,
    pageSize: PropTypes.number,
    className: PropTypes.string,
    currentPage: PropTypes.number,
    onChange: PropTypes.func,
}

Pagination.defaultProps = {
    pageSize: 1,
    currentPage: 1,
    total: 5,
    displayTotal: false,
}

export default Pagination
