import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    TextField,
    Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SelectWithData from '../../../../components/Menu/SelectWithData';
import { Formik, Form } from 'formik';
import { Component, ReactNode, useEffect, useState, useRef } from 'react';
import { NumericFormat } from 'react-number-format';
import { CreateOrEditSoQuyDto } from '../../../../services/so_quy/Dto/CreateOrEditSoQuyDto';
import QuyChiTietDto from '../../../../services/so_quy/QuyChiTietDto';
import QuyHoaDonDto from '../../../../services/so_quy/QuyHoaDonDto';
import SoQuyServices from '../../../../services/so_quy/SoQuyServices';
import utils from '../../../../utils/utils';
import DateTimePickerCustom from '../../../../components/DatetimePicker/DateTimePickerCustom';
import AutocompleteCustomer from '../../../../components/Autocomplete/Customer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as yup from 'yup';
import { useFormik, useFormikContext } from 'formik';
import { addDays, format } from 'date-fns';
import { id } from 'date-fns/locale';
import AppConsts from '../../../../lib/appconst';

interface SoQuyDialogProps {
    visiable: boolean;
    onClose: () => void;
    onOk: () => void;
    idQuyHD: string | null;
}
// const LableForm = (text: string) => {
//     return (
//         <span
//             sx={{ marginTop: 2, marginBottom: 1 }}
//             variant="h3"
//             fontSize="14px"
//             fontWeight="500"
//             fontFamily="Roboto"
//             fontStyle="normal"
//             color="#4C4B4C">
//             {text}
//         </span>
//     );
// };

const themeDate = createTheme({
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    minWidth: '100%'
                }
            }
        }
    }
});
const CreateOrEditSoQuyDialog = ({
    visiable = false,
    idQuyHD = null,
    onClose,
    onOk
}: SoQuyDialogProps) => {
    const hinhThucThanhToan = [
        { id: 1, text: 'Tiền mặt' },
        { id: 2, text: 'POS' },
        { id: 3, text: 'Chuyển khoản' }
    ];

    const doiTuongNopTien = [
        { id: 1, text: 'Khách hàng' },
        { id: 2, text: 'POS' },
        { id: 4, text: 'Nhân viên' }
    ];
    const formRef = useRef();
    const [isSaving, setIsSaving] = useState(false);
    const [quyHoaDon, setQuyHoaDon] = useState<QuyHoaDonDto>(
        new QuyHoaDonDto({
            id: '',
            idLoaiChungTu: 11,
            tongTienThu: '0',
            idDoiTuongNopTien: null,
            ngayLapHoaDon: format(new Date(), 'yyyy-MM-dd HH:mm')
        })
    );
    const [chitietSoQuy, setChitietSoQuy] = useState<QuyChiTietDto[]>();
    const [idDoiTuongNopTien, setIdDoiTuongNopTien] = useState<string | null>('');

    const getInforQuyHoaDon = async () => {
        if (utils.checkNull(idQuyHD)) return;
        const data = await SoQuyServices.GetForEdit(idQuyHD ?? '');
        console.log(data);
        if (data !== null) {
            setQuyHoaDon(data);
            if (data.quyHoaDon_ChiTiet != undefined)
                setIdDoiTuongNopTien(data.quyHoaDon_ChiTiet[0]?.idKhachHang ?? '');
        }
    };
    useEffect(() => {
        getInforQuyHoaDon();
    }, [idQuyHD]);

    const saveSoQuy = async () => {
        console.log(666, quyHoaDon);
        setIsSaving(true);
        // const data = await SoQuyServices.CreateQuyHoaDon(quyHoaDon);
    };

    const validate = yup.object().shape({
        tongTienThu: yup
            .string()
            .notOneOf(['0'], 'Tổng tiền phải > 0')
            .required('Vui lòng nhập số tiền'),
        idDoiTuongNopTien: yup.string().required('Vui lòng chọn đối tượng nộp tiền'),
        ngayLapHoaDon: yup.string().matches(AppConsts.yyyyMMddHHmmRegex, 'Email không hợp lệ')
    });

    const changNgayLapPhieu = (dt: any) => {
        setQuyHoaDon({ ...quyHoaDon, ngayLapHoaDon: dt });
    };
    const changeDoituongnopTien = (item: any) => {
        setIdDoiTuongNopTien(item?.id);
        setQuyHoaDon({ ...quyHoaDon, idDoiTuongNopTien: item?.id });
    };

    return (
        <Dialog open={visiable} fullWidth maxWidth={'sm'}>
            <DialogTitle>
                <div className="row">
                    <Box className="col-8" sx={{ float: 'left' }}>
                        {utils.checkNull(idQuyHD) ? 'Thêm mới' : 'Cập nhật'} sổ quỹ
                    </Box>
                    <Box
                        className="col-4"
                        sx={{
                            float: 'right',
                            '& svg:hover': {
                                filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                            }
                        }}>
                        <CloseIcon
                            style={{ float: 'right', height: '24px', cursor: 'pointer' }}
                            onClick={onClose}
                        />
                    </Box>
                </div>
            </DialogTitle>
            <DialogContent>
                <Formik initialValues={quyHoaDon} validationSchema={validate} onSubmit={saveSoQuy}>
                    {(formik) => (
                        <>
                            {console.log(123, formik.values)}
                            <Form>
                                <Grid container rowGap={1} columnSpacing={2}>
                                    <Grid item xs={12} sm={12} lg={12}>
                                        <FormControlLabel
                                            value="end"
                                            control={
                                                <Radio
                                                    color="secondary"
                                                    value={11}
                                                    checked={quyHoaDon.idLoaiChungTu === 11}
                                                    onChange={() =>
                                                        setQuyHoaDon({
                                                            ...quyHoaDon,
                                                            idLoaiChungTu: 11
                                                        })
                                                    }
                                                />
                                            }
                                            label="Phiếu thu"
                                        />
                                        <FormControlLabel
                                            value="end"
                                            control={
                                                <Radio
                                                    color="secondary"
                                                    name="idLoaiChungTu"
                                                    value={12}
                                                    checked={quyHoaDon.idLoaiChungTu === 12}
                                                    onChange={() =>
                                                        setQuyHoaDon({
                                                            ...quyHoaDon,
                                                            idLoaiChungTu: 12
                                                        })
                                                    }
                                                />
                                            }
                                            label="Phiếu chi"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <span className="modal-lable">Ngày </span>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <ThemeProvider theme={themeDate}>
                                            <DateTimePickerCustom
                                                defaultVal={quyHoaDon.ngayLapHoaDon}
                                                handleChangeDate={(dt: string) => {
                                                    formik.setFieldValue('ngayLapHoaDon', dt);
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        ngayLapHoaDon: dt
                                                    });
                                                }}
                                                helperText={
                                                    formik.touched.idDoiTuongNopTien &&
                                                    formik.errors.idDoiTuongNopTien
                                                }
                                            />
                                        </ThemeProvider>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Stack direction="column" rowGap={1}>
                                            <span className="modal-lable">Mã phiếu </span>
                                            <TextField size="small" fullWidth />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack direction="column" rowGap={1}>
                                            <span className="modal-lable">Hình thức </span>
                                            <SelectWithData data={hinhThucThanhToan} idChosed={1} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack direction="column" rowGap={1}>
                                            <span className="modal-lable">Thu của </span>
                                            <SelectWithData data={doiTuongNopTien} idChosed={1} />
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        pt={{ xs: 2, sm: '28px', lg: '28px' }}>
                                        <AutocompleteCustomer
                                            idChosed={idDoiTuongNopTien}
                                            handleChoseItem={(item: any) => {
                                                {
                                                    formik.setFieldValue(
                                                        'idDoiTuongNopTien',
                                                        item?.id ?? null
                                                    );
                                                    setQuyHoaDon({
                                                        ...quyHoaDon,
                                                        idDoiTuongNopTien: item?.id,
                                                        maNguoiNop: item?.maKhachHang,
                                                        tenNguoiNop: item?.tenKhachHang
                                                    });
                                                }
                                            }}
                                            error={
                                                formik.touched.idDoiTuongNopTien &&
                                                Boolean(formik.errors?.idDoiTuongNopTien)
                                            }
                                            helperText={
                                                formik.touched.idDoiTuongNopTien &&
                                                formik.errors.idDoiTuongNopTien
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <span className="modal-lable">Tiền thu </span>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <NumericFormat
                                            fullWidth
                                            thousandSeparator
                                            size="small"
                                            name="tongTienThu"
                                            // value={formik.values.tongTienThu}
                                            customInput={TextField}
                                            onChange={formik.handleChange}
                                            error={
                                                formik.touched?.tongTienThu &&
                                                Boolean(formik.errors?.tongTienThu)
                                            }
                                            helperText={
                                                formik.touched.tongTienThu &&
                                                formik.errors.tongTienThu
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <span className="modal-lable">Tài khoản thu </span>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <AutocompleteCustomer />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <span className="modal-lable">Nội dung thu </span>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField size="small" multiline rows={3} fullWidth />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FormGroup>
                                            <FormControlLabel
                                                value="end"
                                                control={
                                                    <Checkbox
                                                        name="ckHachToanKinhDoanh"
                                                        //checked={values.maPhieu === 'Phiếu thu'}
                                                        onChange={formik.handleChange}
                                                        value="Phiếu thu"
                                                        sx={{
                                                            color: '#7C3367'
                                                        }}
                                                    />
                                                }
                                                label="Hạch toán vào kết quả hoạt động kinh doanh"
                                            />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                <DialogActions>
                                    <Button
                                        variant="outlined"
                                        sx={{ color: '#7C3367' }}
                                        className="btn-outline-hover"
                                        onClick={onClose}>
                                        Hủy
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#7C3367' }}
                                        className="btn-container-hover"
                                        type="submit"
                                        disabled={formik.isSubmitting}>
                                        Lưu
                                    </Button>
                                </DialogActions>
                            </Form>
                        </>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};
export default CreateOrEditSoQuyDialog;
