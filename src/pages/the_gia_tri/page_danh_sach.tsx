import {
    Button,
    Checkbox,
    Grid,
    IconButton,
    Pagination,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { Search } from '@mui/icons-material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddIcon from '@mui/icons-material/Add';
import DateFilterCustom from '../../components/DatetimePicker/DateFilterCustom';
import { format, lastDayOfMonth } from 'date-fns';
import { HoaDonRequestDto } from '../../services/dto/ParamSearchDto';
import { useContext, useEffect, useRef, useState } from 'react';
import AppConsts, { LoaiChungTu, TypeAction } from '../../lib/appconst';
import { TrangThaiHoaDon } from '../../services/ban_hang/HoaDonConst';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import PageHoaDonDto from '../../services/ban_hang/PageHoaDonDto';
import ButtonOnlyIcon from '../../components/Button/ButtonOnlyIcon';
import { IHeaderTable, MyHeaderTable } from '../../components/Table/MyHeaderTable';
import utils from '../../utils/utils';
import HoaDonService from '../../services/ban_hang/HoaDonService';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import PopoverFilterHoaDon from '../ban_hang/Giao_dich_thanh_toan/PopoverFilterHoaDon';
import { OptionPage } from '../../components/Pagination/OptionPage';
import { LabelDisplayedRows } from '../../components/Pagination/LabelDisplayedRows';
import fileDowloadService from '../../services/file-dowload.service';
import ModalNapTheGiaTri from './modal_nap_the';
import { IPropModal } from '../../services/dto/IPropsComponent';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';

export default function PageDanhSachTGT() {
    const appContext = useContext(AppContext);
    const chinhanh = appContext.chinhanhCurrent;

    const firstLoad = useRef(true);
    const [anchorDateEl, setAnchorDateEl] = useState<HTMLDivElement | null>(null);
    const openDateFilter = Boolean(anchorDateEl);
    const [txtSearch, setTxtSearch] = useState('');
    const [arrIdChosed, setArrIdChosed] = useState<string[]>([]);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [footerTable_TongThanhToan, setFooterTable_TongThanhToan] = useState(0);
    const [footerTable_DaThanhToan, setFooterTable_DaThanhToan] = useState(0);
    const [footerTable_ConNo, setFooterTable_ConNo] = useState(0);
    const [isOpenFormDetail, setIsOpenFormDetail] = useState(false);
    const [invoiceChosing, setInvoiceChosing] = useState<PageHoaDonDto | null>(null);

    const [propModalNapThe, setPropModalNapThe] = useState<IPropModal<PageHoaDonDto>>({
        isShowModal: false
    } as IPropModal<PageHoaDonDto>);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [confirmDialog, setConfirmDialog] = useState<PropConfirmOKCancel>({
        show: false,
        title: '',
        type: 1,
        mes: ''
    });

    const [paramSearch, setParamSearch] = useState<HoaDonRequestDto>({
        textSearch: '',
        idChiNhanhs: [chinhanh?.id],
        idLoaiChungTus: [LoaiChungTu.THE_GIA_TRI],
        currentPage: 1,
        pageSize: AppConsts.pageOption[0].value,
        columnSort: 'NgayLapHoaDon',
        typeSort: 'DESC',
        fromDate: format(new Date(), 'yyyy-MM-01'),
        toDate: format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'),
        trangThais: [TrangThaiHoaDon.HOAN_THANH]
    });

    const [pageDataHoaDon, setPageDataHoaDon] = useState<PagedResultDto<PageHoaDonDto>>({
        totalCount: 0,
        totalPage: 0,
        items: []
    });

    const GetListTheGiaTri = async () => {
        const param = { ...paramSearch };
        param.textSearch = txtSearch;
        const data = await HoaDonService.GetListHoaDon(paramSearch);
        setPageDataHoaDon({
            ...pageDataHoaDon,
            items: data?.items,
            totalCount: data?.totalCount ?? 0,
            totalPage: utils.getTotalPage(data?.totalCount, paramSearch?.pageSize)
        });

        if (data?.items?.length > 0) {
            const firstRow = data?.items[0];
            setFooterTable_TongThanhToan(firstRow?.sumTongThanhToan ?? 0);
            setFooterTable_DaThanhToan(firstRow?.sumDaThanhToan ?? 0);
            setFooterTable_ConNo((firstRow?.sumTongThanhToan ?? 0) - (firstRow?.sumDaThanhToan ?? 0));
        } else {
            setFooterTable_TongThanhToan(0);
            setFooterTable_DaThanhToan(0);
            setFooterTable_ConNo(0);
        }
    };

    const PageLoad = async () => {
        await GetListTheGiaTri();
    };

    useEffect(() => {
        PageLoad();
    }, []);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        GetListTheGiaTri();
    }, [paramSearch]);

    const handleKeyDownTextSearch = (event: any) => {
        if (event.keyCode === 13) {
            hanClickIconSearch();
        }
    };
    const hanClickIconSearch = () => {
        setParamSearch({
            ...paramSearch,
            textSearch: txtSearch,
            currentPage: 1
        });
    };
    const onApplyFilterDate = async (from: string, to: string, txtShow: string) => {
        setAnchorDateEl(null);
        setParamSearch({ ...paramSearch, fromDate: from, toDate: to, currentPage: 1 });
    };

    const onSortTable = (columnSort: string) => {
        setParamSearch({
            ...paramSearch,
            columnSort: columnSort,
            typeSort: paramSearch.typeSort == '' ? 'desc' : paramSearch.typeSort == 'asc' ? 'desc' : 'asc'
        });
    };

    const onClickCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isCheck = event.currentTarget.checked;
        setIsCheckAll(isCheck);

        const arrIdThisPage = pageDataHoaDon?.items?.map((x) => {
            return x.id;
        });
        if (isCheck) {
            setArrIdChosed([...arrIdChosed, ...arrIdThisPage]);
        } else {
            setArrIdChosed(arrIdChosed.filter((x) => !arrIdThisPage.includes(x)));
        }
    };

    const onClickCheckOne = (event: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
        const isCheck = event.currentTarget.checked;
        if (isCheck) {
            setArrIdChosed([...arrIdChosed, rowId]);

            const arrIdThisPage = pageDataHoaDon?.items?.map((x) => {
                return x.id;
            });
            const arrExist = arrIdChosed?.filter((x) => arrIdThisPage.includes(x));
            setIsCheckAll(arrIdThisPage.length === arrExist.length + 1);
        } else {
            setArrIdChosed(arrIdChosed.filter((x) => x !== rowId));
            setIsCheckAll(false);
        }
    };

    const changeNumberOfpage = (pageSize: number) => {
        setParamSearch({
            ...paramSearch,
            pageSize: pageSize
        });
    };

    const handleChangePage = (value: number) => {
        setParamSearch({
            ...paramSearch,
            currentPage: value
        });
    };

    const [anchorElFilter, setAnchorElFilter] = useState<SVGSVGElement | null>(null);
    const ApplyFilter = (paramFilter: HoaDonRequestDto) => {
        setAnchorElFilter(null);
        setParamSearch({
            ...paramSearch,
            currentPage: 1,
            idLoaiChungTus: [LoaiChungTu.GOI_DICH_VU],
            trangThais: paramFilter?.trangThais,
            trangThaiNos: paramFilter?.trangThaiNos,
            idChiNhanhs: paramFilter?.idChiNhanhs
        });
    };

    const ExportToExcel = async () => {
        const param = { ...paramSearch };
        param.textSearch = txtSearch;
        param.currentPage = 1;
        param.pageSize = pageDataHoaDon?.totalCount ?? 0;
        const data = await HoaDonService.ExportToExcel(param);
        fileDowloadService.downloadExportFile(data);
    };

    const OpenFormDetail = (item: PageHoaDonDto) => {
        setIsOpenFormDetail(true);
        setInvoiceChosing(item);
    };

    const gotoPageList = () => {
        setIsOpenFormDetail(false);
    };

    const showModalNapThe = () => {
        setPropModalNapThe({ ...propModalNapThe, isShowModal: true, isNew: true });
    };

    const saveOKTheNap = async (typeAction: number, dataSave: PageHoaDonDto | undefined) => {
        setPropModalNapThe({ ...propModalNapThe, isShowModal: false });
        setObjAlert({
            ...objAlert,
            show: true,
            mes: `${typeAction === TypeAction.INSEART ? 'Thêm mới' : 'Cập nhật'} thẻ giá trị thành công`
        });
        if (dataSave) {
            switch (typeAction) {
                case TypeAction.INSEART:
                    {
                        setPageDataHoaDon({
                            ...pageDataHoaDon,
                            items: [dataSave, ...(pageDataHoaDon?.items ?? [])]
                        });
                    }
                    break;
            }
        }
    };

    const onXoaTheNap = () => {
        //
    };

    const listColumnHeader: IHeaderTable[] = [
        { columnId: 'maHoaDon', columnText: 'Mã thẻ' },
        { columnId: 'ngayLapHoaDon', columnText: 'Ngày lập' },
        { columnId: 'tenKhachHang', columnText: 'Tên khách hàng' },
        { columnId: 'soDienThoai', columnText: 'Số điện thoại' },
        { columnId: 'tongTienHang', columnText: 'Tổng tiền nạp', align: 'right' },
        { columnId: 'tongGiamGiaHD', columnText: 'Giảm giá', align: 'right' },
        { columnId: 'tongThanhToan', columnText: 'Phải thanh toán', align: 'right' },
        { columnId: 'khachDaTra', columnText: 'Đã thanh toán', align: 'right' },
        { columnId: 'conNo', columnText: 'Còn nợ', align: 'right' },
        // { columnId: 'nvthucHiens', columnText: 'Chiết khấu Nhân viên' },
        { columnId: 'ghiChuHD', columnText: 'Ghi chú' }
    ];

    return (
        <>
            <ModalNapTheGiaTri
                isShowModal={propModalNapThe?.isShowModal ?? false}
                isNew={propModalNapThe.isNew}
                onClose={() => setPropModalNapThe({ ...propModalNapThe, isShowModal: false })}
                onOK={saveOKTheNap}
            />
            <ConfirmDelete
                isShow={confirmDialog.show}
                title={confirmDialog.title}
                mes={confirmDialog.mes}
                onOk={onXoaTheNap}
                onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}
            />
            <Grid container paddingTop={2} spacing={2}>
                <Grid item lg={12} md={12} sm={12} width={'100%'}>
                    <Grid container>
                        <Grid item lg={4} md={3} sm={12} xs={12}>
                            <span className="page-title"> Danh sách thẻ giá trị</span>
                        </Grid>
                        <Grid item lg={8} md={9} sm={12} xs={12} display={'flex'} justifyContent={'end'}>
                            <Grid container justifyContent={'end'} spacing={1} width={'100%'}>
                                <Grid item lg={5} md={6} sm={6} xs={12}>
                                    <Stack direction={'row'} spacing={1}>
                                        <Button
                                            variant="contained"
                                            onClick={showModalNapThe}
                                            fullWidth
                                            startIcon={<AddIcon />}>
                                            Nạp thẻ
                                        </Button>
                                        <Button variant="outlined" fullWidth>
                                            Điều chỉnh số dư
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid item lg={7} md={6} sm={6} xs={12}>
                                    <Stack spacing={1} direction={'row'} justifyContent={'end'}>
                                        <TextField
                                            size="small"
                                            placeholder="Tìm kiếm"
                                            fullWidth
                                            sx={{ backgroundColor: 'white', flex: 3 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <IconButton type="button" onClick={hanClickIconSearch}>
                                                        <Search />
                                                    </IconButton>
                                                )
                                            }}
                                            onChange={(event) => {
                                                setTxtSearch(event.target.value);
                                            }}
                                            onKeyDown={(event) => {
                                                handleKeyDownTextSearch(event);
                                            }}
                                        />
                                        <Stack flex={1} spacing={1} direction={'row'}>
                                            <Button
                                                variant="outlined"
                                                className="btn-outline-hover"
                                                sx={{ backgroundColor: 'white' }}
                                                onClick={ExportToExcel}
                                                startIcon={<FileUploadIcon />}>
                                                Xuất
                                            </Button>
                                            <ButtonOnlyIcon
                                                icon={
                                                    <FilterAltOutlinedIcon
                                                        titleAccess="Lọc nâng cao"
                                                        onClick={(event) => setAnchorElFilter(event.currentTarget)}
                                                    />
                                                }
                                                style={{
                                                    width: 40,
                                                    border: '1px solid #ccc',
                                                    backgroundColor: 'white'
                                                }}></ButtonOnlyIcon>
                                            <PopoverFilterHoaDon
                                                anchorEl={anchorElFilter}
                                                paramFilter={paramSearch}
                                                handleClose={() => setAnchorElFilter(null)}
                                                handleApply={ApplyFilter}
                                            />
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} paddingTop={3} width={'100%'}>
                    <Stack className="page-box-right">
                        <TableContainer className="data-grid-row">
                            <Table>
                                <TableHead>
                                    <MyHeaderTable
                                        showAction={false}
                                        isCheckAll={isCheckAll}
                                        sortBy={paramSearch?.columnSort ?? ''}
                                        sortType={paramSearch?.typeSort ?? 'desc'}
                                        onRequestSort={onSortTable}
                                        onSelectAllClick={onClickCheckAll}
                                        listColumnHeader={listColumnHeader}
                                    />
                                </TableHead>
                                <TableBody>
                                    {pageDataHoaDon?.items?.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center" className="td-check-box">
                                                <Checkbox
                                                    checked={arrIdChosed.includes(row.id)}
                                                    onChange={(event) => onClickCheckOne(event, row.id)}
                                                />
                                            </TableCell>
                                            <TableCell
                                                sx={{ minWidth: 100, maxWidth: 100 }}
                                                onClick={() => OpenFormDetail(row)}>
                                                {row?.maHoaDon}
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 150 }} onClick={() => OpenFormDetail(row)}>
                                                {format(new Date(row?.ngayLapHoaDon), 'dd/MM/yyyy')}
                                            </TableCell>
                                            <TableCell
                                                className="lableOverflow"
                                                sx={{ maxWidth: 200 }}
                                                title={row?.tenKhachHang}
                                                onClick={() => OpenFormDetail(row)}>
                                                {row?.tenKhachHang}
                                            </TableCell>
                                            <TableCell onClick={() => OpenFormDetail(row)}>
                                                {row?.soDienThoai}
                                            </TableCell>
                                            <TableCell align="right" onClick={() => OpenFormDetail(row)}>
                                                {new Intl.NumberFormat('vi-VN').format(row?.tongTienHang ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" onClick={() => OpenFormDetail(row)}>
                                                {new Intl.NumberFormat('vi-VN').format(row?.tongGiamGiaHD ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" onClick={() => OpenFormDetail(row)}>
                                                {new Intl.NumberFormat('vi-VN').format(row?.tongThanhToan ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" onClick={() => OpenFormDetail(row)}>
                                                {new Intl.NumberFormat('vi-VN').format(row?.daThanhToan ?? 0)}
                                            </TableCell>
                                            <TableCell align="right" onClick={() => OpenFormDetail(row)}>
                                                {new Intl.NumberFormat('vi-VN').format(row?.conNo ?? 0)}
                                            </TableCell>
                                            <TableCell
                                                className="lableOverflow"
                                                title={row?.ghiChuHD}
                                                sx={{ minWidth: 150, maxWidth: 200 }}
                                                onClick={() => OpenFormDetail(row)}>
                                                {row?.ghiChuHD}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    {pageDataHoaDon?.totalCount > 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7}>Tổng cộng</TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(footerTable_TongThanhToan)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(footerTable_DaThanhToan)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('vi-VN').format(footerTable_ConNo)}
                                            </TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableRow className="table-empty">
                                            <TableCell colSpan={20} align="center">
                                                Không có dữ liệu
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={4} md={4} lg={4} sm={4}>
                            <OptionPage changeNumberOfpage={changeNumberOfpage} />
                        </Grid>
                        <Grid item xs={8} md={8} lg={8} sm={8}>
                            <Stack direction="row" style={{ float: 'right' }}>
                                <LabelDisplayedRows
                                    currentPage={paramSearch.currentPage}
                                    pageSize={paramSearch.pageSize}
                                    totalCount={pageDataHoaDon.totalCount}
                                />
                                <Pagination
                                    shape="rounded"
                                    count={pageDataHoaDon.totalPage}
                                    page={paramSearch.currentPage}
                                    defaultPage={paramSearch.pageSize}
                                    onChange={(e, newVal) => handleChangePage(newVal)}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
