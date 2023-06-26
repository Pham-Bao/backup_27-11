import {
    Box,
    Button,
    Grid,
    IconButton,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Component, ReactNode } from 'react';
import { ReactComponent as FilterIcon } from '../../../images/filter-icon.svg';
import { ReactComponent as UploadIcon } from '../../../images/upload.svg';
import { ReactComponent as IconSorting } from '../../../images/column-sorting.svg';
import SearchIcon from '../../../images/search-normal.svg';
import { TextTranslate } from '../../../components/TableLanguage';
import { observer } from 'mobx-react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import soQuyStore from '../../../stores/soQuyStore';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import CreateOrEditSoQuyDialog from './components/CreateOrEditSoQuyDialog';
class SoQuyScreen extends Component {
    state = {
        keyword: '',
        skipCount: 1,
        maxResultCount: 10,
        sortBy: '',
        sortType: 'desc',
        totalPage: 0,
        totalCount: 0,
        moreOpen: false,
        anchorEl: null,
        selectedRowId: null,
        isShowModal: false,
        isShowConfirmDelete: false
    };
    componentDidMount(): void {
        this.getAll();
    }
    getAll = async () => {
        await soQuyStore.getAll({
            filter: this.state.keyword,
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount,
            //idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
            sortBy: this.state.sortBy,
            sortType: this.state.sortType
        });
        this.setState({
            totalPage: Math.ceil(soQuyStore.lstSoQuy.totalCount / this.state.maxResultCount),
            totalCount: soQuyStore.lstSoQuy.totalCount
        });
    };
    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            skipCount: value
        });
        this.getAll();
    };
    onSort = async (sortType: string, sortBy: string) => {
        const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortBy: sortBy,
            sortType: type
        });
        this.getAll();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            skipCount: 1
        });
        this.getAll();
    };
    handleKeyDown = async (event: any) => {
        if (event.key === 'Enter') {
            await this.setState({
                maxResultCount: 10,
                skipCount: 1
            });
            this.getAll();
        }
    };
    render(): ReactNode {
        const columns: GridColDef[] = [
            {
                field: 'loaiPhieu',
                sortable: false,
                headerName: 'Loại phiếu',
                minWidth: 118,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'loaiPhieu');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params) => <Box title={params.value}>{params.value}</Box>
            },
            {
                field: 'maPhieu',
                sortable: false,
                headerName: 'Mã phiếu',
                minWidth: 118,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'maPhieu');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params) => <Box title={params.value}>{params.value}</Box>
            },
            {
                field: 'thoiGianTao',
                sortable: false,
                headerName: 'Thời gian',
                minWidth: 118,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'thoiGianTao');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box title={params.value}>
                        {new Date(params.value).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Box>
                )
            },
            {
                field: 'loaiThuChi',
                sortable: false,
                headerName: 'Loại thu chi',
                minWidth: 118,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'loaiThuChi');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params: any) => <Box title={params.value}>{params.value}</Box>
            },
            {
                field: 'tongTienThu',
                sortable: false,
                headerName: 'Tổng tiền',
                minWidth: 118,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'tongTienThu');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box title={params.value}>
                        {new Intl.NumberFormat('vi-VN').format(params.value)}
                    </Box>
                )
            },
            {
                field: 'hinhThucThanhToan',
                sortable: false,
                headerName: 'Hình thức',
                minWidth: 118,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'hinhThucThanhToan');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params: any) => <Box title={params.value}>{params.value}</Box>
            },
            {
                field: 'trangThai',
                sortable: false,
                headerName: 'Trạng thái',
                minWidth: 118,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting
                            onClick={() => {
                                this.onSort(this.state.sortType, 'trangThai');
                            }}
                        />
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        title={params.value}
                        sx={{
                            padding: '4px 8px',
                            borderRadius: '100px',
                            backgroundColor:
                                params.value === 'Đã thanh toán'
                                    ? '#E8FFF3'
                                    : params.value === 'Chưa thanh toán'
                                    ? '#FFF8DD'
                                    : '#FFF5F8',
                            color:
                                params.value === 'Đã thanh toán'
                                    ? '#50CD89'
                                    : params.value === 'Chưa thanh toán'
                                    ? '#FF9900'
                                    : '#F1416C'
                        }}
                        className="state-thanh-toan">
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'actions',
                headerName: 'Hành động',
                width: 48,
                flex: 0.4,
                disableColumnMenu: true,
                renderCell: (params) => (
                    <IconButton
                        aria-label="Actions"
                        aria-controls={`actions-menu-${params.row.id}`}
                        aria-haspopup="true">
                        <MoreHorizIcon />
                    </IconButton>
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
            <Box padding="16px 2.2222222222222223vw 16px 2.2222222222222223vw">
                <Grid container justifyContent="space-between">
                    <Grid item md="auto" display="flex" alignItems="center" gap="10px">
                        <Typography color="#333233" variant="h1" fontSize="16px" fontWeight="700">
                            Sổ quỹ
                        </Typography>
                        <Box className="form-search">
                            <TextField
                                size="small"
                                sx={{
                                    backgroundColor: '#FFFAFF',
                                    borderColor: '#CDC9CD!important'
                                }}
                                onChange={(e: any) => {
                                    this.setState({ keyword: e.target.value });
                                }}
                                onKeyDown={this.handleKeyDown}
                                className="search-field"
                                variant="outlined"
                                type="search"
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton type="button">
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item md="auto">
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '8px',
                                '& button': {
                                    height: '40px'
                                }
                            }}>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: '#CDC9CD!important',
                                    bgcolor: '#fff!important',
                                    color: '#333233',
                                    fontSize: '14px'
                                }}>
                                30 tháng 6, 2023 - 30 tháng 6, 2023{' '}
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<UploadIcon />}
                                sx={{
                                    borderColor: '#CDC9CD!important',
                                    bgcolor: '#fff!important',
                                    color: '#333233',
                                    fontSize: '14px'
                                }}
                                className="btn-outline-hover">
                                Xuất{' '}
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<FilterIcon />}
                                sx={{
                                    bgcolor: '#7C3367!important',
                                    color: '#fff',
                                    fontSize: '14px'
                                }}
                                className="btn-container-hover">
                                Lập phiếu
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Box marginTop="16px">
                    <DataGrid
                        autoHeight
                        columns={columns}
                        rows={soQuyStore.lstSoQuy === undefined ? [] : soQuyStore.lstSoQuy.items}
                        hideFooter
                        sx={{
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
                            },
                            '& .MuiDataGrid-columnHeadersInner': {
                                backgroundColor: '#F2EBF0'
                            },
                            '& .MuiBox-root': {
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: '12px'
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainerContent .MuiBox-root': {
                                fontWeight: '700'
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                bgcolor: '#fff'
                            },
                            '&  .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
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
                    <CreateOrEditSoQuyDialog
                        onClose={() => {
                            console.log('đóng');
                        }}
                        onOk={() => {
                            console.log('đóng');
                        }}
                        visiable={this.state.isShowModal}
                        title="Thêm mới"
                        createOrEditSoQuyDto={soQuyStore.createOrEditSoQuyDto}
                    />
                    <CustomTablePagination
                        currentPage={this.state.skipCount}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={this.state.totalCount}
                        totalPage={this.state.totalPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                </Box>
            </Box>
        );
    }
}
export default observer(SoQuyScreen);
