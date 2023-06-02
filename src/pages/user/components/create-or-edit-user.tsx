import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
    Box,
    Tab,
    Tabs,
    TextField,
    Checkbox,
    Button,
    FormGroup,
    FormControlLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import fileIcon from '../../../images/file.svg';
import fileUpload from '../../../images/fi_upload-cloud.svg';
import userService from '../../../services/user/userService';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { CreateOrUpdateUserInput } from '../../../services/user/dto/createOrUpdateUserInput';
import { SuggestNhanSuDto } from '../../../services/suggests/dto/SuggestNhanSuDto';
import { GetRoles } from '../../../services/user/dto/getRolesOuput';
import TabList from '@mui/lab/TabList';
import rules from './createOrUpdateUser.validation';
export interface ICreateOrEditUserProps {
    visible: boolean;
    onCancel: () => void;
    modalType: string;
    onOk: () => void;
    formRef: CreateOrUpdateUserInput;
    userId: number;
    roles: GetRoles[];
    suggestNhanSu: SuggestNhanSuDto[];
}
class CreateOrEditUser extends React.Component<ICreateOrEditUserProps> {
    state = {
        confirmDirty: false,
        tabIndex: '1'
    };

    setConfirmDirty = (value: boolean) => {
        this.setState({
            confirmDirty: value
        });
    };
    handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        this.setState({ tabIndex: newValue });
    };

    handleSubmit = async (values: CreateOrUpdateUserInput) => {
        try {
            const { formRef, onOk } = this.props;
            if (formRef.id === 0) {
                await userService.create(values);
            } else {
                await userService.update({
                    id: formRef.id,
                    nhanSuId: values.nhanSuId,
                    emailAddress: values.emailAddress,
                    phoneNumber: values.phoneNumber,
                    isActive: values.isActive,
                    name: values.name,
                    surname: values.surname,
                    userName: values.userName,
                    roleNames: values.roleNames
                });
            }
            onOk();
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        const { visible, onCancel, modalType, userId, roles, suggestNhanSu, formRef } = this.props;

        const options = roles.map((x) => ({
            label: x.displayName,
            value: x.normalizedName
        }));

        const initialValues = {
            id: formRef.id,
            nhanSuId: formRef.nhanSuId,
            surname: formRef.surname,
            name: formRef.name,
            emailAddress: formRef.emailAddress,
            phoneNumber: formRef.phoneNumber,
            userName: formRef.userName,
            password: formRef.password,
            isActive: formRef.isActive,
            roleNames: formRef.roleNames
        };

        return (
            <Dialog open={visible} onClose={onCancel} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Typography
                        variant="h3"
                        fontSize="24px"
                        color="rgb(51, 50, 51)"
                        fontWeight="700">
                        {modalType}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onCancel}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8
                        }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={this.handleSubmit}
                        validationSchema={rules}>
                        {({ handleChange, values, errors, touched }) => (
                            <Form>
                                <TabContext value={this.state.tabIndex}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList
                                            onChange={this.handleTabChange}
                                            aria-label="lab API tabs example">
                                            <Tab
                                                label="User detail"
                                                value="1"
                                                sx={{ textTransform: 'unset!important' }}
                                            />
                                            <Tab
                                                label="Role"
                                                value="2"
                                                sx={{ textTransform: 'unset!important' }}
                                            />
                                        </TabList>
                                    </Box>
                                    <TabPanel value="1">
                                        <Grid container sx={{ '& label': { marginBottom: '4px' } }}>
                                            <Grid item sm={4} position="relative">
                                                <Box
                                                    padding="20px"
                                                    position="absolute"
                                                    textAlign="center">
                                                    <img src={fileIcon} alt="file icon" />
                                                    <Box display="flex" gap="10px">
                                                        <img src={fileUpload} alt="file upload" />
                                                        <Typography
                                                            variant="body1"
                                                            fontSize="14px"
                                                            fontWeight="500"
                                                            color="#7C3367"
                                                            marginTop="16px">
                                                            Tải ảnh lên
                                                        </Typography>
                                                    </Box>
                                                    <input
                                                        type="file"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '0',
                                                            left: '0',
                                                            height: '100%',
                                                            width: '100%',
                                                            opacity: '0',
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                    <Typography variant="body1" fontSize="14px">
                                                        File định dạng{' '}
                                                        <b style={{ display: 'block' }}>
                                                            jpeg, png
                                                        </b>
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                item
                                                sm={8}
                                                display="flex"
                                                flexDirection="column"
                                                gap="16px">
                                                <FormGroup>
                                                    <Typography variant="body1" fontSize="14px">
                                                        Nhân sự đã có
                                                    </Typography>
                                                    <Select
                                                        fullWidth
                                                        name="nhanSuId"
                                                        value={values.nhanSuId}
                                                        onChange={handleChange}
                                                        size="small">
                                                        {suggestNhanSu.map((item) => (
                                                            <MenuItem key={item.id} value={item.id}>
                                                                {item.tenNhanVien}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormGroup>
                                                <FormGroup>
                                                    <label style={{ fontSize: '14px' }}>
                                                        Họ
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                                marginLeft: '2px'
                                                            }}>
                                                            *
                                                        </span>
                                                    </label>
                                                    <TextField
                                                        name="name"
                                                        type="text"
                                                        value={values.name}
                                                        fullWidth
                                                        onChange={handleChange}
                                                        size="small"
                                                    />
                                                    {touched.name && errors.name && (
                                                        <div>{errors.name}</div>
                                                    )}
                                                </FormGroup>
                                                <FormGroup>
                                                    <label style={{ fontSize: '14px' }}>
                                                        Tên lót
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                                marginLeft: '2px'
                                                            }}>
                                                            *
                                                        </span>
                                                    </label>
                                                    <TextField
                                                        type="text"
                                                        name="surname"
                                                        value={values.surname}
                                                        fullWidth
                                                        onChange={handleChange}
                                                        size="small"
                                                    />
                                                    {touched.surname && errors.surname && (
                                                        <div>{errors.surname}</div>
                                                    )}
                                                </FormGroup>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                display="flex"
                                                flexDirection="column"
                                                gap="16px">
                                                <FormGroup>
                                                    <label style={{ fontSize: '14px' }}>
                                                        Email
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                                marginLeft: '2px'
                                                            }}>
                                                            *
                                                        </span>
                                                    </label>
                                                    <TextField
                                                        type="email"
                                                        name="emailAddress"
                                                        value={values.emailAddress}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                    {touched.emailAddress &&
                                                        errors.emailAddress && (
                                                            <div>{errors.emailAddress}</div>
                                                        )}
                                                </FormGroup>
                                                <FormGroup>
                                                    <label style={{ fontSize: '14px' }}>
                                                        Số điện thoại
                                                    </label>
                                                    <TextField
                                                        type="text"
                                                        name="phoneNumber"
                                                        value={values.phoneNumber}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                    {touched.phoneNumber && errors.phoneNumber && (
                                                        <div>{errors.phoneNumber}</div>
                                                    )}
                                                </FormGroup>
                                                <FormGroup>
                                                    <label
                                                        htmlFor="email"
                                                        style={{ fontSize: '14px' }}>
                                                        Tên truy cập
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                                marginLeft: '2px'
                                                            }}>
                                                            *
                                                        </span>
                                                    </label>
                                                    <TextField
                                                        type="text"
                                                        name="userName"
                                                        value={values.userName}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                    {touched.userName && errors.userName && (
                                                        <div>{errors.userName}</div>
                                                    )}
                                                </FormGroup>
                                                {userId === 0 ? (
                                                    <>
                                                        <FormGroup>
                                                            <label style={{ fontSize: '14px' }}>
                                                                Mật khẩu
                                                                <span
                                                                    style={{
                                                                        color: 'red',
                                                                        marginLeft: '2px'
                                                                    }}>
                                                                    *
                                                                </span>
                                                            </label>
                                                            <TextField
                                                                type="text"
                                                                name="password"
                                                                value={values.password}
                                                                onChange={handleChange}
                                                                fullWidth
                                                                size="small"
                                                            />
                                                            {touched.password &&
                                                                errors.password && (
                                                                    <div>{errors.password}</div>
                                                                )}
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <label
                                                                htmlFor="email"
                                                                style={{ fontSize: '14px' }}>
                                                                Nhập lại mật khẩu
                                                                <span
                                                                    style={{
                                                                        color: 'red',
                                                                        marginLeft: '2px'
                                                                    }}>
                                                                    *
                                                                </span>
                                                            </label>
                                                            <TextField
                                                                type="text"
                                                                fullWidth
                                                                size="small"
                                                            />
                                                        </FormGroup>
                                                    </>
                                                ) : null}
                                                <FormGroup>
                                                    <FormControlLabel
                                                        name="isActive"
                                                        value={values.isActive}
                                                        onChange={handleChange}
                                                        checked={values.isActive}
                                                        control={<Checkbox />}
                                                        label="Kích hoạt"
                                                    />
                                                </FormGroup>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value="2">
                                        <Box display="flex" gap="16px">
                                            <FormGroup>
                                                {options.map((option: any) => (
                                                    <FormControlLabel
                                                        key={option.value}
                                                        value={option.value}
                                                        control={
                                                            <Checkbox
                                                                checked={values.roleNames.includes(
                                                                    option.value
                                                                )}
                                                                onChange={handleChange}
                                                                name="roleNames"
                                                                value={option.value}
                                                            />
                                                        }
                                                        label={option.label}
                                                    />
                                                ))}
                                            </FormGroup>
                                        </Box>
                                    </TabPanel>
                                </TabContext>
                                <DialogActions>
                                    <Box
                                        display="flex"
                                        marginLeft="auto"
                                        gap="8px"
                                        sx={{
                                            '& button': {
                                                textTransform: 'unset!important'
                                            }
                                        }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                borderColor: '#7C3367!important',
                                                color: '#7C3367'
                                            }}
                                            onClick={onCancel}>
                                            Hủy
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            type="button"
                                            onClick={() => {
                                                this.handleSubmit(values);
                                            }}
                                            sx={{ backgroundColor: '#7C3367!important' }}>
                                            Lưu
                                        </Button>
                                    </Box>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        );
    }
}

export default CreateOrEditUser;
