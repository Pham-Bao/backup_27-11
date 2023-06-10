import React, { ChangeEventHandler } from 'react';
import AppComponentBase from '../../components/AppComponentBase';
import { Button, Box, Typography, Grid, TextField, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import roleService from '../../services/role/roleService';
import AddIcon from '../../images/add.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { GetAllRoleOutput } from '../../services/role/dto/getAllRoleOutput';
import '../../custom.css';
import ConfirmDelete from '../../components/AlertDialog/ConfirmDelete';
import DownloadIcon from '../../images/download.svg';
import UploadIcon from '../../images/upload.svg';
import CreateOrEditRoleModal from './components/create-or-edit-role';
import { PermissionTree } from '../../services/role/dto/permissionTree';
import { CreateOrEditRoleDto } from '../../services/role/dto/createOrEditRoleDto';
import { ReactComponent as IconSorting } from '../../images/column-sorting.svg';
import { TextTranslate } from '../../components/TableLanguage';
import { permissionCheckboxTree } from '../../services/role/dto/permissionCheckboxTree';
import ActionMenuTable from '../../components/Menu/ActionMenuTable';
import CustomTablePagination from '../../components/Pagination/CustomTablePagination';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRoleProps {}

export interface IRoleState {
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    roleId: number;
    filter: string;
    listRole: GetAllRoleOutput[];
    totalCount: number;
    permissionTree: PermissionTree[];
    roleEdit: CreateOrEditRoleDto;
    currentPage: number;
    totalPage: number;
    startIndex: number;
    isShowConfirmDelete: boolean;
}
class RoleScreen extends AppComponentBase<IRoleProps> {
    state = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        roleId: 0,
        filter: '',
        listRole: [] as GetAllRoleOutput[],
        totalCount: 0,
        permissionTree: [] as PermissionTree[],
        roleEdit: {
            description: '',
            displayName: '',
            name: '',
            grantedPermissionNames: [],
            id: 0
        } as CreateOrEditRoleDto,
        currentPage: 1,
        totalPage: 0,
        startIndex: 1,
        isShowConfirmDelete: false,
        selectedRowId: 0,
        anchorEl: null
    };

    async componentDidMount() {
        await this.getAll();
    }

    async getAll() {
        const roles = await roleService.getAll({
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.currentPage,
            keyword: this.state.filter
        });
        const permissionAll = [] as permissionCheckboxTree[];
        const permissionTree = await roleService.getAllPermissionTree();
        console.log(permissionAll);
        this.setState({
            listRole: roles.items,
            totalCount: roles.totalCount,
            permissionTree: permissionTree,
            totalPage: Math.ceil(roles.totalCount / this.state.maxResultCount)
        });
    }
    handleSearch: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: any) => {
        const filter = event.target.value;
        this.setState({ filter: filter }, async () => this.getAll());
    };

    handlePageChange = async (event: any, value: any) => {
        await this.setState({
            currentPage: value,
            skipCount: value
        });
        this.getAll();
    };

    Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        });
    };

    async createOrUpdateModalOpen(id: number) {
        if (id === 0) {
            const allPermission = await roleService.getAllPermissionTree();
            await this.setState({
                permissionTree: allPermission
            });
        } else {
            const roleForEdit = await roleService.getRoleForEdit(id);
            const allPermission = await roleService.getAllPermissionTree();
            await this.setState({
                permissionTree: allPermission,
                roleId: id,
                roleEdit: roleForEdit
            });
        }

        this.setState({ roleId: id });
        this.Modal();
    }
    handleCreate = () => {
        this.getAll();
        this.setState({ modalVisible: false });
    };
    onShowDelete = () => {
        this.setState({
            isShowConfirmDelete: !this.state.isShowConfirmDelete
        });
    };
    onOkDelete = () => {
        this.delete(this.state.selectedRowId);
        this.onShowDelete();
    };
    async delete(id: number) {
        await roleService.delete(id);
        this.getAll();
    }
    handleOpenMenu = (event: any, rowId: any) => {
        this.setState({ anchorEl: event.currentTarget, selectedRowId: rowId });
    };

    handleCloseMenu = async () => {
        await this.setState({ anchorEl: null, selectedRowId: 0 });
        await this.getAll();
    };
    handleEdit = () => {
        // Handle Edit action
        this.createOrUpdateModalOpen(this.state.selectedRowId ?? 0);
        this.handleCloseMenu();
    };
    handleView = () => {
        // Handle View action
        this.handleCloseMenu();
    };
    render() {
        const columns = [
            {
                field: 'name',
                headerName: 'Tên vai trò',
                minWidth: 125,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }} title={params.value}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'description',
                headerName: 'Mô tả',
                minWidth: 125,
                flex: 1,
                renderHeader: (params: any) => (
                    <Box sx={{ fontWeight: '700' }} title={params.colDef.headerName}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            },
            {
                field: 'action',
                headerName: 'Hành động',
                maxWidth: 60,
                flex: 1,
                disableColumnMenu: true,
                renderCell: (params: any) => (
                    <Box>
                        <IconButton
                            aria-controls={`actions-menu-${params.row.id}`}
                            aria-haspopup="true"
                            onClick={(event) => {
                                this.handleOpenMenu(event, params.row.id);
                            }}>
                            <MoreHorizIcon />
                        </IconButton>
                    </Box>
                ),
                renderHeader: (params: any) => (
                    <Box sx={{ display: 'none' }}>
                        {params.colDef.headerName}
                        <IconSorting className="custom-icon" />{' '}
                    </Box>
                )
            }
        ];
        return (
            <Box paddingLeft="2.2222222222222223vw" paddingRight="2.2222222222222223vw">
                <Box>
                    <Grid container justifyContent="space-between" paddingTop="22px">
                        <Grid item>
                            <div>
                                <Box display="flex" alignItems="center" gap="10px">
                                    <Typography
                                        variant="h1"
                                        fontSize="16px"
                                        color="#333233"
                                        fontWeight="700">
                                        Danh sách vai trò
                                    </Typography>
                                    <TextField
                                        onChange={this.handleSearch}
                                        size="small"
                                        sx={{
                                            borderColor: '#E6E1E6!important',
                                            bgcolor: '#fff'
                                        }}
                                        placeholder="Tìm kiếm..."
                                        InputProps={{
                                            startAdornment: (
                                                <SearchIcon
                                                    style={{
                                                        marginRight: '8px',
                                                        color: 'gray'
                                                    }}
                                                />
                                            )
                                        }}
                                    />
                                </Box>
                            </div>
                        </Grid>
                        <Grid item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Box>
                                    <Box display="flex" alignItems="center" gap="8px">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<img src={DownloadIcon} />}
                                            sx={{
                                                height: '40px',
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                fontWeight: '400',
                                                borderColor: '#E6E1E6!important',
                                                color: '#666466',
                                                backgroundColor: '#fff!important'
                                            }}>
                                            Nhập
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<img src={UploadIcon} />}
                                            sx={{
                                                height: '40px',
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                fontWeight: '400',
                                                borderColor: '#E6E1E6!important',
                                                color: '#666466',
                                                backgroundColor: '#fff!important'
                                            }}>
                                            Xuất
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<img src={AddIcon} />}
                                            size="small"
                                            onClick={() => {
                                                this.createOrUpdateModalOpen(0);
                                            }}
                                            sx={{
                                                height: '40px',
                                                fontSize: '14px',
                                                textTransform: 'unset',
                                                fontWeight: '400',
                                                backgroundColor: '#7C3367!important'
                                            }}>
                                            Thêm vai trò
                                        </Button>
                                    </Box>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
                <Box marginTop="24px" bgcolor="#fff" borderRadius="8px">
                    <DataGrid
                        autoHeight={true}
                        columns={columns}
                        rows={this.state.listRole}
                        checkboxSelection
                        sx={{
                            '& .MuiDataGrid-iconButtonContainer': {
                                display: 'none'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#F2EBF0'
                            },
                            '& p': {
                                mb: 0
                            }
                        }}
                        hideFooter
                        hideFooterPagination
                        localeText={TextTranslate}
                    />
                    <ActionMenuTable
                        selectedRowId={this.state.selectedRowId}
                        anchorEl={this.state.anchorEl}
                        closeMenu={this.handleCloseMenu}
                        handleView={this.handleView}
                        handleEdit={this.handleEdit}
                        handleDelete={this.onShowDelete}
                    />
                    <CustomTablePagination
                        currentPage={this.state.currentPage}
                        rowPerPage={this.state.maxResultCount}
                        totalRecord={this.state.totalCount}
                        totalPage={this.state.totalPage}
                        handlePageChange={this.handlePageChange}
                    />
                </Box>
                <CreateOrEditRoleModal
                    visible={this.state.modalVisible}
                    onCancel={() =>
                        this.setState({
                            modalVisible: false
                        })
                    }
                    modalType={this.state.roleId === 0 ? 'Thêm mới quyền' : 'Cập nhật quyền'}
                    onOk={this.handleCreate}
                    permissionTree={this.state.permissionTree}
                    formRef={this.state.roleEdit}
                />
                <ConfirmDelete
                    isShow={this.state.isShowConfirmDelete}
                    onOk={this.onOkDelete}
                    onCancel={this.onShowDelete}></ConfirmDelete>
            </Box>
        );
    }
}

export default RoleScreen;
