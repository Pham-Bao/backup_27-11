import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
    Grid,
    Box,
    Typography,
    TextField,
    Stack,
    Button,
    Pagination,
    IconButton
} from '@mui/material';
import { Add, FileDownload, FileUpload, Search } from '@mui/icons-material';

import { ReactComponent as IconSorting } from '../../images/column-sorting.svg';
import { ReactComponent as ClockIcon } from '../../images/clock.svg';
// prop for send data from parent to child
import { PropModal, PropConfirmOKCancel } from '../../utils/PropParentToChild';
import { TextTranslate } from '../../components/TableLanguage';
/* custom component */
import BreadcrumbsPageTitle from '../../components/Breadcrumbs/PageTitle';
import AccordionNhomHangHoa from '../../components/Accordion/NhomHangHoa';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import { OptionPage } from '../../components/Pagination/OptionPage';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import ActionViewEditDelete from '../../components/Menu/ActionViewEditDelete';

import { ModalNhomHangHoa } from './ModalGroupProduct';
import { ModalHangHoa } from './ModalProduct';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import ProductService from '../../services/product/ProductService';
import GroupProductService from '../../services/product/GroupProductService';
import {
    ModelNhomHangHoa,
    ModelHangHoaDto,
    PagedProductSearchDto
} from '../../services/product/dto';

import Utils from '../../utils/utils'; // func common
import AppConsts from '../../lib/appconst';

import '../../App.css';
import './style.css';

export default function PageProductNew() {
    const [rowHover, setRowHover] = useState<ModelHangHoaDto>();
    const [inforDeleteProduct, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const [triggerModalProduct, setTriggerModalProduct] = useState<PropModal>(
        new PropModal({ isShow: false })
    );
    const [triggerModalNhomHang, setTriggerModalNhomHang] = useState<PropModal>(
        new PropModal({ isShow: false })
    );

    const [lstProductGroup, setLstProductGroup] = useState<ModelNhomHangHoa[]>([]);
    const [treeNhomHangHoa, setTreeNhomHangHoa] = useState<ModelNhomHangHoa[]>([]);

    const [pageDataProduct, setPageDataProduct] = useState<PagedResultDto<ModelHangHoaDto>>({
        totalCount: 0,
        totalPage: 0,
        items: []
    });

    const [filterPageProduct, setFilterPageProduct] = useState<PagedProductSearchDto>({
        idNhomHangHoas: '',
        textSearch: '',
        currentPage: 1,
        pageSize: AppConsts.pageOption[0].value,
        columnSort: '',
        typeSort: ''
    });

    const GetListHangHoa = async () => {
        const list = await ProductService.Get_DMHangHoa(filterPageProduct);
        setPageDataProduct({
            totalCount: list.totalCount,
            totalPage: Utils.getTotalPage(list.totalCount, filterPageProduct.pageSize),
            items: list.items
        });
        console.log('list ', list);
    };

    const GetListNhomHangHoa = async () => {
        const list = await GroupProductService.GetDM_NhomHangHoa();
        setLstProductGroup(list.items);
    };

    const GetTreeNhomHangHoa = async () => {
        const list = await GroupProductService.GetTreeNhomHangHoa();
        const obj = new ModelNhomHangHoa({
            id: '',
            tenNhomHang: 'Tất cả',
            color: '#7C3367'
        });
        console.log('tree ', list.items);
        setTreeNhomHangHoa([obj, ...list.items]);
    };

    const PageLoad = () => {
        GetListNhomHangHoa();
        GetTreeNhomHangHoa();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        GetListHangHoa();
    }, [
        filterPageProduct.currentPage,
        filterPageProduct.pageSize,
        filterPageProduct.idNhomHangHoas
    ]);

    function showModalAddNhomHang(id = '') {
        setTriggerModalNhomHang({
            isShow: true,
            isNew: Utils.checkNull(id),
            id: id
        });
    }

    function showModalAddProduct(action?: number, id = '') {
        setTriggerModalProduct((old: any) => {
            return {
                ...old,
                isShow: true,
                isNew: Utils.checkNull(id),
                id: id
            };
        });
    }

    const editNhomHangHoa = (isEdit: any, item: ModelNhomHangHoa) => {
        if (isEdit) {
            setTriggerModalNhomHang({
                isShow: true,
                isNew: Utils.checkNull(item.id),
                id: item.id,
                item: item
            });
        } else {
            setFilterPageProduct({ ...filterPageProduct, idNhomHangHoas: item.id });
            setTriggerModalProduct((old: any) => {
                return {
                    ...old,
                    isShow: false,
                    item: { ...old.item, idNhomHangHoa: item.id }
                };
            });
        }
    };

    function saveNhomHang(objNew: ModelNhomHangHoa, isDelete = false) {
        if (isDelete) {
            setObjAlert({
                show: true,
                type: 1,
                mes: 'Xóa ' + objNew.sLoaiNhomHang + ' thành công'
            });
        } else {
            if (triggerModalNhomHang.isNew) {
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: 'Thêm ' + objNew.sLoaiNhomHang + ' thành công'
                });
            } else {
                setObjAlert({
                    show: true,
                    type: 1,
                    mes: 'Cập nhật ' + objNew.sLoaiNhomHang + ' thành công'
                });
            }
        }

        GetTreeNhomHangHoa();
    }

    function saveProduct(objNew: ModelHangHoaDto, type = 1) {
        // 1.insert, 2.update, 3.delete, 4.khoiphuc
        console.log('saveProduct ', objNew);
        const sLoai = objNew.tenLoaiHangHoa?.toLocaleLowerCase();
        switch (type) {
            case 1:
                setPageDataProduct((olds) => {
                    return {
                        ...olds,
                        totalCount: olds.totalCount + 1,
                        totalPage: Utils.getTotalPage(
                            olds.totalCount + 1,
                            filterPageProduct.pageSize
                        ),
                        items: [objNew, ...olds.items]
                    };
                });
                setObjAlert({ show: true, type: 1, mes: 'Thêm ' + sLoai + ' thành công' });
                break;
            case 2:
                GetListHangHoa();
                setObjAlert({ show: true, type: 1, mes: 'Sửa ' + sLoai + '  thành công' });
                break;
            case 3:
                deleteProduct();
                break;
            case 4:
                restoreProduct();
                setObjAlert({ show: true, type: 1, mes: 'Khôi phục ' + sLoai + '  thành công' });
                break;
        }
    }

    const handleChangePage = (event: any, value: number) => {
        setFilterPageProduct({
            ...filterPageProduct,
            currentPage: value
        });
    };
    const changeNumberOfpage = (sizePage: number) => {
        setFilterPageProduct({
            ...filterPageProduct,
            pageSize: sizePage
        });
    };

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };

    const hanClickIconSearch = () => {
        if (filterPageProduct.currentPage !== 1) {
            setFilterPageProduct({
                ...filterPageProduct,
                currentPage: 1
            });
        } else {
            GetListHangHoa();
        }
    };

    const doActionRow = (action: any, rowItem: any) => {
        setRowHover(rowItem);
        if (action < 2) {
            showModalAddProduct(action, rowItem?.idDonViQuyDoi);
        } else {
            setInforDeleteProduct(
                new PropConfirmOKCancel({
                    show: true,
                    title: 'Xác nhận xóa',
                    mes: `Bạn có chắc chắn muốn xóa dịch vụ  ${rowItem?.maHangHoa ?? ' '} không?`
                })
            );
        }
    };
    console.log('page');

    const deleteProduct = async () => {
        if (!Utils.checkNull(rowHover?.idDonViQuyDoi)) {
            await ProductService.DeleteProduct_byIDHangHoa(rowHover?.id ?? '');
            setObjAlert({
                show: true,
                type: 1,
                mes: 'Xóa ' + rowHover?.tenLoaiHangHoa?.toLocaleLowerCase() + ' thành công'
            });
            setInforDeleteProduct({ ...inforDeleteProduct, show: false });
            setPageDataProduct((olds) => {
                return {
                    ...olds,
                    // neu sau nay khong can lay hang ngung kinhdoanh --> bo comment doan nay
                    // totalCount: olds.totalCount - 1,
                    // totalPage: Utils.getTotalPage(olds.totalCount - 1, filterPageProduct.pageSize),
                    items: olds.items.map((x: any) => {
                        if (x.idDonViQuyDoi === rowHover?.idDonViQuyDoi) {
                            return { ...x, trangThai: 0, txtTrangThaiHang: 'Ngừng kinh doanh' };
                        } else {
                            return x;
                        }
                    })
                };
            });
        }
    };

    const restoreProduct = async () => {
        await ProductService.DeleteProduct_byIDHangHoa(rowHover?.id ?? '');
        setObjAlert({
            show: true,
            type: 1,
            mes: 'Khôi phục ' + rowHover?.tenLoaiHangHoa?.toLocaleLowerCase() + ' thành công'
        });
        setInforDeleteProduct({ ...inforDeleteProduct, show: false });
        setPageDataProduct((olds) => {
            return {
                ...olds,
                // neu sau nay khong can lay hang ngung kinhdoanh --> bo comment doan nay
                // totalCount: olds.totalCount - 1,
                // totalPage: Utils.getTotalPage(olds.totalCount - 1, filterPageProduct.pageSize),
                items: olds.items.map((x: any) => {
                    if (x.idDonViQuyDoi === rowHover?.idDonViQuyDoi) {
                        return { ...x, trangThai: 1, txtTrangThaiHang: 'Đang kinh doanh' };
                    } else {
                        return x;
                    }
                })
            };
        });
    };

    const columns: GridColDef[] = [
        {
            field: 'maHangHoa',
            headerName: 'Mã dịch vụ',

            minWidth: 100,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    fontSize="12px"
                    variant="body2"
                    color="#333233"
                    sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {params.value}
                </Typography>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'tenHangHoa',
            headerName: 'Tên dịch vụ',
            headerAlign: 'center',
            minWidth: 250,
            renderCell: (params) => (
                <Box display="flex" width="100%">
                    <Typography
                        fontSize="12px"
                        variant="body2"
                        color="#333233"
                        title={params.value}
                        sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {params.value}
                    </Typography>
                </Box>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'tenNhomHang',
            headerName: 'Nhóm dịch vụ',
            minWidth: 176,
            flex: 1,
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'giaBan',
            headerName: 'Giá bán',
            headerAlign: 'center',
            align: 'right',
            minWidth: 100,
            flex: 1,
            renderCell: (params) => (
                <Box display="flex">
                    <Typography variant="body2" color="#333233" fontSize="12px">
                        {Utils.formatNumber(params.value)}
                    </Typography>
                </Box>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'soPhutThucHien',
            headerName: 'Thời gian',
            minWidth: 128,
            flex: 1,
            renderCell: (params) => (
                <Box display="flex">
                    <ClockIcon />
                    <Typography variant="body2" color="#333233" marginLeft="9px" fontSize="12px">
                        {params.value} phút
                    </Typography>
                </Box>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'txtTrangThaiHang',
            headerName: 'Trạng thái',
            headerAlign: 'center',
            minWidth: 130,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '1000px',
                        backgroundColor: '#F1FAFF',
                        color: params.row.trangThai === 0 ? '#b16827' : '#009EF7'
                    }}>
                    {params.value}
                </Typography>
            ),
            renderHeader: (params) => (
                <Box sx={{ fontWeight: '700' }}>
                    {params.colDef.headerName}
                    <IconSorting className="custom-icon" />{' '}
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: '#',
            headerAlign: 'center',
            maxWidth: 60,
            flex: 1,
            disableColumnMenu: true,

            renderCell: (params) => (
                <ActionViewEditDelete
                    handleAction={(action: any) => doActionRow(action, params.row)}
                />
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        }
    ];

    return (
        <>
            <ModalNhomHangHoa
                dataNhomHang={lstProductGroup}
                trigger={triggerModalNhomHang}
                handleSave={saveNhomHang}></ModalNhomHangHoa>
            <ModalHangHoa
                dataNhomHang={lstProductGroup}
                trigger={triggerModalProduct}
                handleSave={saveProduct}></ModalHangHoa>
            <ConfirmDelete
                isShow={inforDeleteProduct.show}
                title={inforDeleteProduct.title}
                mes={inforDeleteProduct.mes}
                onOk={deleteProduct}
                onCancel={() =>
                    setInforDeleteProduct({ ...inforDeleteProduct, show: false })
                }></ConfirmDelete>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}></SnackbarAlert>
            <Grid
                container
                className="dich-vu-page"
                padding="24px 2.2222222222222223vw 24px 2.2222222222222223vw"
                gap={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="10px">
                        <Typography color="#333233" fontSize="16px" variant="h5" fontWeight="700">
                            Danh mục dịch vụ
                        </Typography>
                        <Box>
                            <TextField
                                size="small"
                                sx={{
                                    backgroundColor: '#FFFAFF'
                                }}
                                variant="outlined"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: <Search onClick={hanClickIconSearch} />
                                }}
                                onChange={(event) =>
                                    setFilterPageProduct((itemOlds: any) => {
                                        return {
                                            ...itemOlds,
                                            textSearch: event.target.value
                                        };
                                    })
                                }
                                onKeyDown={(event) => {
                                    handleKeyDownTextSearch(event);
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<FileUpload />}
                            className="btnNhapXuat">
                            Nhập
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<FileDownload />}
                            className="btnNhapXuat">
                            Xuất
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            className="button-container"
                            sx={{
                                minWidth: '143px',
                                backgroundColor: '#7c3367!important',
                                fontSize: '14px'
                            }}
                            startIcon={<Add />}
                            onClick={() => showModalAddProduct()}>
                            Thêm dịch vụ
                        </Button>
                    </Grid>
                </Grid>
                <Grid container columnSpacing={2}>
                    <Grid item lg={3} md={3} sm={4} xs={12}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                minHeight: '100%'
                            }}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                borderBottom="1px solid #E6E1E6"
                                padding="16px 24px">
                                <Typography fontSize="18px" fontWeight="700">
                                    Nhóm dịch vụ
                                </Typography>
                                <Add
                                    className="button-container"
                                    sx={{
                                        height: '30px',
                                        cursor: 'pointer',
                                        width: '30px',
                                        borderRadius: '4px',
                                        padding: '4px'
                                    }}
                                    onClick={() => showModalAddNhomHang()}
                                />
                            </Box>
                            <Box sx={{ overflow: 'auto', maxHeight: '400px' }}>
                                <AccordionNhomHangHoa
                                    dataNhomHang={treeNhomHangHoa}
                                    clickTreeItem={editNhomHangHoa}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={9} md={9} sm={8} xs={12}>
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                minHeight: '100%',
                                position: 'relative'
                            }}>
                            <DataGrid
                                autoHeight
                                rows={pageDataProduct.items}
                                columns={columns}
                                hideFooter
                                checkboxSelection
                                sx={{
                                    border: 'none!important',
                                    '& .MuiDataGrid-iconButtonContainer': {
                                        display: 'none'
                                    },
                                    '& .MuiDataGrid-cellContent': {
                                        fontSize: '12px'
                                    },
                                    '& .MuiDataGrid-columnHeaderCheckbox:focus': {
                                        outline: 'none!important'
                                    },
                                    '&  .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus':
                                        {
                                            outline: 'none '
                                        },
                                    '& .MuiDataGrid-columnHeaderTitleContainer:hover': {
                                        color: '#7C3367'
                                    },
                                    '& .MuiDataGrid-columnHeaderTitleContainer svg path:hover': {
                                        fill: '#7C3367'
                                    },
                                    '& [aria-sort="ascending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-child(2)':
                                        {
                                            fill: '#000'
                                        },
                                    '& [aria-sort="descending"] .MuiDataGrid-columnHeaderTitleContainer svg path:nth-child(1)':
                                        {
                                            fill: '#000'
                                        },
                                    '& .Mui-checked, &.MuiCheckbox-indeterminate': {
                                        color: '#7C3367!important'
                                    },
                                    '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within':
                                        {
                                            outline: 'none'
                                        },
                                    '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover,.MuiDataGrid-row.Mui-selected.Mui-hovered':
                                        {
                                            bgcolor: '#f2ebf0'
                                        }
                                }}
                                localeText={TextTranslate}
                            />

                            <Grid
                                container
                                style={{
                                    display: pageDataProduct.totalCount > 0 ? 'flex' : 'none',
                                    paddingLeft: '16px',
                                    // position: 'absolute',
                                    bottom: '16px'
                                }}>
                                <Grid item xs={4} md={4} lg={4} sm={4}>
                                    <OptionPage
                                        changeNumberOfpage={changeNumberOfpage}
                                        totalRow={pageDataProduct.totalCount}
                                    />
                                </Grid>
                                <Grid item xs={8} md={8} lg={8} sm={8}>
                                    <Stack direction="row" style={{ float: 'right' }}>
                                        <LabelDisplayedRows
                                            currentPage={filterPageProduct.currentPage}
                                            pageSize={filterPageProduct.pageSize}
                                            totalCount={pageDataProduct.totalCount}
                                        />
                                        <Pagination
                                            shape="rounded"
                                            // color="primary"
                                            count={pageDataProduct.totalPage}
                                            page={filterPageProduct.currentPage}
                                            defaultPage={filterPageProduct.currentPage}
                                            onChange={handleChangePage}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
