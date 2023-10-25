import {
    Grid,
    Typography,
    TextField,
    IconButton,
    Button,
    ButtonGroup,
    Autocomplete,
    InputAdornment,
    SelectChangeEvent
} from '@mui/material';
import DownloadIcon from '../../../images/download.svg';
import UploadIcon from '../../../images/upload.svg';
import AddIcon from '../../../images/add.svg';
import SearchIcon from '../../../images/search-normal.svg';
import { Box } from '@mui/system';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import CustomTablePagination from '../../../components/Pagination/CustomTablePagination';
import { TextTranslate } from '../../../components/TableLanguage';
import { BaoCaoBanHangTongHopDto } from '../../../services/bao_cao/bao_cao_ban_hang/dto/BaoCaoBanHangTongHopDto';
import suggestStore from '../../../stores/suggestStore';
import { observer } from 'mobx-react';
import Cookies from 'js-cookie';
import baoCaoService from '../../../services/bao_cao/bao_cao_ban_hang/baoCaoService';
import fileDowloadService from '../../../services/file-dowload.service';
import { endOfMonth, format as formatDate, startOfMonth } from 'date-fns';
import DateTimeFilterCustom from '../components/DateTimeFilterCustom';
import { BaoCaoLichHenDto } from '../../../services/bao_cao/bao_cao_ban_hang/dto/BaoCaoLichHen';
import AppConsts from '../../../lib/appconst';
import TrangThaiBooking from '../../../enum/TrangThaiBooking';
const HOM_NAY = 'Hôm nay';
const HOM_QUA = 'Hôm qua';
const TUAN_NAY = 'Tuần này';
const TUAN_TRUOC = 'Tuần trước';
const THANG_NAY = 'Tháng này';
const THANG_TRUOC = 'Tháng trước';
const QUY_NAY = 'Quý này';
const QUY_TRUOC = 'Quý trước';
const NAM_NAY = 'Năm này';
const NAM_TRUOC = 'Năm trước';
const TUY_CHON = 'Tùy chọn';
const BaoCaoDatLichPage = () => {
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [maxResultCount, setMaxResultCount] = useState<number>(10);
    const [sortBy, setSortBy] = useState('bookingDate');
    const [sortType, setSortType] = useState('desc');
    const [timeFrom, setTimeFrom] = useState<Date>(startOfMonth(new Date()));
    const [timeTo, setTimeTo] = useState<Date>(endOfMonth(new Date()));
    const [dateTimeType, setDateTimeType] = useState(THANG_NAY);
    const [idDichVu, setIdDichVu] = useState('');
    const [idKhachHang, setIdKhachHang] = useState('');
    const [idChiNhanh, setIdChiNhanh] = useState(Cookies.get('IdChiNhanh') ?? '');
    const [trangThai, setTrangThai] = useState(-1);
    const [dataRow, setDataRow] = useState<BaoCaoLichHenDto[]>([]);
    const [totalPage, setTotalPage] = useState(1);
    const [totalDataRow, setTotalDataRow] = useState(1);
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLButtonElement | null>(null);
    const [disableSelectDate, setDisableSelectDate] = useState(true);
    useEffect(() => {
        getSuggest();
    }, []);
    const getSuggest = async () => {
        await suggestStore.getSuggestDichVu();
        await suggestStore.getSuggestKhachHang();
        await suggestStore.getSuggestChiNhanhByUser();
    };
    const getData = async () => {
        const result = await baoCaoService.getBaoCaoLichHen({
            filter: filter,
            idChiNhanh: idChiNhanh === '' ? undefined : idChiNhanh,
            idDichVu: idDichVu === '' ? undefined : idDichVu,
            idKhachHang: idKhachHang === '' ? undefined : idKhachHang,
            trangThai: trangThai === -1 ? undefined : trangThai,
            maxResultCount: maxResultCount,
            skipCount: currentPage,
            timeFrom: formatDate(timeFrom, 'yyyy/MM/dd HH:mm:ss'),
            timeTo: formatDate(timeTo, 'yyyy/MM/dd HH:mm:ss'),
            sortBy: sortBy,
            sortType: sortType
        });
        setDataRow(result.items);
        setTotalDataRow(result.totalCount);
        setTotalPage(Math.ceil(result.totalCount / maxResultCount));
    };
    useEffect(() => {
        setDataRow([]);
        getData();
    }, [currentPage, maxResultCount, sortBy, sortType, idDichVu, idKhachHang, idChiNhanh, trangThai]);
    const handlePageChange = async (event: any, value: number) => {
        setCurrentPage(value);
    };
    const handlePerPageChange = async (event: SelectChangeEvent<number>) => {
        setMaxResultCount(parseInt(event.target.value.toString(), 10));
        setCurrentPage(1);
    };
    const handleCloseDateSelect = () => {
        setAnchorDateEl(null);
    };
    const handleOpenDateSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorDateEl(event.currentTarget);
    };

    const onSort = async (sortType: string, sortBy: string) => {
        setSortBy(sortBy);
        setSortType(sortType);
    };
    const exportToExcel = async () => {
        const result = await baoCaoService.exportBaoCaoLichHen({
            filter: filter,
            idChiNhanh: idChiNhanh === '' ? undefined : idChiNhanh,
            idDichVu: idDichVu === '' ? undefined : idDichVu,
            idKhachHang: idKhachHang === '' ? undefined : idKhachHang,
            trangThai: trangThai === -1 ? undefined : trangThai,
            maxResultCount: maxResultCount,
            skipCount: currentPage,
            timeFrom: formatDate(timeFrom, 'yyyy/MM/dd HH:mm:ss'),
            timeTo: formatDate(timeTo, 'yyyy/MM/dd HH:mm:ss'),
            sortBy: sortBy,
            sortType: sortType
        });
        fileDowloadService.downloadExportFile(result);
    };
    const columns: GridColDef[] = [
        {
            field: 'bookingDate',
            headerName: 'Ngày',
            minWidth: 100,
            flex: 0.8,
            renderHeader: (params) => <Box sx={{ fontWeight: '700' }}>{params.colDef.headerName}</Box>,
            renderCell: (params) => (
                <Typography
                    fontSize="13px"
                    fontWeight="400"
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {formatDate(new Date(params.value), 'dd/MM/yyyy HH:mm')}
                </Typography>
            )
        },
        {
            field: 'tenKhachHang',
            headerName: 'Tên khách hàng',
            minWidth: 150,
            flex: 0.8,
            renderCell: (params) => (
                <Typography
                    fontSize="13px"
                    fontWeight="400"
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {params.value}
                </Typography>
            ),
            renderHeader: (params) => <Box>{params.colDef.headerName}</Box>
        },
        {
            field: 'soDienThoai',
            headerName: 'SĐT khách hàng',
            minWidth: 90,
            flex: 0.7,
            renderCell: (params) => (
                <Typography
                    fontSize="13px"
                    fontWeight="400"
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {params.value}
                </Typography>
            ),
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '500',
                        fontSize: '13px',
                        fontFamily: 'Roboto'
                    }}>
                    {params.colDef.headerName}
                </Box>
            )
        },
        {
            field: 'tenHangHoa',
            headerName: 'Tên dịch vụ',
            minWidth: 150,
            flex: 1,
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '500',
                        fontSize: '13px',
                        fontFamily: 'Roboto'
                    }}>
                    {params.colDef.headerName}
                </Box>
            ),
            renderCell: (params) => (
                <Typography
                    fontSize="13px"
                    fontWeight="400"
                    sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'trangThai',
            headerName: 'Trạng thái',
            minWidth: 70,
            flex: 1,
            renderCell: (params) => {
                switch (params.value) {
                    case TrangThaiBooking.Cancel:
                        return (
                            <Typography
                                borderRadius="12px"
                                padding={'4px 8px'}
                                sx={{
                                    backgroundColor: '#F1416C1a',
                                    color: '#F1416C'
                                }}
                                fontSize="13px"
                                fontWeight="400">
                                Hủy
                            </Typography>
                        );
                    case TrangThaiBooking.Confirm:
                        return (
                            <Typography
                                borderRadius="12px"
                                padding={'4px 8px'}
                                sx={{
                                    backgroundColor: '#7DC1FF1a',
                                    color: '#7DC1FF'
                                }}
                                fontSize="13px"
                                fontWeight="400">
                                Xác nhận
                            </Typography>
                        );
                    case TrangThaiBooking.Success:
                        return (
                            <Typography
                                borderRadius="12px"
                                padding={'4px 8px'}
                                sx={{
                                    backgroundColor: '#50CD891a',
                                    color: '#50CD89'
                                }}
                                fontSize="13px"
                                fontWeight="400">
                                Hoàn thành
                            </Typography>
                        );
                    case TrangThaiBooking.CheckIn:
                        return (
                            <Typography
                                borderRadius="12px"
                                padding={'4px 8px'}
                                sx={{
                                    backgroundColor: '#009EF71a',
                                    color: '#009EF7'
                                }}
                                fontSize="13px"
                                fontWeight="400">
                                Check In
                            </Typography>
                        );
                    case TrangThaiBooking.Wait:
                        return (
                            <Typography
                                borderRadius="12px"
                                padding={'4px 8px'}
                                sx={{
                                    backgroundColor: '#FF99001a',
                                    color: '#FF9900'
                                }}
                                fontSize="13px"
                                fontWeight="400">
                                Chờ xác nhận
                            </Typography>
                        );
                    default:
                        return null;
                }
            },
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '500',
                        color: '#525F7A',
                        fontSize: '13px',
                        fontFamily: 'Roboto'
                    }}>
                    {params.colDef.headerName}
                </Box>
            )
        },

        {
            field: 'ghiChu',
            headerName: 'Ghi chú',
            minWidth: 120,
            flex: 1,
            renderCell: (params) => (
                <Box width="100%" textAlign="left" fontSize="13px">
                    {params.value}
                </Box>
            ),
            renderHeader: (params) => (
                <Box
                    sx={{
                        fontWeight: '500',
                        color: '#525F7A',
                        fontSize: '13px',
                        fontFamily: 'Roboto'
                    }}>
                    {params.colDef.headerName}
                </Box>
            )
        }
    ];
    const openDateSelect = Boolean(anchorDateEl);
    const idDateSelect = openDateSelect ? 'simple-popover' : undefined;
    return (
        <Box paddingTop={'16px'}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="10px">
                    <Typography variant="h1" fontSize="16px" fontWeight="700" color="#333233">
                        Báo cáo thống kê lịch hẹn
                    </Typography>
                    <Box className="form-search">
                        <TextField
                            sx={{
                                backgroundColor: '#fff',
                                borderColor: '#CDC9CD',
                                height: '40px',
                                '& .MuiInputBase-root': {
                                    pl: '0'
                                }
                            }}
                            onChange={(e: any) => {
                                setFilter(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') {
                                    getData();
                                }
                            }}
                            size="small"
                            className="search-field"
                            variant="outlined"
                            placeholder="Tìm kiếm"
                            InputProps={{
                                startAdornment: (
                                    <IconButton
                                        type="button"
                                        onClick={() => {
                                            getData();
                                        }}>
                                        <img src={SearchIcon} />
                                    </IconButton>
                                )
                            }}
                        />
                    </Box>
                </Grid>

                <Grid xs={12} md="auto" item display="flex" gap="8px" justifyContent="end">
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            backgroundColor: '#fff!important',
                            textTransform: 'capitalize',
                            fontWeight: '400',
                            color: '#666466',
                            padding: '10px 16px',
                            height: '40px',
                            borderRadius: '4px!important'
                        }}
                        onClick={handleOpenDateSelect}
                        className="btn-outline-hover">
                        {dateTimeType}
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        //hidden={!abpCustom.isGrandPermission('Pages.NhanSu.Export')}
                        startIcon={<img src={UploadIcon} />}
                        sx={{
                            backgroundColor: '#fff!important',
                            textTransform: 'capitalize',
                            fontWeight: '400',
                            color: '#666466',
                            padding: '10px 16px',
                            height: '40px',
                            borderRadius: '4px!important'
                        }}
                        onClick={exportToExcel}
                        className="btn-outline-hover">
                        Xuất
                    </Button>
                </Grid>
            </Grid>
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                spacing={3}
                marginTop={2}
                marginBottom={2}>
                <Grid item xs={12} md={3}>
                    <Autocomplete
                        options={suggestStore.suggestChiNhanhByUser || []}
                        getOptionLabel={(option) => `${option.tenChiNhanh}`}
                        onChange={(event, value) => {
                            setIdChiNhanh(value?.id ?? '');
                        }}
                        size="medium"
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                sx={{ bgcolor: '#fff' }}
                                {...params}
                                placeholder="Tìm tên"
                                label={<Typography fontSize={'16px'}>Chi nhánh</Typography>}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            {params.InputProps.startAdornment}
                                            <InputAdornment position="start">
                                                <img src={SearchIcon} />
                                            </InputAdornment>
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                </Grid>

                <Grid xs={12} md={3} item>
                    <Autocomplete
                        options={suggestStore.suggestKhachHang || []}
                        getOptionLabel={(option) => `${option.tenKhachHang}`}
                        onChange={(event, value) => {
                            setIdKhachHang(value?.id ?? '');
                        }}
                        size="medium"
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                sx={{ bgcolor: '#fff' }}
                                {...params}
                                label={<Typography fontSize={'16px'}>Khách hàng</Typography>}
                                placeholder="Tìm tên"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            {params.InputProps.startAdornment}
                                            <InputAdornment position="start">
                                                <img src={SearchIcon} />
                                            </InputAdornment>
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Autocomplete
                        options={suggestStore.suggestDichVu || []}
                        getOptionLabel={(option) => `${option.tenDichVu}`}
                        onChange={(event, value) => {
                            setIdDichVu(value?.id ?? '');
                        }}
                        size="medium"
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                sx={{ bgcolor: '#fff' }}
                                {...params}
                                label={<Typography fontSize={'16px'}>Dịch vụ</Typography>}
                                placeholder="Tìm tên"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            {params.InputProps.startAdornment}
                                            <InputAdornment position="start">
                                                <img src={SearchIcon} />
                                            </InputAdornment>
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                </Grid>

                <Grid xs={12} md={3} item>
                    <Autocomplete
                        options={[
                            {
                                key: 'Chờ xác nhận',
                                value: 1
                            },
                            {
                                key: 'Đã xác nhận',
                                value: 2
                            },
                            {
                                key: 'Check In',
                                value: 3
                            },
                            {
                                key: 'Hoàn thành',
                                value: 4
                            },
                            {
                                key: 'Hủy',
                                value: 0
                            }
                        ]}
                        getOptionLabel={(option) => `${option.key}`}
                        onChange={(event, value) => {
                            setTrangThai(value?.value ?? -1);
                        }}
                        size="medium"
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                sx={{ bgcolor: '#fff' }}
                                {...params}
                                placeholder="Tìm tên"
                                label={<Typography fontSize={'16px'}>Trạng thái</Typography>}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            {params.InputProps.startAdornment}
                                            <InputAdornment position="start">
                                                <img src={SearchIcon} />
                                            </InputAdornment>
                                        </>
                                    )
                                }}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <DataGrid
                disableRowSelectionOnClick
                rowHeight={46}
                rows={dataRow}
                getRowId={(row) => row.bookingDate}
                columns={columns}
                checkboxSelection={false}
                hideFooter
                localeText={TextTranslate}
                sortingOrder={['desc', 'asc']}
                onSortModelChange={(newSortModel) => {
                    if (newSortModel.length > 0) {
                        onSort(newSortModel[0].sort?.toString() ?? '', newSortModel[0].field ?? '');
                    }
                }}
            />

            <CustomTablePagination
                currentPage={currentPage}
                rowPerPage={maxResultCount}
                totalPage={totalPage}
                totalRecord={totalDataRow}
                handlePerPageChange={handlePerPageChange}
                handlePageChange={handlePageChange}
            />
            <DateTimeFilterCustom
                open={openDateSelect}
                anchorEl={anchorDateEl}
                onClose={handleCloseDateSelect}
                id={idDateSelect}
                dateTimeType={dateTimeType}
                setDateTimeType={setDateTimeType}
                timeFrom={timeFrom}
                timeTo={timeTo}
                setTimeFrom={setTimeFrom}
                setTimeTo={setTimeTo}
                disableSelectDate={disableSelectDate}
                setDisableSelectDate={setDisableSelectDate}
                onOk={async () => {
                    await getData();
                    handleCloseDateSelect();
                }}
            />
        </Box>
    );
};
export default observer(BaoCaoDatLichPage);
