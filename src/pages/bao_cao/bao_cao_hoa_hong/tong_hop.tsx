import { Grid, Box, Stack, Typography, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { TextTranslate } from '../../../components/TableLanguage';
import { useContext, useEffect, useRef, useState } from 'react';
import utils from '../../../utils/utils';
import {
    PageBaoCaoHoaHongTongHop,
    ParamSearchBaoCaoHoaHong
} from '../../../services/bao_cao/bao_cao_hoa_hong/BaoCaoHoaHongDto';
import { PagedResultDto } from '../../../services/dto/pagedResultDto';
import { BaoCaoHoaHongDataContextFilter } from '../../../services/bao_cao/bao_cao_hoa_hong/BaoCaoHoaHongContext';
import { LoaiBaoCao } from '../../../lib/appconst';
import BaoCaoHoaHongServices from '../../../services/bao_cao/bao_cao_hoa_hong/BaoCaoHoaHongServices';

export default function PageBaoCaoHoaHongNhanVienTongHop({ onChangePage, onChangePageSize }: any) {
    const dataFilterContext = useContext(BaoCaoHoaHongDataContextFilter);
    const [pageDataBaoCaoTongHop, setPageDataBaoCaoTongHop] = useState<PagedResultDto<PageBaoCaoHoaHongTongHop>>({
        items: [],
        totalCount: 0,
        totalPage: 0
    });

    useEffect(() => {
        if (dataFilterContext.loaiBaoCao === LoaiBaoCao.TONG_HOP) {
            GetBaoCaoHoaHongTongHop();
        }
    }, [
        dataFilterContext?.countClick,
        dataFilterContext?.filter?.currentPage,
        dataFilterContext?.filter?.pageSize,
        dataFilterContext?.filter?.fromDate,
        dataFilterContext?.filter?.toDate,
        dataFilterContext?.filter?.idChiNhanhs
    ]);

    const GetBaoCaoHoaHongTongHop = async () => {
        const data = await BaoCaoHoaHongServices.GetBaoCaoHoaHongTongHop(dataFilterContext?.filter);
        setPageDataBaoCaoTongHop({
            ...pageDataBaoCaoTongHop,
            items: data?.items,
            totalCount: data?.totalCount,
            totalPage: Math.ceil(data?.totalCount / (dataFilterContext?.filter?.pageSize ?? 10))
        });
    };

    const handlePageChange = async (event: any, value: number) => {
        onChangePage(value);
    };
    const changePageSize = async (event: SelectChangeEvent<number>) => {
        const pageSizeNew = parseInt(event.target.value.toString());
        onChangePageSize(pageSizeNew);
    };

    const columns = [
        {
            field: 'maNhanVien',
            headerName: 'Mã nhân viên',
            flex: 0.8,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'tenNhanVien',
            headerName: 'Tên nhân viên',
            flex: 1,
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{params.value}</Box>
        },
        {
            field: 'hoaHongThucHien_TienChietKhau',
            headerName: 'Thực hiện',
            flex: 0.8,
            headerAlign: 'right',
            align: 'right',
            renderHeader: (params) => <Box title={params.colDef.headerName}>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        },
        {
            field: 'hoaHongTuVan_TienChietKhau',
            headerName: 'Tư vấn',
            flex: 1,
            headerAlign: 'right',
            align: 'right',
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        },
        {
            field: 'tongHoaHong',
            headerName: 'Tổng hoa hồng',
            flex: 1,
            headerAlign: 'right',
            align: 'right',
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>,
            renderCell: (params) => <Box>{new Intl.NumberFormat('vi-VN').format(params.value)}</Box>
        }
    ] as GridColDef[];

    return (
        <>
            <Grid container paddingTop={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className="page-box-right">
                        <Box>
                            <DataGrid
                                rowHeight={46}
                                autoHeight={pageDataBaoCaoTongHop?.totalCount === 0}
                                className="data-grid-row"
                                columns={columns}
                                rows={pageDataBaoCaoTongHop?.items}
                                getRowId={(row) => row.idNhanVien}
                                disableRowSelectionOnClick
                                checkboxSelection={false}
                                hideFooterPagination
                                hideFooter
                                localeText={TextTranslate}
                            />
                        </Box>
                        <CustomTablePagination
                            currentPage={dataFilterContext?.filter?.currentPage ?? 1}
                            rowPerPage={dataFilterContext?.filter?.pageSize ?? 10}
                            totalPage={pageDataBaoCaoTongHop?.totalPage}
                            totalRecord={pageDataBaoCaoTongHop?.totalCount}
                            handlePerPageChange={changePageSize}
                            handlePageChange={handlePageChange}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
