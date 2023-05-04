import * as React from 'react';
import { useEffect, useState, useImperativeHandle, forwardRef, useRef } from 'react';

import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Grid,
    Typography,
    Button,
    Box,
    TextField,
    Autocomplete,
    Link
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { ModelNhomHangHoa, ModelHangHoaDto } from '../../services/product/dto';
import ProductService from '../../services/product/ProductService';
import Utils from '../../utils/utils';
import '../../App.css';
import './style.css';
import AppConsts from '../../lib/appconst';

// const customTheme = createMuiTheme({
//   overrides: {
//     MuiInput: {
//       input: {
//         "&::placeholder": {
//           color: "gray"
//         },
//         color: "white", // if you also want to change the color of the input, this is the prop you'd use
//       }
//     }
//   });

export function ModalHangHoa({ dataNhomHang, handleSave, trigger }: any) {
    const [open, setOpen] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [product, setProduct] = useState(new ModelHangHoaDto());
    const [wasClickSave, setWasClickSave] = useState(false);

    const [errTenHangHoa, setErrTenHangHoa] = useState(false);
    const [errMaHangHoa, setErrMaHangHoa] = useState(false);

    const [nhomChosed, setNhomChosed] = useState<ModelNhomHangHoa>(
        new ModelNhomHangHoa({ id: '' })
    );
    const showModal = async (id: string) => {
        if (id) {
            const obj = await ProductService.GetDetailProduct(id);
            setProduct(obj);

            // find nhomhang
            const nhom = dataNhomHang.filter((x: any) => x.id == obj.idNhomHangHoa);
            if (nhom.length > 0) {
                setNhomChosed(nhom[0]);
            } else {
                setNhomChosed(new ModelNhomHangHoa({ id: '' }));
            }
        } else {
            setProduct(new ModelHangHoaDto());
        }
        console.log('ModalHangHoa');
    };

    useEffect(() => {
        if (trigger.showModal) {
            setOpen(true);
            showModal(trigger.idQuiDoi);
        }
        setIsNew(trigger.isNew);
        setWasClickSave(false);
        setErrMaHangHoa(false);
        setErrTenHangHoa(false);
    }, [trigger]);

    const editGiaBan = (event: any) => {
        setProduct((itemOlds) => {
            return {
                ...itemOlds,
                giaBan: Utils.formatNumber(event.target.value)
            };
        });
    };

    const CheckSave = async () => {
        if (Utils.checkNull(product.tenHangHoa ?? '')) {
            setErrTenHangHoa(true);
            return false;
        }
        if (!Utils.checkNull(product.maHangHoa ?? '')) {
            const exists = await ProductService.CheckExistsMaHangHoa(
                product.maHangHoa ?? '',
                product.idDonViQuyDoi ?? AppConsts.guidEmpty
            );
            if (exists) {
                setErrMaHangHoa(true);
                return false;
            }
        }
        return true;
    };

    async function saveProduct() {
        console.log('ok');
        setWasClickSave(true);

        if (wasClickSave) {
            return;
        }
        const check = await CheckSave();
        if (!check) {
            return;
        }
        const objNew = { ...product };
        objNew.tenHangHoa_KhongDau = Utils.strToEnglish(objNew.tenHangHoa ?? '');
        objNew.tenLoaiHangHoa = objNew.idLoaiHangHoa == 1 ? 'Hàng hóa' : 'Dịch vụ';
        objNew.txtTrangThaiHang = objNew.trangThai == 1 ? 'Đang kinh doanh' : 'Ngừng kinh doanh';

        objNew.donViQuiDois = [
            {
                id: objNew.idDonViQuyDoi,
                maHangHoa: objNew.maHangHoa,
                tenDonViTinh: '',
                tyLeChuyenDoi: objNew.tyLeChuyenDoi,
                giaBan: objNew.giaBan,
                laDonViTinhChuan: objNew.laDonViTinhChuan
            }
        ];

        const data = await ProductService.CreateOrEditProduct(objNew);
        objNew.id = data.id;
        objNew.donViQuiDois = [...data.donViQuiDois];
        handleSave(objNew);
        setOpen(false);
    }
    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle> {isNew ? 'Thêm' : 'Cập nhật'} dịch vụ</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} md={8} sm={8} lg={8}>
                            <Box sx={{ height: 50 }}>
                                <Typography>Thông tin chi tiết</Typography>
                            </Box>
                            <Grid item sx={{ pb: 2 }}>
                                <Box sx={{ height: 30 }}>
                                    <span>Mã dịch vụ</span>
                                </Box>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size="small"
                                    placeholder="Mã tự động"
                                    value={product.maHangHoa}
                                    error={errMaHangHoa && wasClickSave}
                                    helperText={
                                        errMaHangHoa && wasClickSave ? 'Mã dịch vụ đã tồn tại' : ''
                                    }
                                    onChange={(event) => {
                                        setProduct((itemOlds) => {
                                            return { ...itemOlds, maHangHoa: event.target.value };
                                        });
                                        setWasClickSave(false);
                                    }}
                                />
                            </Grid>
                            <Grid item sx={{ pb: 2 }}>
                                <Box sx={{ height: 30 }}>
                                    <span>Tên dịch vụ</span>
                                    &nbsp;&nbsp;<span>*</span>
                                </Box>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    required
                                    error={wasClickSave && errTenHangHoa}
                                    helperText={
                                        wasClickSave && errTenHangHoa
                                            ? 'Vui lòng nhập tên hàng hóa'
                                            : ''
                                    }
                                    value={product.tenHangHoa}
                                    onChange={(event) => {
                                        setProduct((itemOlds) => {
                                            return { ...itemOlds, tenHangHoa: event.target.value };
                                        });
                                        setErrTenHangHoa(false);
                                        setWasClickSave(false);
                                    }}
                                />
                            </Grid>
                            <Grid item sx={{ pb: 2 }}>
                                <Box sx={{ height: 30 }}>
                                    <span>Nhóm dịch vụ</span>
                                </Box>

                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    disablePortal
                                    // value={nhomChosed}
                                    // isOptionEqualToValue={(option, value) => option.id === value.id}
                                    options={dataNhomHang.filter(
                                        (x: ModelNhomHangHoa) => x.id !== null && x.id !== ''
                                    )}
                                    onChange={(event, newValue) =>
                                        setProduct((itemOlds) => {
                                            return {
                                                ...itemOlds,
                                                idNhomHangHoa: newValue?.id ?? null
                                            };
                                        })
                                    }
                                    onInputChange={(event, newInputValue) => {
                                        setProduct((itemOlds) => {
                                            return { ...itemOlds, tenNhomHang: newInputValue };
                                        });
                                    }}
                                    getOptionLabel={(option: ModelNhomHangHoa) =>
                                        option.tenNhomHang ? option.tenNhomHang : ''
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="Chọn nhóm" />
                                    )}
                                />
                            </Grid>
                            <Grid container sx={{ pb: 2 }}>
                                <Grid item xs={12} sm={6} md={6} lg={6} sx={{ pr: 4 }}>
                                    <Box sx={{ height: 30 }}>
                                        <Typography>Giá</Typography>
                                    </Box>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        placeholder="0"
                                        value={product.giaBan}
                                        onKeyPress={(event) =>
                                            Utils.keypressNumber_limitNumber(event)
                                        }
                                        onChange={(event) => editGiaBan(event)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} sx={{ PluginArray: 4 }}>
                                    <Box sx={{ height: 30 }}>
                                        <Typography>Số phút</Typography>
                                    </Box>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        placeholder="0"
                                        type="number"
                                        value={product.soPhutThucHien}
                                        onChange={(event) =>
                                            setProduct((itemOlds) => {
                                                return {
                                                    ...itemOlds,
                                                    soPhutThucHien: event.target.value
                                                };
                                            })
                                        }
                                    />
                                </Grid>
                            </Grid>

                            <Grid item sx={{ pb: 2 }}>
                                <Box sx={{ height: 30 }}>
                                    <span>Ghi chú</span>
                                </Box>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows="2"
                                    value={product.moTa}
                                    onChange={(event) =>
                                        setProduct((itemOlds) => {
                                            return {
                                                ...itemOlds,
                                                moTa: event.target.value
                                            };
                                        })
                                    }
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={4} sm={4} lg={4}>
                            <Box
                                display="grid"
                                sx={{ border: '2px dashed #cccc', p: 5, ml: 4 }}
                                className="text-center">
                                <Box>
                                    <InsertDriveFileIcon className="icon-size" />
                                </Box>
                                <Box sx={{ pt: 2 }}>
                                    <CloudDoneIcon
                                        style={{ paddingRight: '5px', color: '#7C3367' }}
                                    />
                                    <Link href="#" underline="always">
                                        Tải ảnh lên
                                    </Link>
                                </Box>
                                <Typography variant="caption">File định dạng jpeg, png</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" sx={{ bgcolor: '#7C3367' }} onClick={saveProduct}>
                        Lưu
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ borderColor: '#7C3367' }}
                        onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
