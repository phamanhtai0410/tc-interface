import { removeAnalytic, runAnalyticsVerticalAction } from "actions/analytic.actions";
import { useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setChangeModalDeleteMetadata } from "store/analytics/analyticSlice";

const { DataTable } = require("components/shared")

const ActionColumn = ({ row }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const onRun = async () => {
       const response = await dispatch(runAnalyticsVerticalAction(row))
       if(response.meta.requestStatus === 'fulfilled'){
            alert("Run successfully")
       }
    }

    const onDelete = async () => {

        dispatch(setChangeModalDeleteMetadata({
            isOpen:true,
            row
        }))
        
        // const response = await dispatch(removeAnalytic(row._id))
        // if(response.meta.requestStatus === 'fulfilled'){
        //     window.location.reload()
        // }
    }

    const onUpdate = () => {
        navigate(`/pages/analytis/update/${row._id}`, {
            state: row
        })
    }

    return (
        <div className="flex justify-evenly">
            <span
                className="text-[12px] font-medium text-[#FA8C16] cursor-pointer"
                onClick={onUpdate}
            >
                Edit
            </span>

            <span
                className="text-[12px] font-medium text-[#0C72FA] cursor-pointer"
                onClick={onRun}
            >
                Run
            </span>

            <span
                className="text-[12px] font-medium text-[#F5222D] cursor-pointer"
                onClick={onDelete}
            >
                Delete
            </span>
        </div>
    )
}


const MetadataTable = ({metaData}) =>{


    const tableRef = useRef(null)

    const columns = useMemo(
        () => [
            {
                header:"#",
                accessorKey:"index"
            },
            {
                header: 'Name',
                accessorKey: 'vertical_name',
            },
            {
                header: 'Note',
                accessorKey: 'note',
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        []
    )


    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={metaData}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                // loading={loading}
                // pagingData={tableData}
                // onPaginationChange={onPaginationChange}
                // onSelectChange={onSelectChange}
                // onSort={onSort}
            />
        </>
    )
} 
export default MetadataTable;