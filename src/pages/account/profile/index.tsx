import {
    Box,
    Button,
    CircularProgress,
    FormGroup,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { observer } from 'mobx-react';
import { Component, ReactNode } from 'react';
import UserStore from '../../../stores/userStore';
import AppConsts from '../../../lib/appconst';
import userService from '../../../services/user/userService';
import { enqueueSnackbar } from 'notistack';
import { Visibility, VisibilityOff } from '@mui/icons-material';
class ProfileScreen extends Component {
    state = {
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
        profileAvartar: ''
    };
    componentDidMount(): void {
        this.getData();
    }

    getData = async () => {
        try {
            await UserStore.getForUpdateProfile();
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };
    render(): ReactNode {
        const { profileDto } = UserStore;
        const initChangePasswordValues = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
        const profileSchema = Yup.object().shape({
            surname: Yup.string().required('Tên không được để trống'),
            name: Yup.string().required('Họ không được để trống'),
            emailAddress: Yup.string().matches(AppConsts.emailRegex, 'Email không hợp lệ'),
            userName: Yup.string().required('Tên truy cập là bắt buộc'),
            phoneNumber: Yup.string().matches(AppConsts.phoneRegex, 'Số điện thoại không hợp lệ')
        });
        const changePasswordSchema = Yup.object({
            currentPassword: Yup.string().required('Vui lòng nhập mật khẩu hiện tại.'),
            newPassword: Yup.string()
                .min(6, 'Mật khẩu phải tối thiểu 6 ký tự')
                .required('Mật khẩu không được để trống'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), ''], 'Mật khẩu xác nhận phải trùng khớp')
                .required('Xác nhận mật khẩu là bắt buộc')
        });
        const LableForm = (text: string) => {
            return (
                <Typography
                    sx={{ marginTop: 2, marginBottom: 1 }}
                    variant="h3"
                    fontSize="14px"
                    fontWeight="500"
                    fontFamily="Roboto"
                    fontStyle="normal"
                    //color="#4C4B4C"
                >
                    {text}
                </Typography>
            );
        };
        if (!profileDto) {
            return <CircularProgress />; // Replace Spinner with your loading component
        }
        return (
            <Box paddingTop={'16px'}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} md="auto" display="flex" alignItems="center" gap="10px">
                        <Typography variant="h1" fontSize="18px" fontWeight="700" color="#0C050A">
                            Hồ sơ tài khoản
                        </Typography>
                    </Grid>
                </Grid>
                <Box padding={2} bgcolor="#fff">
                    <Grid
                        container
                        columnSpacing={12}
                        rowSpacing={4}
                        justifyContent="space-evenly"
                        alignItems={'center'}>
                        <Grid item xs={12} sm={5}>
                            <Box>
                                <Typography
                                    variant="h1"
                                    fontSize="16px"
                                    fontWeight="700"
                                    //color="#212B36"
                                >
                                    Thông tin tài khoản
                                </Typography>
                                {/* <Typography
                                    sx={{ marginTop: 2 }}
                                    variant="h3"
                                    fontSize="14px"
                                    fontWeight="400"
                                    fontFamily="Roboto"
                                    fontStyle="normal"
                                    color="#637381">
                                    Chỉnh sửa thông tin
                                </Typography> */}
                                <Box>
                                    <Formik
                                        initialValues={profileDto}
                                        validationSchema={profileSchema}
                                        onSubmit={async (values) => {
                                            const createOrEdit = await userService.updateProfile(
                                                values
                                            );
                                            createOrEdit != false
                                                ? enqueueSnackbar('Cập nhật thành công', {
                                                      variant: 'success',
                                                      autoHideDuration: 3000
                                                  })
                                                : enqueueSnackbar(
                                                      'Có lỗi sảy ra vui lòng thử lại sau',
                                                      {
                                                          variant: 'error',
                                                          autoHideDuration: 3000
                                                      }
                                                  );
                                        }}>
                                        {({ handleChange, errors, values }) => (
                                            <Form
                                                onKeyPress={(
                                                    event: React.KeyboardEvent<HTMLFormElement>
                                                ) => {
                                                    if (event.key === 'Enter') {
                                                        event.preventDefault(); // Prevent form submission
                                                    }
                                                }}>
                                                <Grid container alignItems={'center'} spacing={2}>
                                                    <Grid item container xs={5}>
                                                        <FormGroup>
                                                            {LableForm('Họ')}
                                                            <TextField
                                                                size="small"
                                                                name="name"
                                                                fullWidth
                                                                value={values.name}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.name && (
                                                                <small className="text-danger">
                                                                    {errors.name}
                                                                </small>
                                                            )}
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item xs={7}>
                                                        <FormGroup>
                                                            {LableForm('Tên')}
                                                            <TextField
                                                                size="small"
                                                                name="surname"
                                                                fullWidth
                                                                value={values.surname}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.surname && (
                                                                <small className="text-danger">
                                                                    {errors.surname}
                                                                </small>
                                                            )}
                                                        </FormGroup>
                                                    </Grid>
                                                </Grid>
                                                <FormGroup>
                                                    {LableForm('Tên đăng nhập')}
                                                    <TextField
                                                        size="small"
                                                        disabled
                                                        fullWidth
                                                        name="userName"
                                                        value={values.userName}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.userName && (
                                                        <small className="text-danger">
                                                            {errors.userName}
                                                        </small>
                                                    )}
                                                </FormGroup>
                                                <FormGroup>
                                                    {LableForm('Số điện thoại')}
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        name="phoneNumber"
                                                        value={values.phoneNumber}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.phoneNumber && (
                                                        <small className="text-danger">
                                                            {errors.phoneNumber}
                                                        </small>
                                                    )}
                                                </FormGroup>
                                                <FormGroup>
                                                    {LableForm('Địa chỉ email')}
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        name="emailAddress"
                                                        value={values.emailAddress}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.emailAddress && (
                                                        <small className="text-danger">
                                                            {errors.emailAddress}
                                                        </small>
                                                    )}
                                                </FormGroup>
                                                <Button
                                                    type="submit"
                                                    variant="outlined"
                                                    className="btn-container-hover"
                                                    sx={{
                                                        textTransform: 'none',
                                                        width: '100%',
                                                        height: '48px',
                                                        marginTop: 2,
                                                        border: 'none',

                                                        ':hover': {
                                                            backgroundColor: '#009EF7',
                                                            border: 'none'
                                                        }
                                                    }}>
                                                    <Typography
                                                        color={'#FFFAFF'}
                                                        fontSize="14px"
                                                        fontWeight="400"
                                                        fontFamily="Roboto"
                                                        fontStyle="normal">
                                                        Cập nhật ngay
                                                    </Typography>
                                                </Button>
                                            </Form>
                                        )}
                                    </Formik>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            <Box>
                                <Typography
                                    variant="h1"
                                    fontSize="16px"
                                    fontWeight="700"
                                    color="#212B36">
                                    Mật khẩu
                                </Typography>
                                <Formik
                                    initialValues={initChangePasswordValues}
                                    validationSchema={changePasswordSchema}
                                    onSubmit={async (values) => {
                                        const createOrEdit = await userService.updatePassword({
                                            currentPassword: values.currentPassword,
                                            newPassword: values.newPassword
                                        });
                                        createOrEdit === true
                                            ? enqueueSnackbar('Cập nhật mật khẩu thành công', {
                                                  variant: 'success',
                                                  autoHideDuration: 3000
                                              })
                                            : enqueueSnackbar(
                                                  'Có lỗi sảy ra vui lòng thử lại sau',
                                                  {
                                                      variant: 'error',
                                                      autoHideDuration: 3000
                                                  }
                                              );
                                    }}>
                                    {({ handleChange, values, errors }) => (
                                        <Form
                                            onKeyPress={(
                                                event: React.KeyboardEvent<HTMLFormElement>
                                            ) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault(); // Prevent form submission
                                                }
                                            }}>
                                            <FormGroup>
                                                {LableForm('Mật khẩu hiện tại')}
                                                <TextField
                                                    size="small"
                                                    type={
                                                        this.state.showCurrentPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    name="currentPassword"
                                                    value={values.currentPassword}
                                                    onChange={handleChange}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    edge="end"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showCurrentPassword:
                                                                                !this.state
                                                                                    .showCurrentPassword
                                                                        });
                                                                    }}>
                                                                    {this.state
                                                                        .showCurrentPassword ? (
                                                                        <VisibilityOff />
                                                                    ) : (
                                                                        <Visibility />
                                                                    )}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                                {errors.currentPassword && (
                                                    <small className="text-danger">
                                                        {errors.currentPassword}
                                                    </small>
                                                )}
                                            </FormGroup>
                                            <FormGroup>
                                                {LableForm('Mật khẩu mới')}
                                                <TextField
                                                    size="small"
                                                    type={
                                                        this.state.showNewPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    name="newPassword"
                                                    value={values.newPassword}
                                                    onChange={handleChange}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    edge="end"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showNewPassword:
                                                                                !this.state
                                                                                    .showNewPassword
                                                                        });
                                                                    }}>
                                                                    {this.state.showNewPassword ? (
                                                                        <VisibilityOff />
                                                                    ) : (
                                                                        <Visibility />
                                                                    )}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                                {errors.newPassword && (
                                                    <small className="text-danger">
                                                        {errors.newPassword}
                                                    </small>
                                                )}
                                            </FormGroup>
                                            <FormGroup>
                                                {LableForm('Nhập lại mật khẩu mới')}
                                                <TextField
                                                    size="small"
                                                    type={
                                                        this.state.showConfirmPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    name="confirmPassword"
                                                    value={values.confirmPassword}
                                                    onChange={handleChange}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    edge="end"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showConfirmPassword:
                                                                                !this.state
                                                                                    .showConfirmPassword
                                                                        });
                                                                    }}>
                                                                    {this.state
                                                                        .showConfirmPassword ? (
                                                                        <VisibilityOff />
                                                                    ) : (
                                                                        <Visibility />
                                                                    )}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                                {errors.confirmPassword && (
                                                    <small className="text-danger">
                                                        {errors.confirmPassword}
                                                    </small>
                                                )}
                                            </FormGroup>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                className="btn-container-hover"
                                                sx={{
                                                    textTransform: 'none',
                                                    height: '48px',
                                                    width: '100%',
                                                    marginTop: 2,
                                                    border: 'none'
                                                }}>
                                                <Typography
                                                    color={'#FFFAFF'}
                                                    fontSize="14px"
                                                    fontWeight="400"
                                                    fontFamily="Roboto"
                                                    fontStyle="normal">
                                                    Lưu
                                                </Typography>
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        );
    }
}
export default observer(ProfileScreen);
