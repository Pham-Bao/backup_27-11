import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import {
    Grid,
    Box,
    Autocomplete,
    InputAdornment,
    TextField,
    Typography,
    Checkbox,
    FormGroup,
    FormControlLabel
} from '@mui/material';
import { PropConfirmOKCancel } from '../../utils/PropParentToChild';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';

import GroupProductService from '../../services/product/GroupProductService';
import { ModelNhomHangHoa } from '../../services/product/dto';
import { ReactComponent as CloseIcon } from '../../images/close-square.svg';
import Utils from '../../utils/utils';
import AppConsts from '../../lib/appconst';
import '../../App.css';

export const GridColor = ({ handleChoseColor }: any) => {
    const [itemColor, setItemColor] = useState({});

    const arrColor = [
        '#FF979C',
        '#FF7597',
        '#FF5677',
        '#DCAFFF',
        //
        '#7F75BE',
        '#5654A8',
        '#78CEFF',
        '#00FF7F',
        '#009688',
        '#4B9C62',
        '#50CD89',
        '#89D49B',
        '#E1CF43',
        '#F4D292',
        '#EFB279',
        '#FC8C4A',
        '#F17448',
        '#DB4335'
    ];
    function choseColor(color: string) {
        setItemColor(color);
        handleChoseColor(color);
    }
    return (
        <>
            <Box
                style={{
                    width: 280,
                    height: 150,
                    position: 'absolute',
                    zIndex: 1,
                    backgroundColor: '#FFFFF0',
                    borderRadius: 4
                }}
                sx={{ ml: 0, p: 1.5, border: '1px solid grey' }}>
                <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 6, sm: 6, md: 6 }}>
                    {arrColor.map((item, index) => (
                        <Grid
                            key={index}
                            item
                            xs={1}
                            sm={1}
                            md={1}
                            onClick={() => choseColor(item)}>
                            <Box className="grid-color" sx={{ bgcolor: item }}></Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export function ModalNhomHangHoa({ dataNhomHang, handleSave, trigger }: any) {
    const [colorToggle, setColorToggle] = useState(false);
    const [dataNhomHangFilter, setDataNhomHangFilter] = useState<ModelNhomHangHoa[]>([]);

    const [isShow, setIsShow] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [wasClickSave, setWasClickSave] = useState(false);
    const [errTenNhom, setErrTenNhom] = useState(false);
    const [groupProduct, setGroupProduct] = useState<ModelNhomHangHoa>(
        new ModelNhomHangHoa({
            id: AppConsts.guidEmpty,
            color: 'red',
            tenNhomHang: '',
            laNhomHangHoa: true
        })
    );
    const [nhomGoc, setNhomGoc] = useState<ModelNhomHangHoa>(new ModelNhomHangHoa({}));

    const [inforDeleteProduct, setInforDeleteProduct] = useState<PropConfirmOKCancel>(
        new PropConfirmOKCancel({ show: false })
    );

    const showModal = async (id: string) => {
        if (id) {
            setGroupProduct(trigger.item);
            setGroupProduct((old: any) => {
                return {
                    ...old,
                    sLoaiNhomHang: old.laNhomHangHoa ? 'nhóm hàng hóa' : 'nhóm dịch vụ'
                };
            });

            // find nhomhang
            const nhom = dataNhomHang.filter((x: any) => x.id == trigger.item.idParent);
            if (nhom.length > 0) {
                setNhomGoc(nhom[0]);
            } else {
                setNhomGoc(new ModelNhomHangHoa({}));
            }
        } else {
            setGroupProduct(new ModelNhomHangHoa({ color: 'red' }));
            setNhomGoc(new ModelNhomHangHoa({}));
        }
    };

    const handleChangeNhomGoc = (item: any) => {
        setGroupProduct((old: any) => {
            return { ...old, idParent: item?.id ?? null };
        });
        setNhomGoc(new ModelNhomHangHoa({ id: item?.id ?? null, tenNhomHang: item?.tenNhomHang }));
    };

    useEffect(() => {
        if (trigger.isShow) {
            setIsShow(true);
            showModal(trigger.id);
        }
        setIsNew(trigger.isNew);
        setWasClickSave(false);
        const arr = [...dataNhomHang];
        setDataNhomHangFilter(arr.filter((x: any) => x.id !== null && x.id !== ''));
        console.log('trigger dataNhom ', arr);
    }, [trigger, dataNhomHang]); // assign again dataNhomHang after save

    function changeColor(colorNew: string) {
        setColorToggle(false);
        setGroupProduct((olds: any) => {
            return { ...olds, color: colorNew };
        });
    }

    const xoaNhomHang = async () => {
        const str = await GroupProductService.XoaNhomHangHoa(groupProduct?.id ?? '');
        setIsShow(false);
        setInforDeleteProduct({ ...inforDeleteProduct, show: false });
        handleSave(groupProduct, true);
    };

    const CheckSave = () => {
        if (Utils.checkNull(groupProduct.tenNhomHang)) {
            setErrTenNhom(true);
            return false;
        }
        return true;
    };
    console.log('modelnhomhang');

    const saveNhomHangHoa = () => {
        setWasClickSave(true);

        const check = CheckSave();
        if (!check) {
            return;
        }

        if (wasClickSave) {
            return;
        }
        const objNew = { ...groupProduct };
        if (trigger.isNew) {
            GroupProductService.InsertNhomHangHoa(groupProduct).then((data) => {
                objNew.id = data.id;
                handleSave(objNew);
            });
        } else {
            GroupProductService.UpdateNhomHangHoa(groupProduct).then((data) => {
                objNew.id = data.id;
                handleSave(objNew);
            });
        }
        setIsShow(false);
    };

    return (
        <div>
            <ConfirmDelete
                isShow={inforDeleteProduct.show}
                title={inforDeleteProduct.title}
                mes={inforDeleteProduct.mes}
                onOk={xoaNhomHang}
                onCancel={() =>
                    setInforDeleteProduct({ ...inforDeleteProduct, show: false })
                }></ConfirmDelete>
            <Dialog
                open={isShow}
                onClose={() => setIsShow(false)}
                aria-labelledby="draggable-dialog-title"
                fullWidth>
                <DialogTitle
                    sx={{
                        cursor: 'move',
                        fontSize: '24px!important',
                        color: '#333233',
                        fontWeight: '700!important'
                    }}
                    id="draggable-dialog-title">
                    {isNew ? 'Thêm' : 'Cập nhật'} {groupProduct.sLoaiNhomHang}
                </DialogTitle>
                <Button
                    sx={{
                        minWidth: 'unset',
                        position: 'absolute',
                        top: '30px',
                        right: '30px',
                        '&:hover svg': {
                            filter: 'brightness(0) saturate(100%) invert(36%) sepia(74%) saturate(1465%) hue-rotate(318deg) brightness(94%) contrast(100%)'
                        }
                    }}
                    onClick={() => setIsShow(false)}>
                    <CloseIcon />
                </Button>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={groupProduct.laNhomHangHoa}
                                            onChange={(event) => {
                                                setGroupProduct((olds: any) => {
                                                    return {
                                                        ...olds,
                                                        laNhomHangHoa: event.target.checked,
                                                        sLoaiNhomHang: event.target.checked
                                                            ? 'nhóm hàng hóa'
                                                            : 'nhóm dịch vụ'
                                                    };
                                                });
                                                setDataNhomHangFilter(
                                                    dataNhomHang.filter(
                                                        (x: any) =>
                                                            x.laNhomHangHoa === event.target.checked
                                                    )
                                                );
                                            }}
                                        />
                                    }
                                    label="Là nhóm hàng hóa"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <Typography variant="body2">
                                Tên {groupProduct.sLoaiNhomHang}{' '}
                                <span style={{ color: 'red' }}>*</span>
                            </Typography>

                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                                value={groupProduct.tenNhomHang}
                                error={errTenNhom && wasClickSave}
                                helperText={
                                    errTenNhom && wasClickSave ? 'Tên nhóm không được để trống' : ''
                                }
                                onChange={(event) => {
                                    setGroupProduct((olds: any) => {
                                        return { ...olds, tenNhomHang: event.target.value };
                                    });
                                    setErrTenNhom(false);
                                    setWasClickSave(false);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <Typography variant="body2">Nhóm gốc</Typography>

                            <Autocomplete
                                size="small"
                                fullWidth
                                disablePortal
                                multiple={false}
                                value={nhomGoc}
                                onChange={(event: any, newValue: any) => {
                                    handleChangeNhomGoc(newValue);
                                }}
                                options={dataNhomHangFilter}
                                getOptionLabel={(option: any) =>
                                    option.tenNhomHang ? option.tenNhomHang : ''
                                }
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <Typography variant="body2">Màu sắc</Typography>
                            <TextField
                                size="small"
                                onClick={() => setColorToggle(!colorToggle)}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Box
                                                className="grid-color"
                                                sx={{ bgcolor: groupProduct.color }}></Box>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                            />
                            {colorToggle && <GridColor handleChoseColor={changeColor} />}
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 2 }}>
                            <Typography variant="body2">Mô tả</Typography>

                            <TextField
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                value={groupProduct.moTa || ''}
                                onChange={(event) =>
                                    setGroupProduct((olds: any) => {
                                        return { ...olds, moTa: event.target.value };
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        sx={{
                            color: '#965C85'
                        }}
                        onClick={() => setIsShow(false)}
                        className="btn-outline-hover">
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: 'red', display: isNew ? 'none' : '' }}
                        onClick={() => {
                            setInforDeleteProduct(
                                new PropConfirmOKCancel({
                                    show: true,
                                    title: 'Xác nhận xóa',
                                    mes: `Bạn có chắc chắn muốn xóa ${
                                        groupProduct.sLoaiNhomHang
                                    }  ${groupProduct?.tenNhomHang ?? ' '} không?`
                                })
                            );
                        }}>
                        Xóa
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: '#7C3367!important' }}
                        onClick={saveNhomHangHoa}
                        className="btn-container-hover">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
