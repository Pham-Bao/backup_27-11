/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { useState } from 'react';
import {
    DataGrid,
    GridColDef,
    useGridApiRef,
    GridLocaleText,
    GridColumnVisibilityModel,
    ColumnsPanelPropsOverrides
} from '@mui/x-data-grid';
import { TextTranslate } from '../../components/TableLanguage';
import { format, isValid } from 'date-fns';
import {
    Button,
    ButtonGroup,
    Breadcrumbs,
    Typography,
    Grid,
    Box,
    TextField,
    IconButton,
    Select,
    MenuItem,
    Menu,
    FormControl,
    TablePagination,
    Avatar
} from '@mui/material';
import './customerPage.css';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import AddIcon from '../../images/add.svg';
import SearchIcon from '../../images/search-normal.svg';
import { ReactComponent as DateIcon } from '../../images/calendar-5.svg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import khachHangService from '../../services/khach-hang/khachHangService';
import { CreateOrEditKhachHangDto } from '../../services/khach-hang/dto/CreateOrEditKhachHangDto';
import fileDowloadService from '../../services/file-dowload.service';
import CreateOrEditCustomerDialog from './components/create-or-edit-customer-modal';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import abpCustom from '../../components/abp-custom';
import { ReactComponent as IconSorting } from '../../images/column-sorting.svg';
import AppConsts from '../../lib/appconst';
import ActionMenuTable from '../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../components/Pagination/CustomTablePagination';

class CustomerScreen extends React.Component {
    state = {
        rowTable: [],
        toggle: false,
        idkhachHang: '',
        rowPerPage: 10,
        pageSkipCount: 0,
        skipCount: 0,
        currentPage: 1,
        keyword: '',
        totalItems: 0,
        totalPage: 1,
        isShowConfirmDelete: false,
        moreOpen: false,
        anchorEl: null,
        selectedRowId: null,
        createOrEditKhachHang: {} as CreateOrEditKhachHangDto,
        visibilityColumn: {}
    };

    componentDidMount(): void {
        this.getData();
        const visibilityColumn = localStorage.getItem('visibilityColumn') ?? {};
        this.setState({ visibilityColumn: visibilityColumn });
    }

    async getData() {
        const khachHangs = await khachHangService.getAll({
            keyword: this.state.keyword,
            maxResultCount: this.state.rowPerPage,
            skipCount: this.state.currentPage,
            loaiDoiTuong: 0
        });

        this.setState({
            rowTable: khachHangs.items,
            totalItems: khachHangs.totalCount,
            totalPage: Math.ceil(khachHangs.totalCount / this.state.rowPerPage)
        });
    }
    async handleSubmit() {
        await khachHangService.createOrEdit(this.state.createOrEditKhachHang);
        this.setState({
            idkhachHang: '',
            rowPerPage: 10,
            pageSkipCount: 0,
            skipCount: 0,
            currentPage: 0,
            keyword: '',
            createOrEditKhachHang: {} as CreateOrEditKhachHangDto
        });
        this.getData();
        this.handleToggle();
    }
    handleChange = (event: any) => {
        const { name, value } = event.target;
        this.setState({
            createOrEditKhachHang: {
                ...this.state.createOrEditKhachHang,
                [name]: value
            }
        });
    };
    async createOrUpdateModalOpen(id: string) {
        if (id === '') {
            await this.setState({
                idKhachHang: '',
                createOrEditKhachHang: {}
            });
        } else {
            const createOrEdit = await khachHangService.getKhachHang(id);
            await this.setState({
                idKhachHang: id,
                createOrEditKhachHang: createOrEdit
            });
        }
        this.handleToggle();
    }
    async delete(id: string) {
        await khachHangService.delete(id);
    }
    handleToggle = () => {
        this.setState({
            toggle: !this.state.toggle
        });
    };
    exportToExcel = async () => {
        const result = await khachHangService.exportDanhSach({
            keyword: this.state.keyword,
            maxResultCount: this.state.rowPerPage,
            skipCount: this.state.skipCount,
            loaiDoiTuong: 0
        });
        fileDowloadService.downloadTempFile(result);
    };
    handlePageChange = async (event: any, newPage: number) => {
        const skip = newPage + 1;
        await this.setState({ skipCount: skip, currentPage: newPage });
        await this.getData();
    };

    // Handler for rows per page changes
    handleRowsPerPageChange = async (event: any) => {
        await this.setState({ rowPerPage: parseInt(event.target.value, 10) });
        await this.setState({ currentPage: 0, skipCount: 1 }); // Reset page to the first one when changing rows per page
        await this.getData();
    };

    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: null });
        await this.getData();
    };

    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };

    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? '');
        this.handleCloseMenu();
    };
    onOkDelete = () => {
        this.delete(this.state.selectedRowId ?? '');
        this.showConfirmDelete();
        this.handleCloseMenu();
    };
    showConfirmDelete = () => {
        // Handle Delete action
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete,
            idNhanSu: ''
        });
    };
    toggleColumnVisibility = (column: GridColumnVisibilityModel) => {
        localStorage.setItem('visibilityColumn', JSON.stringify(column));
        this.setState({ visibilityColumn: column });
    };
    render(): React.ReactNode {
        const columns: GridColDef[] = [
            {
                field: 'tenKhachHang',
                headerName: 'Tên khách hàng',
                minWidth: 185,
                flex: 1,
                renderCell: (params) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',

                            width: '100%'
                        }}
                        title={params.value}>
                        <Avatar
                            src={params.row.avatar}
                            alt="Avatar"
                            style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                        <Typography
                            sx={{
                                fontSize: '12px',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                width: '100%'
                            }}>
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
                field: 'soDienThoai',
                headerName: 'Số điện thoại',
                minWidth: 114,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'tenNhomKhach',
                headerName: 'Nhóm khách',
                minWidth: 112,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'gioiTinh',
                headerName: 'Giới tính',
                width: 89,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'nhanVienPhuTrach',
                headerName: 'Nhân viên phục vụ',
                minWidth: 185,
                flex: 1,
                renderHeader: (params) => (
                    <Box
                        sx={{
                            fontWeight: '700',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%'
                        }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'tongChiTieu',
                headerName: 'Tổng chi tiêu',
                minWidth: 113,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                ),
                renderCell: (params) => <Box title={params.value}>{params.value}</Box>
            },
            {
                field: 'cuocHenGanNhat',
                headerName: 'Cuộc hẹn gần đây',
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                        <DateIcon style={{ marginRight: 4 }} />
                        {new Date(params.value).toLocaleDateString('en-GB')}
                    </Box>
                ),
                minWidth: 128,
                flex: 1,
                renderHeader: (params) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'tenNguonKhach',
                headerName: 'Nguồn',
                minWidth: 86,
                flex: 1,
                renderCell: (params) => (
                    <div className={params.field === 'tenNguonKhach' ? 'last-column' : ''}>
                        {params.value}
                    </div>
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
                headerName: 'Hành động',
                maxWidth: 48,
                flex: 1,
                disableColumnMenu: true,

                renderCell: (params) => (
                    <Box>
                        <IconButton
                            aria-label="Actions"
                            aria-controls={`actions-menu-${params.row.id}`}
                            aria-haspopup="true"
                            onClick={(event) => {
                                this.handleOpenMenu(event, params.row.id);
                            }}>
                            <MoreHorizIcon />
                        </IconButton>
                    </Box>
                ),
                renderHeader: (params) => (
                    <Box sx={{ display: 'none' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            }
        ];
        return (
            <Box
                className="customer-page"
                paddingLeft="2.2222222222222223vw"
                paddingRight="2.2222222222222223vw"
                paddingTop="1.5277777777777777vw">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="12px">
                        <Typography color="#333233" variant="h1" fontSize="16px" fontWeight="700">
                            Danh sách khách hàng
                        </Typography>
                        <Box className="form-search">
                            <TextField
                                sx={{
                                    backgroundColor: '#FFFAFF',
                                    borderColor: '#CDC9CD'
                                }}
                                className="search-field"
                                variant="outlined"
                                type="search"
                                onChange={(e) => {
                                    this.setState({ keyword: e.target.value });
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        this.getData();
                                    }
                                }}
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton
                                            type="button"
                                            onClick={() => {
                                                this.getData();
                                            }}>
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                        <ButtonGroup
                            variant="contained"
                            sx={{ gap: '8px' }}
                            className="rounded-4px resize-height">
                            <Button
                                className="border-color"
                                variant="outlined"
                                startIcon={<img src={DownloadIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    color: '#666466',
                                    bgcolor: '#fff'
                                }}>
                                Nhập
                            </Button>
                            <Button
                                className="border-color"
                                variant="outlined"
                                onClick={() => {
                                    this.exportToExcel();
                                }}
                                startIcon={<img src={UploadIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    color: '#666466',
                                    padding: '10px 16px',
                                    borderColor: '#E6E1E6',
                                    bgcolor: '#fff'
                                }}>
                                Xuất
                            </Button>
                            <Button
                                className="bg-main"
                                onClick={this.handleToggle}
                                variant="contained"
                                startIcon={<img src={AddIcon} />}
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: '400',
                                    minWidth: '173px'
                                }}>
                                Thêm khách hàng
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
                <div
                    className="customer-page_row-2"
                    style={{
                        width: '100%',
                        marginTop: '24px',
                        backgroundColor: '#fff'
                    }}>
                    <DataGrid
                        autoHeight
                        rows={this.state.rowTable}
                        columns={columns}
                        hideFooterPagination
                        hideFooter
                        onColumnVisibilityModelChange={this.toggleColumnVisibility}
                        columnVisibilityModel={this.state.visibilityColumn}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    page: this.state.currentPage,
                                    pageSize: this.state.rowPerPage
                                }
                            }
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
                            },
                            '& .MuiDataGrid-cellContent': {
                                fontSize: '12px'
                            }
                        }}
                        localeText={TextTranslate}
                    />
                    <ActionMenuTable
                        selectedRowId={this.state.selectedRowId}
                        anchorEl={this.state.anchorEl}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleView}
                        handleEdit={this.handleEdit}
                        handleDelete={this.showConfirmDelete}
                    />
                    <CustomTablePagination
                        currentPage={this.state.currentPage}
                        rowPerPage={this.state.rowPerPage}
                        totalRecord={this.state.totalItems}
                        totalPage={this.state.totalPage}
                        handlePageChange={this.handlePageChange}
                    />
                </div>
                <div
                    className={this.state.toggle ? 'show customer-overlay' : 'customer-overlay'}
                    onClick={this.handleToggle}></div>
                <CreateOrEditCustomerDialog
                    formRef={this.state.createOrEditKhachHang}
                    onCancel={this.handleToggle}
                    onOk={() => {
                        this.handleSubmit();
                    }}
                    title={
                        this.state.idkhachHang == ''
                            ? 'Thêm mới khách hàng'
                            : 'Cập nhật thông tin khách hàng'
                    }
                    onChange={this.handleChange}
                    visible={this.state.toggle}
                />
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.showConfirmDelete}></ConfirmDelete>
            </Box>
        );
    }
}
export default CustomerScreen;
