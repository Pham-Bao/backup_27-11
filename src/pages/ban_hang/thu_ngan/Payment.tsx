import React, { useEffect, useState } from 'react';
import { Stack, Typography, Grid, TextField, CircularProgress } from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { NumericFormat } from 'react-number-format';
import utils from '../../../utils/utils';
import { TaiKhoanNganHangDto } from '../../../services/so_quy/Dto/TaiKhoanNganHangDto';
import TaiKhoanNganHangServices from '../../../services/so_quy/TaiKhoanNganHangServices';
import AutocompleteAccountBank from '../../../components/Autocomplete/AccountBank';
interface ChildComponent {
    tongPhaiTra: number;
    onClose: () => void;
    onSaveHoaDon: (
        tienMat: number,
        tienCK: number,
        tienPOS: number,
        idTaiKhoanPos: string | null,
        idTaiKhoanCK: string | null
    ) => void;
}
const PaymentsForm: React.FC<ChildComponent> = ({ tongPhaiTra = 0, onClose, onSaveHoaDon }) => {
    const [tienMat, setTienMat] = useState(tongPhaiTra);
    const [isSaving, setIsSaving] = useState(false);
    const [tienChuyenKhoan, setTienChuyenKhoan] = useState(0);
    const [tienQuyeThePos, setTienQuyeThePos] = useState(0);
    const [allBankAccount, setAllBankAccount] = useState<TaiKhoanNganHangDto[]>([]);

    const [idTaiKhoanChuyenKhoan, setIdTaiKhoanChuyenKhoan] = useState('');
    const [idTaiKhoanPOS, setIdTaiKhoanPOS] = useState('');
    const GetAllTaiKhoanNganHang = async () => {
        const data = await TaiKhoanNganHangServices.GetAllBankAccount();
        setAllBankAccount(data);
    };

    useEffect(() => {
        GetAllTaiKhoanNganHang();
    }, []);

    const tienKhachDua = tienMat + tienChuyenKhoan + tienQuyeThePos;
    const tienKhachThieu = tongPhaiTra - tienKhachDua;

    const changeTaiKhoanChuyenKhoan = (item: TaiKhoanNganHangDto) => {
        setIdTaiKhoanChuyenKhoan(item?.id);
    };
    const changeTaiKhoanPOS = (item: TaiKhoanNganHangDto) => {
        setIdTaiKhoanPOS(item?.id);
    };

    const thanhToan = async () => {
        setIsSaving(true);
        onSaveHoaDon(tienMat, tienChuyenKhoan, tienQuyeThePos, idTaiKhoanChuyenKhoan, idTaiKhoanPOS);
        setIsSaving(false);
    };

    return (
        <Grid
            container
            padding={2}
            sx={{
                boxShadow: '1px 5px 10px 4px #00000026',
                borderRadius: '12px',
                bgcolor: '#fff'
            }}>
            <Grid item xs={12} position={'relative'}>
                <Typography fontSize="24px" fontWeight="700">
                    Thông tin thanh toán
                </Typography>
                <CloseOutlinedIcon
                    sx={{ position: 'absolute', right: 0, top: 0, width: 36, height: 36 }}
                    onClick={onClose}
                />
            </Grid>
            <Grid item xs={12}>
                <Grid container padding={2} paddingLeft={0}>
                    <Grid item xs={6} lg={7} md={7} sm={6}>
                        <Typography fontSize={20} fontWeight={500}>
                            Tổng thanh toán
                        </Typography>
                    </Grid>
                    <Grid item xs={6} lg={5} md={5} sm={6}>
                        <Typography textAlign={'right'} fontSize={20} fontWeight={500}>
                            {new Intl.NumberFormat('vi-VN').format(tongPhaiTra)}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                item
                xs={12}
                padding={2}
                sx={{ backgroundColor: 'rgb(245 241 241)', borderRadius: '8px', paddingTop: '16px' }}
                className="payment-form-hinhthucTT">
                <Grid container display={'none'}>
                    <Grid item lg={2} md={3}>
                        <Typography>Sử dụng điểm</Typography>
                    </Grid>
                    <Grid item lg={10} md={8}>
                        <Grid container spacing={2}>
                            <Grid item lg={7}>
                                <Typography
                                    sx={{
                                        fontSize: '14px!important',
                                        fontWeight: '400!important'
                                    }}>
                                    Tổng điểm: 333
                                </Typography>
                            </Grid>
                            <Grid item lg={5}>
                                <Stack spacing={2} direction={'row'}>
                                    <TextField size="small" />
                                    <TextField size="small" />
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container sx={{ display: 'none' }}>
                    <Grid item lg={2} md={3}>
                        <Typography>Thu từ thẻ</Typography>
                    </Grid>
                    <Grid item lg={10} md={9}>
                        <Grid container spacing={2}>
                            <Grid item lg={7}>
                                <Typography
                                    sx={{
                                        fontSize: '14px!important',
                                        fontWeight: '400!important'
                                    }}>
                                    Số dư: 12.0000
                                </Typography>
                            </Grid>
                            <Grid item lg={5}>
                                <TextField size="small" fullWidth />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justifyContent={'space-between'}>
                    <Grid item lg={3} md={3} sm={3} xs={6}>
                        <Typography>Tiền mặt</Typography>
                    </Grid>
                    <Grid item lg={9} md={9} sm={9} xs={6}>
                        <Grid container spacing={2}>
                            <Grid item lg={9} md={8} sm={9}></Grid>
                            <Grid item lg={3} md={4} sm={3}>
                                <NumericFormat
                                    className="input-number"
                                    size="small"
                                    fullWidth
                                    value={tienMat}
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    customInput={TextField}
                                    onChange={(event) => {
                                        setTienMat(utils.formatNumberToFloat(event.target.value));
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container justifyContent={'space-between'} paddingTop={1}>
                    <Grid item lg={3} md={3} xs={12} sm={3}>
                        <Typography>Chuyển khoản</Typography>
                    </Grid>
                    <Grid item lg={9} md={9} xs={12} sm={9} paddingTop={{ xs: 1, lg: 0, md: 0, sm: 0 }}>
                        <Grid container spacing={2}>
                            <Grid item lg={9} md={8} sm={9} xs={9}>
                                <AutocompleteAccountBank
                                    handleChoseItem={changeTaiKhoanChuyenKhoan}
                                    idChosed={idTaiKhoanChuyenKhoan}
                                    listOption={allBankAccount}
                                />
                            </Grid>
                            <Grid item lg={3} md={4} sm={3} xs={3}>
                                <NumericFormat
                                    size="small"
                                    fullWidth
                                    disabled={utils.checkNull_OrEmpty(idTaiKhoanChuyenKhoan)}
                                    value={tienChuyenKhoan}
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    className="input-number"
                                    customInput={TextField}
                                    onChange={(event) => {
                                        setTienChuyenKhoan(utils.formatNumberToFloat(event.target.value));
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container justifyContent={'space-between'} paddingTop={1}>
                    <Grid item lg={3} md={3} xs={12} sm={3}>
                        <Typography>Quyẹt thẻ</Typography>
                    </Grid>
                    <Grid item lg={9} md={9} xs={12} sm={9} paddingTop={{ xs: 1, lg: 0, md: 0, sm: 0 }}>
                        <Grid container spacing={2}>
                            <Grid item lg={9} md={8} sm={9} xs={9}>
                                <AutocompleteAccountBank
                                    handleChoseItem={changeTaiKhoanPOS}
                                    idChosed={idTaiKhoanPOS}
                                    listOption={allBankAccount}
                                />
                            </Grid>
                            <Grid item lg={3} md={4} sm={3} xs={3}>
                                <NumericFormat
                                    size="small"
                                    fullWidth
                                    disabled={utils.checkNull_OrEmpty(idTaiKhoanPOS)}
                                    value={tienQuyeThePos}
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    className="input-number"
                                    customInput={TextField}
                                    onChange={(event) => {
                                        setTienQuyeThePos(utils.formatNumberToFloat(event.target.value));
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent={'space-between'} padding={2}>
                    <Grid item lg={3} md={3} sm={3} xs={0}></Grid>
                    <Grid item lg={9} md={9} sm={9} xs={12}>
                        <Grid container>
                            <Grid item lg={9} md={8} sm={9} xs={9}>
                                <Typography textAlign={'right'} fontSize={18} fontWeight={500}>
                                    Tổng khách trả
                                </Typography>
                            </Grid>
                            <Grid item lg={3} md={4} sm={3} xs={3}>
                                <Typography textAlign={'right'} fontSize={18} fontWeight={500}>
                                    {new Intl.NumberFormat('vi-VN').format(tienKhachDua)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justifyContent={'space-between'} paddingRight={2}>
                    <Grid item lg={3} md={3} sm={3} xs={0}></Grid>
                    <Grid item lg={9} md={9} sm={9} xs={12}>
                        <Grid container>
                            <Grid item lg={9} md={8} sm={9} xs={9}>
                                <Typography textAlign={'right'} fontSize={16} fontWeight={500}>
                                    {tienKhachThieu >= 0 ? 'Tiền thiếu' : 'Tiền thừa'}
                                </Typography>
                            </Grid>
                            <Grid item lg={3} md={4} sm={3} xs={3}>
                                <Typography textAlign={'right'} fontSize={16} fontWeight={500}>
                                    {new Intl.NumberFormat('vi-VN').format(Math.abs(tienKhachThieu))}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} marginTop={3}>
                <Grid container justifyContent={'space-between'}>
                    <Grid item lg={3} md={2} sm={4} xs={2}></Grid>
                    <Grid lg={6} md={8} sm={4} xs={8}>
                        {isSaving ? (
                            <Stack
                                sx={{
                                    backgroundColor: '#1976d2',
                                    borderRadius: '8px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white'
                                }}
                                direction={'row'}
                                spacing={1}>
                                <CircularProgress />
                                <Typography fontSize={'16px'} padding={2} fontWeight={500}>
                                    ĐANG LƯU
                                </Typography>
                            </Stack>
                        ) : (
                            <Stack
                                sx={{
                                    backgroundColor: '#1976d2',
                                    borderRadius: '8px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white'
                                }}
                                direction={'row'}
                                spacing={1}
                                onClick={thanhToan}>
                                <CheckOutlinedIcon />
                                <Typography fontSize={'16px'} padding={2} fontWeight={500}>
                                    THANH TOÁN
                                </Typography>
                            </Stack>
                        )}
                    </Grid>
                    <Grid lg={3} md={2} sm={4} xs={2}></Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
export default PaymentsForm;
