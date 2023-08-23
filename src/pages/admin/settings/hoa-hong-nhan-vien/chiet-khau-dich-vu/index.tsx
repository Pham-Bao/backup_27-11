import {
    Button,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    Grid,
    Box,
    TextField,
    Typography,
    SelectChangeEvent,
    Autocomplete,
    InputAdornment
} from '@mui/material';
import { TextTranslate } from '../../../../../components/TableLanguage';
import { ReactComponent as IconSorting } from '../../../../../images/column-sorting.svg';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DownloadIcon from '../../../../../images/download.svg';
import UploadIcon from '../../../../../images/upload.svg';
import AddIcon from '../../../../../images/add.svg';
import SearchIcon from '../../../../../images/search-normal.svg';
import { ReactComponent as SearchIconInput } from '../../../../../images/search-normal.svg';
import { Component, ReactNode } from 'react';
import chietKhauDichVuStore from '../../../../../stores/chietKhauDichVuStore';
import SuggestService from '../../../../../services/suggests/SuggestService';
import { SuggestNhanSuDto } from '../../../../../services/suggests/dto/SuggestNhanSuDto';
import { observer } from 'mobx-react';
import AppConsts from '../../../../../lib/appconst';
import CreateOrEditChietKhauDichVuModal from './components/create-or-edit-hoa-hong';
import { CreateOrEditChietKhauDichVuDto } from '../../../../../services/hoa_hong/chiet_khau_dich_vu/Dto/CreateOrEditChietKhauDichVuDto';
import { SuggestDonViQuiDoiDto } from '../../../../../services/suggests/dto/SuggestDonViQuiDoi';
import Cookies from 'js-cookie';
import CustomTablePagination from '../../../../../components/Pagination/CustomTablePagination';
import suggestStore from '../../../../../stores/suggestStore';

class ChietKhauDichVuScreen extends Component {
    state = {
        visited: false,
        idChiNhanh: Cookies.get('IdChiNhanh') ?? '',
        idNhanVien: AppConsts.guidEmpty,
        keyword: '',
        sortBy: '',
        sortType: 'desc',
        skipCount: 1,
        maxResultCount: 10,
        totalPage: 0,
        totalCount: 0,
        createOrEditDto: { laPhanTram: false } as CreateOrEditChietKhauDichVuDto,
        suggestNhanSu: [] as SuggestNhanSuDto[],
        suggestDonViQuiDoi: [] as SuggestDonViQuiDoiDto[],
        activeButton: '',
        focusField: '',
        showButton: false
    };
    componentDidMount(): void {
        this.InitData();
    }
    async InitData() {
        const suggestNhanVien = await SuggestService.SuggestNhanSu();
        await this.setState({ suggestNhanSu: suggestNhanVien });
        // if (suggestNhanVien.length > 0) {
        //     await this.setState({ idNhanVien: suggestNhanVien[0].id });
        // }
        const suggestDonViQuiDoi = await SuggestService.SuggestDonViQuiDoi();
        await this.setState({ suggestDonViQuiDoi: suggestDonViQuiDoi });
        await this.getDataAccordingByNhanVien(this.state.idNhanVien);
    }
    getDataAccordingByNhanVien = async (idNhanVien: any) => {
        await chietKhauDichVuStore.getAccordingByNhanVien(
            {
                keyword: this.state.keyword,
                maxResultCount: this.state.maxResultCount,
                skipCount: this.state.skipCount,
                sortBy: this.state.sortBy,
                sortType: this.state.sortType
            },
            idNhanVien ?? AppConsts.guidEmpty
        );
    };
    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            skipCount: value
        });
        this.InitData();
    };
    handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        await this.setState({
            maxResultCount: parseInt(event.target.value.toString(), 10),
            skipCount: 1
        });
        this.InitData();
    };
    handleSubmit = async () => {
        await this.getDataAccordingByNhanVien(this.state.idNhanVien);
        this.onModal();
    };
    onModal = () => {
        this.setState({ visited: !this.state.visited });
    };
    onCloseModal = () => {
        this.setState({ visited: false });
    };

    onSort = async (sortType: string, sortBy: string) => {
        const type = sortType === 'desc' ? 'asc' : 'desc';
        await this.setState({
            sortType: type,
            sortBy: sortBy
        });
        this.getDataAccordingByNhanVien(this.state.idNhanVien);
    };
    handleButtonClick = (rowId: number, buttonType: string) => {
        this.setState((prevState) => ({
            ...prevState,
            activeButton: {
                ...prevState,
                [rowId]: buttonType
            }
        }));
    };
    onFocus = (RowId: number) => {
        this.setState({
            focusField: RowId
        });
    };
    render(): ReactNode {
        const { listChietKhauDichVu } = chietKhauDichVuStore;

        const columns: GridColDef[] = [
            {
                field: 'tenDichVu',
                sortable: false,
                headerName: 'Tên dịch vụ ',
                minWidth: 140,
                flex: 1,
                renderCell: (params: any) => (
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '13px',
                            width: '100%'
                        }}
                        title={params.value}>
                        <Typography
                            fontSize="13px"
                            fontFamily={'Roboto'}
                            fontWeight={400}
                            textAlign={'left'}
                            sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                width: '100%'
                            }}>
                            {params.value}
                        </Typography>
                    </Box>
                ),
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'tenDichVu');
                            }}
                        />
                    </Box>
                )
            },
            {
                field: 'tenNhomDichVu',
                sortable: false,
                headerName: 'Nhóm dịch vụ',
                minWidth: 114,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'tenNhomDichVu');
                            }}
                        />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        title={params.value}
                        sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%',
                            fontSize: '13px',
                            fontWeight: 400,
                            fontFamily: 'Roboto',
                            textAlign: 'left'
                        }}>
                        {params.value}
                    </Box>
                )
            },
            {
                field: 'hoaHongThucHien',
                sortable: false,
                headerName: 'Hoa hồng thực hiện',
                minWidth: 150,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'hoaHongThucHien');
                            }}
                        />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <TextField
                        type="text"
                        defaultValue="0"
                        value={
                            params.value === 0
                                ? '0'
                                : params.row.laPhanTram === true
                                ? params.value.toString() + ' %'
                                : params.value.toString() + ' VNĐ'
                        }
                        sx={{
                            height: '85%',
                            '&>div': {
                                height: '100%'
                            },
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                                {
                                    appearance: 'none'
                                },
                            '& .MuiOutlinedInput-root': {
                                paddingRight: '8px'
                            },
                            fontSize: '13px',
                            fontWeight: '400',
                            fontFamily: 'Roboto'
                        }}
                    />
                )
            },
            {
                field: 'hoaHongYeuCauThucHien',
                sortable: false,
                headerName: 'Hoa hồng theo yêu cầu',
                minWidth: 170,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'hoaHongYeuCauThucHien');
                            }}
                        />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <TextField
                        type="text"
                        defaultValue="0"
                        value={
                            params.value === 0
                                ? '0'
                                : params.row.laPhanTram === true
                                ? params.value + ' %'
                                : params.value + ' VNĐ'
                        }
                        sx={{
                            height: '85%',
                            fontSize: '13px',
                            fontWeight: '400',
                            fontFamily: 'Roboto',
                            '&>div': {
                                height: '100%'
                            },
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                                {
                                    appearance: 'none'
                                },
                            '& .MuiOutlinedInput-root': {
                                paddingRight: '8px'
                            }
                        }}
                    />
                )
            },
            {
                field: 'hoaHongTuVan',
                sortable: false,
                headerName: 'Hoa hồng tư vấn',
                minWidth: 130,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'hoaHongTuVan');
                            }}
                        />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <TextField
                        type="text"
                        defaultValue="0"
                        value={
                            params.value === 0
                                ? '0'
                                : params.row.laPhanTram === true
                                ? params.value + ' %'
                                : params.value + ' VNĐ'
                        }
                        sx={{
                            fontSize: '13px',
                            fontWeight: '400',
                            fontFamily: 'Roboto',
                            height: '85%',
                            '&>div': {
                                height: '100%'
                            },
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                                {
                                    appearance: 'none'
                                },
                            '& .MuiOutlinedInput-root': {
                                paddingRight: '8px'
                            }
                        }}
                    />
                )
            },
            {
                field: 'giaDichVu',
                sortable: false,
                headerName: 'Giá bán',
                minWidth: 85,
                flex: 0.6,
                renderHeader: (params: any) => (
                    <Box
                        sx={{
                            fontWeight: '700',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%'
                        }}>
                        {params.colDef.headerName}
                        <IconSorting
                            className="custom-icon"
                            onClick={() => {
                                this.onSort(this.state.sortType, 'giaDichVu ');
                            }}
                        />{' '}
                    </Box>
                ),
                renderCell: (params: any) => (
                    <Box
                        title={params.value}
                        sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: '100%',
                            fontSize: '13px',
                            fontWeight: '400',
                            fontFamily: 'Roboto',
                            textAlign: 'right'
                        }}>
                        {params.value}
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
                            aria-haspopup="true">
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
            <div>
                <Grid
                    container
                    sx={{
                        height: '48px',
                        background: '#EEF0F4',
                        alignItems: 'center',
                        paddingX: '8px'
                    }}>
                    <Grid item xs={3}>
                        <Autocomplete
                            options={this.state.suggestNhanSu}
                            getOptionLabel={(option) => `${option.tenNhanVien}`}
                            size="small"
                            sx={{ width: '75%' }}
                            fullWidth
                            disablePortal
                            onChange={async (event, value) => {
                                await this.setState({ idNhanVien: value?.id });
                                await this.getDataAccordingByNhanVien(value?.id);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    sx={{ bgcolor: '#fff' }}
                                    {...params}
                                    placeholder="Tìm tên"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                {params.InputProps.startAdornment}
                                                <InputAdornment position="start">
                                                    <SearchIconInput />
                                                </InputAdornment>
                                            </>
                                        )
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={9}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: 'end'
                        }}>
                        <Box>
                            <TextField
                                type="text"
                                size="small"
                                sx={{
                                    '& input': { bgcolor: '#fff' },
                                    '& .MuiInputBase-root': { pl: '0', bgcolor: '#fff' }
                                }}
                                placeholder="Tìm kiếm"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton type="button" sx={{ bgcolor: '#fff' }}>
                                            <img src={SearchIcon} />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>
                        <Box
                            display="flex"
                            gap="8px"
                            justifyContent="end"
                            sx={{
                                '& button:not(.btn-container-hover)': {
                                    color: '#666466!important',
                                    bgcolor: '#fff!important',
                                    boxShadow: 'none!important',
                                    borderColor: '#ede4ea',
                                    textTransform: 'unset!important',
                                    fontWeight: '400'
                                }
                            }}>
                            <Button
                                startIcon={<img src={DownloadIcon} />}
                                variant="outlined"
                                className="btn-outline-hover">
                                Nhập
                            </Button>
                            <Button
                                startIcon={<img src={UploadIcon} />}
                                variant="outlined"
                                className="btn-outline-hover">
                                Xuất
                            </Button>
                            <Button
                                startIcon={<img src={AddIcon} />}
                                variant="contained"
                                sx={{ bgcolor: '#7C3367' }}
                                onClick={() => {
                                    this.onModal();
                                }}
                                className="btn-container-hover">
                                Thêm mới
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Box marginTop="8px">
                    <DataGrid
                        disableRowSelectionOnClick
                        autoHeight
                        columns={columns}
                        rows={listChietKhauDichVu === undefined ? [] : listChietKhauDichVu.items}
                        checkboxSelection={false}
                        sx={{
                            '& .uiDataGrid-cellContent': {
                                fontSize: '13px'
                            },
                            '& p': {
                                mb: 0
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                bgcolor: '#fff'
                            },
                            '& .MuiDataGrid-columnHeader': {
                                background: '#FFF'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                borderBottom: '1px solid #CDC9CD',
                                bgcolor: '#fff'
                            },
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
                            },
                            '& + .MuiTablePagination-root': {
                                display: 'none'
                            },
                            '& .MuiDataGrid-columnHeaderCheckbox:focus': {
                                outline: 'none!important'
                            },
                            '&  .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
                                outline: 'none '
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainer:hover': {
                                color: 'var(--color-main)'
                            },
                            '& .MuiDataGrid-columnHeaderTitleContainer svg path:hover': {
                                fill: 'var(--color-main)'
                            },
                            '& [aria-sort="ascending"] .MuiDataGrid-columnHeaderTitleContainer svg path::nth-of-type(2)':
                                {
                                    fill: '#000'
                                },
                            '& [aria-sort="descending"] .MuiDataGrid-columnHeaderTitleContainer svg path::nth-of-type(1)':
                                {
                                    fill: '#000'
                                },
                            '& .Mui-checked, &.MuiCheckbox-indeterminate': {
                                color: 'var(--color-main)!important'
                            },
                            '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within':
                                {
                                    outline: 'none'
                                },
                            '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover,.MuiDataGrid-row.Mui-selected.Mui-hovered':
                                {
                                    bgcolor: 'var(--color-bg)'
                                }
                        }}
                        localeText={TextTranslate}
                        hideFooter
                    />
                    <CustomTablePagination
                        currentPage={this.state.skipCount}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={
                            listChietKhauDichVu === undefined ? 0 : listChietKhauDichVu.totalCount
                        }
                        totalPage={
                            listChietKhauDichVu === undefined
                                ? 0
                                : Math.ceil(
                                      listChietKhauDichVu.totalCount / this.state.maxResultCount
                                  )
                        }
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageChange={this.handlePageChange}
                    />
                </Box>
                <CreateOrEditChietKhauDichVuModal
                    formRef={this.state.createOrEditDto}
                    onClose={this.onCloseModal}
                    onSave={this.handleSubmit}
                    idNhanVien={this.state.idNhanVien}
                    suggestDonViQuiDoi={this.state.suggestDonViQuiDoi}
                    visited={this.state.visited}
                    title="Thêm mới"
                />
            </div>
        );
    }
}
export default observer(ChietKhauDichVuScreen);
