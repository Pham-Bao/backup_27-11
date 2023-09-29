import {
    Dialog,
    DialogContent,
    DialogTitle,
    Tabs,
    Tab,
    Grid,
    Stack,
    TextField,
    FormControlLabel,
    Checkbox,
    FormGroup,
    DialogActions,
    Button,
    InputAdornment,
    IconButton
} from '@mui/material';
import DialogButtonClose from '../../../../components/Dialog/ButtonClose';
import { useContext, useEffect, useState } from 'react';
import TabPanel from '@mui/lab/TabPanel';
import AutocompleteNhanVien from '../../../../components/Autocomplete/NhanVien';
import AutocompleteChiNhanh from '../../../../components/Autocomplete/ChiNhanh';
import { CreateOrUpdateUserInput } from '../../../../services/user/dto/createOrUpdateUserInput';
import userService from '../../../../services/user/userService';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import { Box } from '@mui/system';
import CircleImageUpload from '../../../../components/ImportComponent/CircleImageUpload';
import utils from '../../../../utils/utils';
import uploadFileService from '../../../../services/uploadFileService';
import * as Yup from 'yup';
import AppConsts from '../../../../lib/appconst';
import { Formik, Form, FormikHelpers } from 'formik';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AppContext } from '../../../../services/chi_nhanh/ChiNhanhContext';
import SnackbarAlert from '../../../../components/AlertDialog/SnackbarAlert';
import RoleModel from '../../../../models/Roles/roleModel';
import { DataGrid, GridColDef, GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid';
import { RoleDto } from '../../../../services/role/dto/roleDto';
import { TextTranslate } from '../../../../components/TableLanguage';
import { IChiNhanhRoles, IUserRoleDto } from '../../../../models/Roles/userRoleDto';
import { ChiNhanhDto } from '../../../../services/chi_nhanh/Dto/chiNhanhDto';
import TableRoleChiNhanh from '../../../../components/Table/RoleChiNhanh';
import roleService from '../../../../services/role/roleService';
import { StringArraySupportOption } from 'prettier';

export default function ModalAddUser({
    isShowModal,
    dataNhanVien,
    userId,
    dataChiNhanh,
    allRoles,
    onCancel,
    onOk
}: any) {
    const appContext = useContext(AppContext);
    const chinhanhCurrent = appContext.chinhanhCurrent;
    const idChiNhanh = chinhanhCurrent?.id;
    const [tabIndex, setTabIndex] = useState('1');
    const [avatar, setAvatar] = useState('');
    const [googleDrive_fileId, setGoogleDrive_fileId] = useState('');
    const [fileImage, setFileImage] = useState<File>({} as File); // file image
    const [showPassword, setShowPassword] = useState<boolean>(false); // file image
    const [changePassword, setChangePassword] = useState<boolean>(false); // file image
    const [objAlert, setObjAlert] = useState({ show: false, type: 1, mes: '' });
    const [chiNhanhRoles, setChiNhanhRoles] = useState<IChiNhanhRoles[]>([]);
    const [lstChosed, setLstChosed] = useState<IUserRoleDto[]>([]);

    const [user, setUser] = useState<CreateOrUpdateUserInput>({
        userName: '',
        password: ''
    } as CreateOrUpdateUserInput);

    const initialValues = {
        userId: 0,
        nhanSuId: user?.nhanSuId,
        emailAddress: user?.emailAddress,
        userName: user?.userName,
        password: user?.password,
        passwordNew: user?.password,
        confirmPassword: user?.password,
        changePassword: false
    };

    const confirmPasswordValidation = (
        userId: number,
        changePassword: boolean,
        password: string,
        passwordNew: string
    ) => {
        if (userId === 0) {
            return Yup.string()
                .required('Vui lòng xác nhận mật khẩu')
                .oneOf([password], 'Mật khẩu xác nhận phải trùng khớp');
        } else {
            if (changePassword) {
                return Yup.string()
                    .required('Vui lòng xác nhận mật khẩu')
                    .oneOf([passwordNew], 'Mật khẩu xác nhận phải trùng khớp');
            }
            return Yup.string();
        }
    };

    const rules = Yup.object().shape({
        // nhanSuId: Yup.string().required('Vui lòng chọn nhân viên'),
        emailAddress: Yup.string()
            .matches(AppConsts.emailRegex, 'Email không hợp lệ')
            .required('Vui lòng nhập email'),
        userName: Yup.string().required('Vui lòng nhập tên truy cập'),
        password: Yup.string()
            .required('Vui lòng nhập mật khẩu')
            .matches(
                AppConsts.passwordRegex,
                'Mật khẩu tối thiểu 6 ký tự, phải có ít nhất 1 ký tự in hoa, 1 ký tự thường và 1 ký tự đặc biệt'
            ),
        passwordNew: Yup.string().when(['changePassword'], {
            is: (changePassword: boolean) => {
                return changePassword;
            },
            then: (schema: any) => {
                return schema.matches(
                    AppConsts.passwordRegex,
                    'Mật khẩu tối thiểu 6 ký tự, phải có ít nhất 1 ký tự in hoa, 1 ký tự thường và 1 ký tự đặc biệt'
                );
            }
        }),

        // confirmPassword: Yup.string().oneOf(
        //     [Yup.ref('password'), ''],
        //     'Mật khẩu xác nhận phải trùng khớp'
        // )
        confirmPassword: Yup.lazy((value: any, schema: any) => {
            return confirmPasswordValidation(
                schema.parent.userId,
                schema.parent.changePassword,
                schema.parent.password,
                schema.parent.passwordNew
            );
        })
    });

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue.toString());
    };

    const GetInforUser = async () => {
        const userEdit = await userService.get(userId);
        setUser(userEdit);

        initialValues.userId = userEdit?.id;
        initialValues.nhanSuId = userEdit?.nhanSuId;
        initialValues.emailAddress = userEdit?.emailAddress;
        initialValues.userName = userEdit?.userName;
        initialValues.password = '';
        initialValues.passwordNew = '';
        initialValues.confirmPassword = '';
        initialValues.changePassword = false;
    };

    useEffect(() => {
        if (isShowModal) {
            if (userId === 0) {
                setUser({
                    nhanSuId: '',
                    userName: '',
                    password: '',
                    name: '',
                    surname: '',
                    emailAddress: '',
                    phoneNumber: '',
                    idChiNhanhMacDinh: idChiNhanh,
                    isActive: true
                } as CreateOrUpdateUserInput);

                initialValues.userId = 0;
                initialValues.emailAddress = '';
                initialValues.userName = '';
                initialValues.passwordNew = '';
                initialValues.confirmPassword = '';
                initialValues.changePassword = false;
            } else {
                GetInforUser();
            }
            setChangePassword(false);
            setChiNhanhRoles(
                dataChiNhanh.map((item: ChiNhanhDto) => {
                    return {
                        idChiNhanh: item.id,
                        tenChiNhanh: item.tenChiNhanh,
                        roles: allRoles
                    } as unknown as IChiNhanhRoles;
                })
            );
        }
    }, [isShowModal]);

    const handleClickShowPassword = () => setShowPassword((show: boolean) => !show);

    const changeNhanVien = async (item: any) => {
        const arrTenNV = item?.tenNhanVien.split(' ');
        let surName = ''; // họ
        if (arrTenNV.length > 0) {
            surName = arrTenNV[0];
        }
        setUser({
            ...user,
            nhanSuId: item?.id,
            phoneNumber: item?.soDienThoai,
            name: item?.tenNhanVien,
            surname: surName
        } as CreateOrUpdateUserInput);
        setAvatar(item?.avatar);
        initialValues.nhanSuId = item?.id;
    };
    const changeChiNhanh = async (item: any) => {
        setUser({ ...user, idChiNhanhMacDinh: item?.id } as CreateOrUpdateUserInput);
    };
    const choseImage = async (pathFile: string, file: File) => {
        if (!utils.checkNull(googleDrive_fileId)) {
            await uploadFileService.GoogleApi_RemoveFile_byId(googleDrive_fileId);
        }
        setAvatar(pathFile);
        setFileImage(file);
    };
    const closeImage = () => {
        setAvatar('');
        setGoogleDrive_fileId('');
    };
    const getRoleChiNhanh_fromChild = (lst: IUserRoleDto[]) => {
        setLstChosed(lst);
    };

    const checkSaveDB = async () => {
        return true;
    };
    const saveUser = async () => {
        const userIdNew = 0;
        console.log('init ', initialValues);
        const check = await checkSaveDB();
        // if (userId == 0) {
        //     const data = await userService.CreateUser(user);
        //     if (data !== null) {
        //         userIdNew = data.id;

        //         setObjAlert({
        //             show: true,
        //             type: 1,
        //             mes: 'Thêm mới người dùng thành công'
        //         });
        //     }
        //     console.log('CreateUser ', data, user);
        // } else {
        //     const data = await userService.UpdateUser(user);
        //     if (data !== null) {
        //         userIdNew = userId;
        //         setObjAlert({
        //             show: true,
        //             type: 1,
        //             mes: 'Cập nhật người dùng thành công'
        //         });
        //     }
        // }
        // // todo userRole: list [userId, roleId, idChiNhanh]
        // await roleService.CreateRole_byChiNhanhOfUser(userIdNew, lstChosed);
        // onOk();
    };

    const iconPassword =
        userId === 0
            ? {
                  endAdornment: (
                      <InputAdornment position="end">
                          <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              // onMouseDown={
                              //     handleMouseDownPassword
                              // }
                              edge="end">
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                      </InputAdornment>
                  )
              }
            : {};
    return (
        <>
            <Dialog open={isShowModal} maxWidth={'sm'} fullWidth onClose={onCancel}>
                <DialogTitle>
                    <Box className="modal-title">
                        {userId === 0 ? 'Thêm mới' : 'Cập nhật'} người dùng
                    </Box>

                    <DialogButtonClose onClose={onCancel} />
                </DialogTitle>
                <DialogContent sx={{ '& .MuiTabPanel-root': { padding: 0 } }}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={rules}
                        onSubmit={saveUser}>
                        {({
                            isSubmitting,
                            handleChange,
                            values,
                            errors,
                            touched,
                            setFieldValue
                        }) => (
                            <Form>
                                <TabContext value={tabIndex}>
                                    <TabList onChange={handleChangeTab}>
                                        <Tab label="Người dùng" value={'1'}></Tab>
                                        <Tab label="Vai trò" value={'2'}></Tab>
                                    </TabList>
                                    <TabPanel value="1">
                                        <Grid container spacing={1}>
                                            <Grid item xs={4}>
                                                <CircleImageUpload
                                                    pathImg={avatar}
                                                    handeChoseImage={choseImage}
                                                    handleCloseImage={closeImage}
                                                />
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Stack spacing={2}>
                                                    <AutocompleteNhanVien
                                                        label="Chọn nhân sự đã có"
                                                        helperText={
                                                            touched.nhanSuId &&
                                                            errors.nhanSuId && (
                                                                <span>{errors.nhanSuId}</span>
                                                            )
                                                        }
                                                        dataNhanVien={dataNhanVien}
                                                        idChosed={user?.nhanSuId}
                                                        handleChoseItem={(item: any) => {
                                                            changeNhanVien(item);
                                                            setFieldValue('nhanSuId', item?.id);
                                                        }}
                                                    />
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        name="userName"
                                                        label={
                                                            <label style={{ fontSize: '13px' }}>
                                                                Tên truy cập
                                                                <span
                                                                    style={{
                                                                        color: 'red',
                                                                        marginLeft: '2px'
                                                                    }}>
                                                                    *
                                                                </span>
                                                            </label>
                                                        }
                                                        value={values?.userName || ''}
                                                        onChange={(e) => {
                                                            setFieldValue(
                                                                'userName',
                                                                e.target.value
                                                            );
                                                            setUser({
                                                                ...user,
                                                                userName: e.target.value
                                                            });
                                                        }}
                                                        helperText={
                                                            touched.userName &&
                                                            errors.userName && (
                                                                <span>{errors.userName}</span>
                                                            )
                                                        }
                                                    />
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        name="emailAddress"
                                                        label={
                                                            <label style={{ fontSize: '13px' }}>
                                                                Email
                                                                <span
                                                                    style={{
                                                                        color: 'red',
                                                                        marginLeft: '2px'
                                                                    }}>
                                                                    *
                                                                </span>
                                                            </label>
                                                        }
                                                        value={values?.emailAddress || ''}
                                                        onChange={(e) => {
                                                            setFieldValue(
                                                                'emailAddress',
                                                                e.target.value
                                                            );
                                                            setUser({
                                                                ...user,
                                                                emailAddress: e.target.value
                                                            });
                                                        }}
                                                        helperText={
                                                            touched.emailAddress &&
                                                            errors.emailAddress && (
                                                                <span>{errors.emailAddress}</span>
                                                            )
                                                        }
                                                    />
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2} paddingTop={2}>
                                            <Grid item xs={12}>
                                                <AutocompleteChiNhanh
                                                    label="Chi nhánh mặc định"
                                                    dataChiNhanh={dataChiNhanh}
                                                    idChosed={user?.idChiNhanhMacDinh || ''}
                                                    handleChoseItem={changeChiNhanh}
                                                />
                                            </Grid>
                                            {userId !== 0 && (
                                                <Grid item xs={12}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                size="small"
                                                                checked={values?.changePassword}
                                                                onChange={() => {
                                                                    setChangePassword(
                                                                        () => !changePassword
                                                                    );
                                                                    setFieldValue(
                                                                        'changePassword',
                                                                        !changePassword
                                                                    );
                                                                }}
                                                            />
                                                        }
                                                        label="Đổi mật khẩu"
                                                    />
                                                </Grid>
                                            )}

                                            {(changePassword || userId === 0) && (
                                                <Grid item xs={12}>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        name="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={values?.password || ''}
                                                        onChange={(e) => {
                                                            setFieldValue(
                                                                'password',
                                                                e.target.value
                                                            );
                                                            setUser({
                                                                ...user,
                                                                password: e.target.value
                                                            });
                                                        }}
                                                        label={
                                                            <label style={{ fontSize: '13px' }}>
                                                                Mật khẩu{' '}
                                                                {userId === 0 ? '' : 'hiện tại'}
                                                                <span
                                                                    style={{
                                                                        color: 'red',
                                                                        marginLeft: '2px'
                                                                    }}>
                                                                    *
                                                                </span>
                                                            </label>
                                                        }
                                                        helperText={
                                                            touched.password &&
                                                            errors.password && (
                                                                <span>{errors.password}</span>
                                                            )
                                                        }
                                                        InputProps={iconPassword}
                                                    />
                                                </Grid>
                                            )}

                                            {changePassword && (
                                                <>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sx={{
                                                            display: userId !== 0 ? '' : 'none'
                                                        }}>
                                                        <TextField
                                                            size="small"
                                                            fullWidth
                                                            name="passwordNew"
                                                            type="password"
                                                            value={values?.passwordNew || ''}
                                                            label={
                                                                <label style={{ fontSize: '13px' }}>
                                                                    Mật khẩu mới
                                                                    <span
                                                                        style={{
                                                                            color: 'red',
                                                                            marginLeft: '2px'
                                                                        }}>
                                                                        *
                                                                    </span>
                                                                </label>
                                                            }
                                                            onChange={handleChange}
                                                            helperText={
                                                                touched.passwordNew &&
                                                                errors.passwordNew && (
                                                                    <span>
                                                                        {errors.passwordNew}
                                                                    </span>
                                                                )
                                                            }
                                                        />
                                                    </Grid>
                                                </>
                                            )}
                                            {(changePassword || userId === 0) && (
                                                <Grid item xs={12}>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        type="password"
                                                        name="confirmPassword"
                                                        onChange={handleChange}
                                                        // onChange={(e) => {
                                                        //     handleChange;
                                                        //     setUser({
                                                        //         ...user,
                                                        //         confirmPassword: e.target.value
                                                        //     });
                                                        // }}
                                                        value={values?.confirmPassword || ''}
                                                        label={
                                                            <label style={{ fontSize: '13px' }}>
                                                                Nhập lại mật khẩu
                                                                <span
                                                                    style={{
                                                                        color: 'red',
                                                                        marginLeft: '2px'
                                                                    }}>
                                                                    *
                                                                </span>
                                                            </label>
                                                        }
                                                        helperText={
                                                            touched.confirmPassword &&
                                                            errors.confirmPassword && (
                                                                <span>
                                                                    {errors.confirmPassword}
                                                                </span>
                                                            )
                                                        }
                                                    />
                                                </Grid>
                                            )}

                                            <Grid
                                                item
                                                xs={12}
                                                sx={{
                                                    paddingTop:
                                                        userId !== 0 && !changePassword
                                                            ? '0px!important'
                                                            : '8px!important'
                                                }}>
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={<Checkbox size="small" />}
                                                        label="Là quản trị viên"
                                                        name="isAdmin"
                                                        value={
                                                            user?.isAdmin === true ? true : false
                                                        }
                                                        onChange={() =>
                                                            setUser({
                                                                ...user,
                                                                isAdmin: !user?.isAdmin
                                                            })
                                                        }
                                                        checked={
                                                            user?.isAdmin === true ? true : false
                                                        }
                                                    />
                                                    {userId !== 0 && !user?.isActive && (
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    name="isActive"
                                                                    value={user?.isActive}
                                                                    onChange={handleChange}
                                                                    checked={user?.isActive}
                                                                    size="small"
                                                                />
                                                            }
                                                            label="Kích hoạt"
                                                        />
                                                    )}
                                                </FormGroup>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value="2">
                                        <TableRoleChiNhanh
                                            userId={userId}
                                            allRoles={allRoles}
                                            chiNhanhRoles={chiNhanhRoles}
                                            passDataToParent={getRoleChiNhanh_fromChild}
                                        />
                                    </TabPanel>
                                </TabContext>
                                <Grid container justifyContent={'end'}>
                                    <Stack
                                        spacing={1}
                                        justifyContent={'flex-end'}
                                        direction={'row'}>
                                        <Button variant="outlined" onClick={onCancel}>
                                            Hủy
                                        </Button>
                                        <Button variant="contained" type="submit">
                                            Lưu
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
}