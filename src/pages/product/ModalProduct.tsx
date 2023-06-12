import * as React from 'react';
import { useEffect, useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { ThemeProvider } from '@mui/material/styles';

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
    Link,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { ModelNhomHangHoa, ModelHangHoaDto } from '../../services/product/dto';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';

import ProductService from '../../services/product/ProductService';
import Utils from '../../utils/utils';
import '../../App.css';
import './style.css';
import AppConsts from '../../lib/appconst';

import StyleOveride from '../../StyleOveride';

export function ModalHangHoa({ dataNhomHang, handleSave, trigger }: any) {
    const [open, setOpen] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [product, setProduct] = useState(new ModelHangHoaDto());
    const [wasClickSave, setWasClickSave] = useState(false);
    const [actionProduct, setActionProduct] = useState(1);

    const [errTenHangHoa, setErrTenHangHoa] = useState(false);
    const [errMaHangHoa, setErrMaHangHoa] = useState(false);

    const [nhomChosed, setNhomChosed] = useState<ModelNhomHangHoa>(
        new ModelNhomHangHoa({ id: '' })
    );
    const [inforDeleteProduct, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );

    const showModal = async (id: string) => {
        if (id) {
            const obj = await ProductService.GetDetailProduct(id);
            setProduct(obj);

            setProduct((old: any) => {
                return {
                    ...old,
                    laHangHoa: old.idLoaiHangHoa === 1
                };
            });

            // find nhomhang
            const nhom = dataNhomHang.filter((x: any) => x.id == obj.idNhomHangHoa);
            if (nhom.length > 0) {
                setNhomChosed(nhom[0]);
            } else {
                setNhomChosed(new ModelNhomHangHoa({ id: '' }));
            }
        } else {
            setProduct(new ModelHangHoaDto());

            if (trigger.item.idNhomHangHoa !== undefined) {
                const nhom = dataNhomHang.filter((x: any) => x.id == trigger.item.idNhomHangHoa);
                if (nhom.length > 0) {
                    setNhomChosed(nhom[0]);
                    setProduct((old: any) => {
                        return {
                            ...old,
                            idNhomHangHoa: nhom[0].id,
                            tenNhomHang: nhom[0].tenNhomHang
                        };
                    });
                } else {
                    setNhomChosed(new ModelNhomHangHoa({ id: '' }));
                }
            } else {
                setNhomChosed(new ModelNhomHangHoa({ id: '' }));
            }
        }
    };

    useEffect(() => {
        if (trigger.isShow) {
            setOpen(true);
            showModal(trigger.id);
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
    const handleChangeNhom = (item: any) => {
        setProduct((itemOlds) => {
            return {
                ...itemOlds,
                idNhomHangHoa: item?.id ?? null,
                tenNhomHang: item?.tenNhomHang,
                laHangHoa: item?.laNhomHangHoa,
                idLoaiHangHoa: item?.laNhomHangHoa ? 1 : 2,
                tenLoaiHangHoa: item?.laNhomHangHoa ? 'hàng hóa' : 'dịch vụ'
            };
        });
        setNhomChosed(
            new ModelNhomHangHoa({ id: item?.id ?? null, tenNhomHang: item?.tenNhomHang })
        );
        setWasClickSave(false);
    };

    const handleClickOKComfirm = () => {
        setOpen(false);
        setInforDeleteProduct({ ...inforDeleteProduct, show: false });
        handleSave(product, actionProduct);
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
        objNew.idHangHoa = data.id;
        objNew.donViQuiDois = [...data.donViQuiDois];
        objNew.maHangHoa = data.donViQuiDois.filter(
            (x: any) => x.laDonViTinhChuan === 1
        )[0]?.maHangHoa;
        objNew.idDonViQuyDoi = data.donViQuiDois.filter(
            (x: any) => x.laDonViTinhChuan === 1
        )[0]?.id;
        handleSave(objNew, isNew ? 1 : 2);
        setOpen(false);
    }
    return (
        <>
            <ConfirmDelete
                isShow={inforDeleteProduct.show}
                title={inforDeleteProduct.title}
                mes={inforDeleteProduct.mes}
                onOk={handleClickOKComfirm}
                onCancel={() =>
                    setInforDeleteProduct({ ...inforDeleteProduct, show: false })
                }></ConfirmDelete>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <Button
                    onClick={() => setOpen(false)}
                    sx={{ minWidth: 'unset', position: 'absolute', top: '16px', right: '16px' }}>
                    <CloseIcon sx={{ color: '#666466' }} />
                </Button>
                <DialogTitle fontSize="24px!important" color="#333233" fontWeight="700!important">
                    {' '}
                    {isNew ? 'Thêm ' : 'Cập nhật '}
                    {product.tenLoaiHangHoa?.toLocaleLowerCase()}
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} md={8} sm={8} lg={8}>
                            <Box sx={{ height: 50 }}>
                                <Typography>Thông tin chi tiết</Typography>
                            </Box>
                            <Grid item sx={{ pb: 2 }}>
                                <Typography variant="body2">Mã {product.tenLoaiHangHoa}</Typography>

                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size="small"
                                    placeholder="Mã tự động"
                                    value={product.maHangHoa}
                                    error={errMaHangHoa && wasClickSave}
                                    helperText={
                                        errMaHangHoa && wasClickSave
                                            ? `Mã ${product.tenLoaiHangHoa?.toLocaleLowerCase()} đã tồn tại`
                                            : ''
                                    }
                                    onChange={(event) => {
                                        setProduct((itemOlds) => {
                                            return {
                                                ...itemOlds,
                                                maHangHoa: event.target.value
                                            };
                                        });
                                        setWasClickSave(false);
                                    }}
                                />
                            </Grid>
                            <Grid item sx={{ pb: 2 }}>
                                <Typography variant="body2">
                                    Tên {product.tenLoaiHangHoa?.toLocaleLowerCase()}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    required
                                    error={wasClickSave && errTenHangHoa}
                                    helperText={
                                        wasClickSave && errTenHangHoa
                                            ? `Vui lòng nhập tên ${product.tenLoaiHangHoa?.toLocaleLowerCase()}`
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
                                <Typography variant="body2">
                                    Nhóm {product.tenLoaiHangHoa?.toLocaleLowerCase()}
                                </Typography>
                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    disablePortal
                                    value={nhomChosed}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    options={dataNhomHang.filter(
                                        (x: any) => x.id !== null && x.id !== ''
                                    )}
                                    onChange={(event, newValue) => handleChangeNhom(newValue)}
                                    getOptionLabel={(option: any) =>
                                        option.tenNhomHang ? option.tenNhomHang : ''
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="Chọn nhóm" />
                                    )}
                                />
                            </Grid>
                            <Grid container sx={{ pb: 2 }}>
                                <Grid item xs={12} sm={6} md={6} lg={6} sx={{ pr: 4 }}>
                                    <Typography variant="body2">Giá</Typography>
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
                                    <Typography variant="body2">Số phút</Typography>

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
                                <Typography variant="body2">Ghi chú</Typography>
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
                            <Grid item>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={product.laHangHoa}
                                                onChange={(event) => {
                                                    setProduct((olds: any) => {
                                                        return {
                                                            ...olds,
                                                            laHangHoa: event.target.checked,
                                                            idLoaiHangHoa: event.target.checked
                                                                ? 2
                                                                : 1,
                                                            tenLoaiHangHoa: event.target.checked
                                                                ? 'hàng hóa'
                                                                : 'dịch vụ'
                                                        };
                                                    });
                                                }}
                                            />
                                        }
                                        label="Là hàng hóa"
                                    />
                                </FormGroup>
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
                    <Button
                        variant="outlined"
                        sx={{ borderColor: '#7C3367' }}
                        onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#633434',
                            display: !isNew && product.trangThai === 0 ? '' : 'none'
                        }}
                        onClick={() => {
                            setInforDeleteProduct(
                                new PropConfirmOKCancel({
                                    show: true,
                                    title:
                                        'Khôi phục ' + product?.tenLoaiHangHoa?.toLocaleLowerCase(),
                                    mes: `Bạn có chắc chắn muốn khôi phục ${product?.tenLoaiHangHoa?.toLocaleLowerCase()} ${
                                        product.tenHangHoa
                                    }   không?`
                                })
                            );
                            setActionProduct(4);
                        }}>
                        Khôi phục
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: 'red',
                            display: isNew || product.trangThai === 0 ? 'none' : ''
                        }}
                        onClick={() => {
                            setInforDeleteProduct(
                                new PropConfirmOKCancel({
                                    show: true,
                                    title: 'Xác nhận xóa',
                                    mes: `Bạn có chắc chắn muốn xóa ${product.tenHangHoa}  ${
                                        product?.tenLoaiHangHoa ?? ' '
                                    } không?`
                                })
                            );
                            setActionProduct(3);
                        }}>
                        Xóa
                    </Button>
                    <Button variant="contained" sx={{ bgcolor: '#7C3367' }} onClick={saveProduct}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
