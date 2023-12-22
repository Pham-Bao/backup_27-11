import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
    TextField,
    Stack,
    Avatar,
    DialogActions,
    Button
} from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import DialogButtonClose from '../../components/Dialog/ButtonClose';
import nhanVienService from '../../services/nhan-vien/nhanVienService';
import { PagedNhanSuRequestDto } from '../../services/nhan-vien/dto/PagedNhanSuRequestDto';
import React, { KeyboardEventHandler, useContext, useEffect, useRef, useState } from 'react';
import NhanSuItemDto from '../../services/nhan-vien/dto/nhanSuItemDto';
import NhanVienThucHienDto from '../../services/nhan_vien_thuc_hien/NhanVienThucHienDto';
import { Search } from '@mui/icons-material';
import utils from '../../utils/utils';
import chietKhauHoaDonService from '../../services/hoa_hong/chiet_khau_hoa_don/chietKhauHoaDonService';
import { AppContext } from '../../services/chi_nhanh/ChiNhanhContext';
import { NumericFormat } from 'react-number-format';
import NhanVienThucHienServices from '../../services/nhan_vien_thuc_hien/NhanVienThucHienServices';
import SnackbarAlert from '../../components/AlertDialog/SnackbarAlert';
import HoaDonChiTietDto from '../../services/ban_hang/HoaDonChiTietDto';
import chietKhauDichVuService from '../../services/hoa_hong/chiet_khau_dich_vu/chietKhauDichVuService';

export default function HoaHongNhanVienDichVu({ iShow, onClose, itemHoaDonChiTiet, onSaveOK }: any) {
    const appContext = useContext(AppContext);
    const chinhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanhCurrent?.id;
    const [txtSearch, setTxtSearch] = useState('');
    const [lstNhanVien, setLstNhanVien] = useState<NhanSuItemDto[]>([]);
    const [allNhanVien, setAllNhanVien] = useState<NhanSuItemDto[]>([]);
    const [lstNVThucHien, setLstNhanVienChosed] = useState<NhanVienThucHienDto[]>([]);
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    const GetListNhanVien = async () => {
        const data = await nhanVienService.getAll({
            filter: txtSearch,
            skipCount: 0,
            maxResultCount: 100
        } as PagedNhanSuRequestDto);
        setAllNhanVien([...data.items]);
        setLstNhanVien([...data.items]);
    };

    const GetNhanVienThucHien_byIdHoaDonChiTiet = async () => {
        const data = await NhanVienThucHienServices.GetNhanVienThucHien_byIdHoaDonChiTiet(itemHoaDonChiTiet?.id);
        console.log('GetNhanVienThucHien_byIdHoaDonChiTiet ', data);
        if (data != null && data.length > 0) {
            const arr = data.map((x: NhanVienThucHienDto) => {
                return { ...x, laPhanTram: x.ptChietKhau > 0 };
            });
            setLstNhanVienChosed(arr);
        } else {
            setLstNhanVienChosed([]);
        }
    };

    useEffect(() => {
        GetListNhanVien();
    }, []);

    useEffect(() => {
        // get hoahongHD from db
        GetNhanVienThucHien_byIdHoaDonChiTiet();
    }, [iShow]);

    const SearchNhanVienClient = () => {
        if (!utils.checkNull(txtSearch)) {
            const txt = txtSearch.trim().toLowerCase();
            const txtUnsign = utils.strToEnglish(txt);
            const data = allNhanVien.filter(
                (x) =>
                    (x.maNhanVien !== null && x.maNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.tenNhanVien !== null && x.tenNhanVien.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.soDienThoai !== null && x.soDienThoai.trim().toLowerCase().indexOf(txt) > -1) ||
                    (x.maNhanVien !== null && utils.strToEnglish(x.maNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.tenNhanVien !== null && utils.strToEnglish(x.tenNhanVien).indexOf(txtUnsign) > -1) ||
                    (x.soDienThoai !== null && utils.strToEnglish(x.soDienThoai).indexOf(txtUnsign) > -1) ||
                    (x.tenChucVu !== null && utils.strToEnglish(x.tenChucVu).indexOf(txtUnsign) > -1)
            );
            setLstNhanVien(data);
        } else {
            setLstNhanVien([...allNhanVien]);
        }
    };

    useEffect(() => {
        SearchNhanVienClient();
    }, [txtSearch]);

    const ChoseNhanVien = async (item: NhanSuItemDto) => {
        const nvEX = lstNVThucHien.filter((x) => x.idNhanVien === item.id);
        if (nvEX.length > 0) {
            setObjAlert({ ...objAlert, show: true, mes: `Nhân viên ${item.tenNhanVien} đã được chọn` });
            return;
        }

        const newNV = new NhanVienThucHienDto({
            idNhanVien: item.id,
            maNhanVien: item.maNhanVien,
            tenNhanVien: item.tenNhanVien,
            soDienThoai: item.soDienThoai,
            gioiTinh: item.gioiTinh,
            avatar: item.avatar,
            loaiChietKhau: 1, //  1.NV thực hiện, 2.NV tư vấn, 3. NV thực hiện theo yêu cầu
            ptChietKhau: 0,
            tienChietKhau: 0,
            tinhHoaHongTruocCK: false
        });
        const ckSetup = await chietKhauDichVuService.GetHoaHongNV_theoDichVu(
            newNV.idNhanVien as unknown as string,
            itemHoaDonChiTiet.idDonViQuyDoi,
            idChiNhanh
        );
        if (ckSetup != null && ckSetup.length > 0) {
            const gtriSetup = ckSetup[0].giaTri ?? 0;

            newNV.ptChietKhau = ckSetup[0].laPhanTram ? gtriSetup : 0;
            newNV.chietKhauMacDinh = gtriSetup;

            if (newNV.ptChietKhau > 0) {
                newNV.tienChietKhau = (newNV.ptChietKhau * itemHoaDonChiTiet?.thanhTienSauCK) / 100;
            } else {
                newNV.tienChietKhau = gtriSetup * itemHoaDonChiTiet?.soLuong;
            }
        }
        setLstNhanVienChosed([newNV, ...lstNVThucHien]);
    };

    const removeNVienChosed = (nv: NhanVienThucHienDto) => {
        setLstNhanVienChosed(lstNVThucHien.filter((x: NhanVienThucHienDto) => x.idNhanVien !== nv.idNhanVien));
    };

    const onClickPtramVND = (laPhanTram: boolean, nv: NhanVienThucHienDto) => {
        const laPtramNew = !laPhanTram;
        setLstNhanVienChosed(
            lstNVThucHien.map((x: NhanVienThucHienDto) => {
                if (x.idNhanVien === nv.idNhanVien) {
                    const ckNew = x.tienChietKhau;
                    let ptChietKhau = x.ptChietKhau;
                    if (ptChietKhau > 0) {
                        if (!laPtramNew) {
                            // % --> vnd
                            ptChietKhau = 0;
                        }
                    } else {
                        // vnd --> %
                        if (laPtramNew) {
                            ptChietKhau = (ckNew / itemHoaDonChiTiet?.thanhTienSauCK) * 100;
                        }
                    }

                    return { ...x, laPhanTram: laPtramNew, ptChietKhau: ptChietKhau, tienChietKhau: ckNew };
                } else {
                    return x;
                }
            })
        );
    };

    const changeGtriChietKhau = (gtriNew: string, nv: NhanVienThucHienDto) => {
        const gtriCK = utils.formatNumberToFloat(gtriNew);

        setLstNhanVienChosed(
            lstNVThucHien.map((x: NhanVienThucHienDto) => {
                if (x.idNhanVien === nv.idNhanVien) {
                    let tienCKnew = x.tienChietKhau;
                    let ptCKNew = x.ptChietKhau;
                    if (x.laPhanTram) {
                        ptCKNew = gtriCK;
                        tienCKnew = (gtriCK * itemHoaDonChiTiet?.thanhTienSauCK) / 100;
                    } else {
                        ptCKNew = 0;
                        tienCKnew = gtriCK;
                    }
                    return { ...x, tienChietKhau: tienCKnew, ptChietKhau: ptCKNew };
                } else {
                    return x;
                }
            })
        );
    };

    const changeTienChietKhau = (gtriNew: string, nv: NhanVienThucHienDto) => {
        console.log('changeTienChietKhau ');
        const tienCK = utils.formatNumberToFloat(gtriNew);
        setLstNhanVienChosed(
            lstNVThucHien.map((x: NhanVienThucHienDto) => {
                if (x.idNhanVien === nv.idNhanVien) {
                    let tienCKnew = x.tienChietKhau;
                    let ptCKNew = x.ptChietKhau;
                    if (x.laPhanTram) {
                        ptCKNew = (tienCK / itemHoaDonChiTiet?.thanhTienSauCK) * 100;
                        tienCKnew = tienCK;
                    } else {
                        ptCKNew = 0;
                        tienCKnew = tienCK;
                    }
                    return { ...x, tienChietKhau: tienCKnew, ptChietKhau: ptCKNew };
                } else {
                    return x;
                }
            })
        );
    };

    const removeAllNVienChosed = () => {
        setLstNhanVienChosed([]);
    };

    const refInputCK: any = useRef([]);
    const refTienChietKhau: any = useRef([]);
    const gotoNextInputCK = (e: React.KeyboardEvent<HTMLDivElement>, targetElem: any) => {
        if (e.key === 'Enter' && targetElem) {
            targetElem.focus();
        }
    };
    const gotoNextTienChietKhau = (e: React.KeyboardEvent<HTMLDivElement>, targetElem: any) => {
        if (e.key === 'Enter' && targetElem) {
            targetElem.focus();
        }
    };

    const saveHoaHongDV = async () => {
        setObjAlert({ ...objAlert, mes: 'Cập nhật hoa hồng dịch vụ thành công', show: true, type: 1 });
        await NhanVienThucHienServices.UpdateNVThucHien_byIdHoaDonChiTiet(itemHoaDonChiTiet?.id, lstNVThucHien);
        onSaveOK();
    };

    return (
        <>
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Dialog open={iShow} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography className="modal-title">Hoa hồng theo dịch vụ</Typography>
                    <DialogButtonClose onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={8}>
                            <Stack flex={4} fontSize={14}>
                                <Stack
                                    direction={'row'}
                                    justifyContent={'center'}
                                    sx={{
                                        padding: '10px',
                                        borderRadius: '4px'
                                    }}>
                                    <Stack direction={'row'} spacing={1} flex={1} justifyContent={'space-between'}>
                                        <Stack direction={'row'} spacing={1}>
                                            <Stack sx={{ fontWeight: '600' }}>{itemHoaDonChiTiet?.tenHangHoa}</Stack>
                                        </Stack>
                                        <Stack sx={{ fontWeight: '600' }}>
                                            Giá trị:{' '}
                                            {new Intl.NumberFormat('vi-VN').format(itemHoaDonChiTiet?.thanhTienSauCK)}
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Stack spacing={1}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Tìm kiếm"
                                    value={txtSearch}
                                    onChange={(event) => {
                                        setTxtSearch(event.target.value);
                                    }}
                                    InputProps={{
                                        startAdornment: <Search />
                                    }}
                                />
                                <Stack sx={{ overflow: 'auto', maxHeight: 400 }}>
                                    {lstNhanVien?.map((nvien: NhanSuItemDto, index: number) => (
                                        <Stack
                                            direction={'row'}
                                            spacing={1}
                                            key={index}
                                            sx={{ borderBottom: '1px dashed #cccc', padding: '8px' }}
                                            onClick={() => ChoseNhanVien(nvien)}>
                                            <Stack>
                                                <Avatar
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        backgroundColor: 'var(--color-bg)',
                                                        color: 'var(--color-main)',
                                                        fontSize: '14px'
                                                    }}>
                                                    {utils.getFirstLetter(nvien?.tenNhanVien ?? '')}
                                                </Avatar>
                                            </Stack>
                                            <Stack justifyContent={'center'} spacing={1}>
                                                <Stack sx={{ fontSize: '14px', fontWeight: 500 }}>
                                                    {nvien?.tenNhanVien}
                                                </Stack>
                                                <Stack sx={{ fontSize: '12px', color: '#839bb1' }}>
                                                    {nvien?.tenChucVu}
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={8} sx={{ fontSize: '14px' }}>
                            <Stack>
                                <Stack
                                    direction={'row'}
                                    spacing={1}
                                    sx={{
                                        fontWeight: '600',
                                        padding: '10px',
                                        background: 'var(--color-header-table)'
                                    }}>
                                    <Stack flex={1}>STT</Stack>
                                    <Stack flex={5}>Nhân viên</Stack>
                                    <Stack flex={3}>Chiết khấu</Stack>
                                    <Stack flex={1}>%</Stack>
                                    <Stack flex={3}>Tiền được nhận</Stack>
                                    <Stack flex={1} alignItems={'end'}>
                                        <ClearOutlinedIcon sx={{ color: 'red' }} onClick={removeAllNVienChosed} />
                                    </Stack>
                                </Stack>
                                {lstNVThucHien?.map((nv: NhanVienThucHienDto, index: number) => (
                                    <Stack direction={'row'} spacing={1} padding={'10px'} key={index}>
                                        <Stack flex={1} alignItems={'center'}>
                                            {index + 1}
                                        </Stack>
                                        <Stack flex={5}>{nv.tenNhanVien}</Stack>
                                        <Stack flex={3} alignItems={'center'} sx={{ cursor: 'pointer' }}>
                                            <Stack sx={{ color: 'var(--color-main)' }}>
                                                <NumericFormat
                                                    fullWidth
                                                    size="small"
                                                    variant="standard"
                                                    thousandSeparator={'.'}
                                                    decimalSeparator={','}
                                                    value={nv.laPhanTram ? nv.ptChietKhau : nv.tienChietKhau}
                                                    customInput={TextField}
                                                    InputProps={{
                                                        inputProps: {
                                                            style: { textAlign: 'right' }
                                                        }
                                                    }}
                                                    inputRef={(el: any) => (refInputCK.current[index] = el)}
                                                    onChange={(e) => changeGtriChietKhau(e.target.value, nv)}
                                                    onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) =>
                                                        gotoNextInputCK(
                                                            e,
                                                            refInputCK.current[
                                                                index === lstNVThucHien.length - 1 ? 0 : index + 1
                                                            ]
                                                        )
                                                    }
                                                />
                                            </Stack>
                                        </Stack>
                                        <Stack direction={'row'} flex={1}>
                                            {nv?.laPhanTram ? (
                                                <Avatar
                                                    style={{
                                                        width: 25,
                                                        height: 25,
                                                        fontSize: '12px',
                                                        backgroundColor: 'var(--color-main)'
                                                    }}
                                                    onClick={() => onClickPtramVND(true, nv)}>
                                                    %
                                                </Avatar>
                                            ) : (
                                                <Avatar
                                                    style={{ width: 25, height: 25, fontSize: '12px' }}
                                                    onClick={() => onClickPtramVND(false, nv)}>
                                                    đ
                                                </Avatar>
                                            )}
                                        </Stack>
                                        <Stack flex={3} alignItems={'end'}>
                                            <NumericFormat
                                                fullWidth
                                                size="small"
                                                variant="standard"
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                value={nv.tienChietKhau}
                                                customInput={TextField}
                                                InputProps={{
                                                    inputProps: {
                                                        style: { textAlign: 'right' }
                                                    }
                                                }}
                                                onChange={(e: any) => {
                                                    changeTienChietKhau(e.target.value, nv);
                                                }}
                                                inputRef={(el: any) => (refTienChietKhau.current[index] = el)}
                                                onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) =>
                                                    gotoNextTienChietKhau(
                                                        e,
                                                        refTienChietKhau.current[
                                                            index === lstNVThucHien.length - 1 ? 0 : index + 1
                                                        ]
                                                    )
                                                }
                                            />
                                        </Stack>
                                        <Stack flex={1} alignItems={'end'}>
                                            <ClearOutlinedIcon
                                                sx={{ color: 'red' }}
                                                onClick={() => removeNVienChosed(nv)}
                                            />
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingBottom: '20px' }}>
                    <Button variant="outlined" onClick={onClose}>
                        Bỏ qua
                    </Button>
                    <Button variant="contained" onClick={saveHoaHongDV}>
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
