import React, { useContext } from 'react';

import { Box, Grid, Tabs, Tab, Stack, Button, Select, IconButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import TabPanel from '../../../../components/TabPanel/TabPanel';
import { OpenInNew, LocalOffer } from '@mui/icons-material';

import MauInServices from '../../../../services/mau_in/MauInServices';
import PageHoaDonDto from '../../../../services/ban_hang/PageHoaDonDto';
import PageHoaDonChiTietDto from '../../../../services/ban_hang/PageHoaDonChiTietDto';
import { ChiNhanhDto } from '../../../../services/chi_nhanh/Dto/chiNhanhDto';
import { KhachHangItemDto } from '../../../../services/khach-hang/dto/KhachHangItemDto';
import logoChiNhanh from '../../../../images/Lucky_beauty.jpg';

import SelectWithData from '../../../../components/Menu/SelectWithData';
import { MauInDto } from '../../../../services/mau_in/MauInDto';
import AppConsts, { ISelect } from '../../../../lib/appconst';
import ModalAddMauIn from './modal_add_mau_in';
import utils from '../../../../utils/utils';
import { ChiNhanhContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import DataMauIn from './DataMauIn';
import SelectMauIn from '../../../../components/Menu/SelectMauIn';
import { number } from 'yup';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';

import CustomCkeditor from '../../../../components/ckeditor/CustomCkeditor';
import { Guid } from 'guid-typescript';

export default function PageMauIn({ xx }: any) {
    const [html, setHtml] = useState('');
    const [dataPrint, setdataPrint] = useState('');
    const [allMauIn, setAllMauIn] = useState<MauInDto[]>([]);
    const firstLoad = useRef(true);
    const chinhanhCurrent = useContext(ChiNhanhContext);

    const [lstMauIn, setListMauIn] = useState<MauInDto[]>([]);
    const [idMauInChosed, setIdMauInChosed] = useState<string>('');
    const [isShowModalAddMauIn, setIsShowModalAddMauIn] = useState(false);
    const [idLoaiChungTu, setIdLoaiChungTu] = useState(1);
    const [newMauIn, setNewMauIn] = useState<MauInDto>({} as MauInDto);
    const [idMauInUpdate, setIdMauInUpdate] = useState('');
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });

    useEffect(() => {
        GetAllMauIn_byChiNhanh();
    }, []);

    const GetAllMauIn_byChiNhanh = async () => {
        const data = await MauInServices.GetAllMauIn_byChiNhanh();
        setAllMauIn(data);
        setListMauInHoaDon(data);
    };

    const BindDataPrint = (shtml: string) => {
        // !import: replace cthd --> hoadon
        switch (idLoaiChungTu) {
            case 1:
                {
                    let dataAfter = DataMauIn.replaceChiTietHoaDon(shtml);
                    dataAfter = DataMauIn.replaceChiNhanh(dataAfter);
                    dataAfter = DataMauIn.replaceHoaDon(dataAfter);
                    setdataPrint(dataAfter);
                }
                break;
            case 11:
            case 12:
                {
                    let dataAfter = DataMauIn.replaceChiNhanh(shtml);
                    dataAfter = DataMauIn.replacePhieuThuChi(dataAfter);
                    setdataPrint(dataAfter);
                }
                break;
        }
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setIdLoaiChungTu(newValue);
        switch (newValue) {
            case 1:
                {
                    setListMauInHoaDon(allMauIn);
                }
                break;
            case 11:
            case 12:
                {
                    const mauInByLoaiChungTu = allMauIn.filter(
                        (x: MauInDto) => x.loaiChungTu === newValue
                    );
                    const mauMacDinh = mauInByLoaiChungTu.filter((x: MauInDto) => x.laMacDinh);
                    const tempK80: MauInDto = {
                        id: '1',
                        tenMauIn: 'Mẫu mặc định',
                        laMacDinh: false
                    } as MauInDto;
                    if (mauMacDinh.length === 0) {
                        tempK80.laMacDinh = true;
                        setListMauIn([tempK80, ...mauInByLoaiChungTu]);
                        setIdMauInChosed('1');
                    } else {
                        setListMauIn([...mauInByLoaiChungTu, tempK80]);
                        setIdMauInChosed(mauMacDinh[0].id);
                        setNewMauIn(mauMacDinh[0]);
                    }
                }
                break;
            default:
                setListMauInHoaDon(allMauIn);
                break;
        }
    };

    const setListMauInHoaDon = (allMauIn: MauInDto[]) => {
        const mauInByLoaiChungTu = allMauIn.filter((x: MauInDto) => x.loaiChungTu === 1);
        const mauMacDinh = mauInByLoaiChungTu.filter((x: MauInDto) => x.laMacDinh);
        const tempK80: MauInDto = {
            id: '1',
            tenMauIn: 'Mẫu mặc định K80',
            laMacDinh: false
        } as MauInDto;
        const tempA4: MauInDto = {
            id: '2',
            tenMauIn: 'Mẫu mặc định A4',
            laMacDinh: false
        } as MauInDto;
        if (mauMacDinh.length === 0) {
            tempK80.laMacDinh = true;
            setListMauIn([tempK80, tempA4, ...mauInByLoaiChungTu]);
            setIdMauInChosed('1');
        } else {
            setListMauIn([...mauInByLoaiChungTu, tempK80, tempA4]);
            setIdMauInChosed(mauMacDinh[0].id);
            setNewMauIn(mauMacDinh[0]);
        }
    };

    const showModalAddMauIn = () => {
        setIsShowModalAddMauIn(true);
        setIdMauInUpdate('');
    };

    const changeMauIn = (item: any) => {
        setIdMauInChosed(item.id);
        setNewMauIn(item);
    };

    useEffect(() => {
        if (!utils.checkNull(idMauInChosed)) {
            if (idMauInChosed.toString().length < 36) {
                // mau txt (k80)
                GetContentMauInMacDinh(parseInt(idMauInChosed));
            } else {
                // mauDB
                const itEx = lstMauIn.filter((x: MauInDto) => x.id === idMauInChosed);
                if (itEx.length > 0) {
                    setHtml(itEx[0].noiDungMauIn);
                } else {
                    setHtml('');
                }
            }
        }
    }, [idMauInChosed]);

    const saveMauIn = async (dataMauIn: any) => {
        setIsShowModalAddMauIn(false);

        setHtml(() => dataMauIn.noiDungMauIn);

        const dataNew = {
            ...dataMauIn
        };
        dataNew.loaiChungTu = idLoaiChungTu;
        dataNew.idChiNhanh = chinhanhCurrent.id;

        if (utils.checkNull(idMauInUpdate)) {
            // insert
            dataNew.id = Guid.EMPTY;
            const data = await MauInServices.InsertMauIn(dataNew);
            dataNew.id = data.id;
            setObjAlert({ ...objAlert, show: true, mes: 'Thêm mới mẫu in thành công' });

            setListMauIn(() => [dataNew, ...lstMauIn]);
            setIdMauInChosed(data.id);

            setNewMauIn(() => {
                return {
                    ...newMauIn,
                    id: dataNew.id,
                    loaiChungTu: idLoaiChungTu,
                    tenMauIn: dataMauIn.tenMauIn,
                    noiDungMauIn: dataMauIn.noiDungMauIn
                };
            });
        } else {
            await MauInServices.UpdatetMauIn(dataNew);
            setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật mẫu in thành công' });

            setNewMauIn(() => {
                return {
                    ...newMauIn,
                    id: dataNew.id,
                    loaiChungTu: idLoaiChungTu,
                    tenMauIn: dataMauIn.tenMauIn,
                    noiDungMauIn: dataMauIn.noiDungMauIn
                };
            });

            setListMauIn(() =>
                lstMauIn.map((x: MauInDto) => {
                    if (x.id === dataNew.id) {
                        return {
                            ...x,
                            laMacDinh: dataNew.laMacDinh,
                            tenMauIn: dataNew.tenMauIn,
                            noiDungMauIn: dataNew.noiDungMauIn
                        };
                    } else {
                        return x;
                    }
                })
            );
        }
    };

    const UpdateMauIn = async () => {
        await MauInServices.UpdatetMauIn(newMauIn);
        setObjAlert({ ...objAlert, show: true, mes: 'Cập nhật mẫu in thành công' });
    };

    const tenLoaiChungTu = () => {
        let sLoai = '';
        switch (idLoaiChungTu) {
            case 1:
                sLoai = 'HD';
                break;
            case 11:
                sLoai = 'SQPT';
                break;
            case 12:
                sLoai = 'SQPC';
                break;
        }
        return sLoai;
    };
    console.log('pagemauin');

    const GetContentMauInMacDinh = async (loai = 1) => {
        //Loai (1.k80,2.a4)
        const data = await MauInServices.GetContentMauInMacDinh(loai, tenLoaiChungTu().toString());
        setHtml(data);
    };

    // this func onChangeCkeditor: alway render
    const onChangeCkeditor = (shtmlNew: string) => {
        BindDataPrint(shtmlNew);
        setNewMauIn(() => {
            return { ...newMauIn, noiDungMauIn: shtmlNew };
        });
    };

    return (
        <>
            <ModalAddMauIn
                lstMauIn={lstMauIn}
                idUpdate={idMauInUpdate}
                isShowModal={isShowModalAddMauIn}
                tenLoaiChungTu={tenLoaiChungTu().toString()}
                handleSave={saveMauIn}
                onClose={() => setIsShowModalAddMauIn(false)}
            />
            <SnackbarAlert
                showAlert={objAlert.show}
                type={objAlert.type}
                title={objAlert.mes}
                handleClose={() => setObjAlert({ show: false, mes: '', type: 1 })}></SnackbarAlert>
            <Grid container spacing={2} padding={2} paddingLeft={0}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={idLoaiChungTu}
                            onChange={handleChange}
                            aria-label="basic tabs example">
                            <Tab label="Hóa đơn" value={1} />
                            <Tab label="Phiếu thu" value={11} />
                            <Tab label="Phiếu chi" value={12} />
                        </Tabs>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Grid container paddingRight={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={showModalAddMauIn}>
                                        Thêm mới
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <SelectMauIn
                                        data={lstMauIn}
                                        idChosed={idMauInChosed}
                                        handleChange={changeMauIn}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    {idMauInChosed.length === 36 && (
                                        <Stack direction="row" spacing={1}>
                                            <OpenInNew
                                                sx={{ width: 40, height: 40, padding: '8px' }}
                                                onClick={() => {
                                                    setIsShowModalAddMauIn(true);
                                                    setIdMauInUpdate(newMauIn.id);
                                                }}
                                            />
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                fullWidth
                                                onClick={UpdateMauIn}>
                                                Lưu
                                            </Button>
                                        </Stack>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <CustomCkeditor html={html} handleChange={onChangeCkeditor} />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <div
                        className="ck-content"
                        dangerouslySetInnerHTML={{ __html: dataPrint }}></div>
                </Grid>
            </Grid>
        </>
    );
}
