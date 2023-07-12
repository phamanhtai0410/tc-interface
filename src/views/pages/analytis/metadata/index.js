import { useEffect, useState } from "react";
import MetadataTable from "./components/MetadataTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchListMetadataAnalytics } from "actions/analytic.actions";
import { selectMetaData, selectOpenMetaData, setChangeModalDeleteMetadata } from "store/analytics/analyticSlice";
import { Pagination } from "components/ui";
import ModalDeleteMeta from "./components/ModalDelete";


const Metadata = () => {

    const [metaData, setMetaData] = useState([]);
    const dispatch = useDispatch()
    const numPageMetadata = useSelector(selectMetaData)
    const modalIsOpen = useSelector(selectOpenMetaData)
    const [querySize, setQuerySize] = useState({
        page: 1,
        page_size: 10
    });

    const getListMetadata = async () => {
        const response = await dispatch(fetchListMetadataAnalytics({page:querySize.page,page_size:querySize.page_size}))
        if (response.payload && response.payload.items.length > 0) {
            const metaDataUpdate = response.payload.items.map((item, index) => {
                return { ...item, index: index + 1 }
            })
            setMetaData(metaDataUpdate)
        }
    }



    useEffect(() => {
        getListMetadata()
    }, [querySize])

    const closeModal = () => {
        dispatch(setChangeModalDeleteMetadata({
            isOpen:false
        }))
    }


    return (
        <div>
            <MetadataTable metaData={metaData} />
            <div className="mt-[32px] flex justify-center">
                <Pagination currentPage={querySize.page} total={numPageMetadata.num_of_page} setQuerySize={setQuerySize} />
            </div>

            <ModalDeleteMeta modalIsOpen={modalIsOpen} closeModal={closeModal}/>
        </div>
    )
}

export default Metadata;