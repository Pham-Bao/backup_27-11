import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography,
    Button
} from '@mui/material';
import { useState } from 'react';
import { OpenInNew, LocalOffer } from '@mui/icons-material';
import { SuggestNhomKhachDto } from '../../services/suggests/dto/SuggestNhomKhachDto';
import utils from '../../utils/utils'; // func common
import { red } from '@mui/material/colors';
import abpCustom from '../abp-custom';

export default function AccordionNhomKhachHang({ dataNhomKhachHang, clickTreeItem }: any) {
    const [rowHover, setRowHover] = useState<SuggestNhomKhachDto>({} as SuggestNhomKhachDto);
    const [isHover, setIsHover] = useState(false);
    const [idChosing, setIdChosing] = useState('');

    const handleHover = (event: any, rowData: any, index: number) => {
        const data = JSON.parse(JSON.stringify(rowData));
        const objNhomKhach: SuggestNhomKhachDto = { id: data.id, tenNhomKhach: data.tenNhomKhach };
        switch (event.type) {
            case 'mouseenter': // enter
                setIsHover(true);
                break;
            case 'mouseleave': //leave
                setIsHover(false);
                break;
        }
        setRowHover(objNhomKhach);
    };
    const handleClickTreeItem = (isEdit = false, idChosing: string) => {
        if (utils.checkNull(idChosing)) {
            clickTreeItem(isEdit, null);
        } else {
            clickTreeItem(isEdit, rowHover);
        }

        setIdChosing(idChosing);
    };
    return (
        <>
            <Accordion
                disableGutters
                sx={{
                    border: 'none!important',
                    marginTop: '12px',
                    boxShadow: 'unset',
                    '&.MuiAccordion-root::before': { content: 'none' }
                }}>
                <AccordionSummary
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: idChosing === '' ? 'var(--color-bg)' : '',
                        borderRadius: '8px',
                        '&:hover': {
                            bgcolor: 'var(--color-bg)'
                        }
                    }}>
                    <LocalOffer sx={{ color: 'var(--color-main)' }} />
                    <Typography
                        variant="subtitle1"
                        color="#333233"
                        fontSize="14px"
                        fontWeight="700"
                        textTransform="capitalize"
                        sx={{
                            marginLeft: '9px',
                            alignItems: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 1,
                            paddingRight: '20px'
                        }}
                        onClick={() => handleClickTreeItem(false, '')}
                        title={'Tất cả'}>
                        Tất cả
                    </Typography>
                </AccordionSummary>
            </Accordion>
            {dataNhomKhachHang?.map((item: any, index: any) => (
                <Accordion
                    disableGutters
                    key={index}
                    sx={{
                        border: 'none!important',
                        marginTop: '12px',
                        boxShadow: 'unset',
                        '&.MuiAccordion-root::before': { content: 'none' }
                    }}>
                    <AccordionSummary
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: idChosing === item.id ? 'var(--color-bg)' : '',
                            borderRadius: '8px',
                            '&:hover': {
                                bgcolor: 'var(--color-bg)'
                            }
                        }}
                        onMouseLeave={(event: any) => {
                            handleHover(event, item, index);
                        }}
                        onMouseEnter={(event: any) => {
                            handleHover(event, item, index);
                        }}>
                        <LocalOffer
                            sx={{
                                color:
                                    index % 3 == 1
                                        ? '#5654A8'
                                        : index % 3 == 2
                                        ? '#d525a1'
                                        : '#FF5677'
                            }}
                        />
                        <Typography
                            variant="subtitle1"
                            color="#333233"
                            fontSize="14px"
                            fontWeight="700"
                            textTransform="capitalize"
                            sx={{
                                marginLeft: '9px',
                                alignItems: 'center',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 1,
                                paddingRight: '20px'
                            }}
                            onClick={() => handleClickTreeItem(false, item.id)}
                            title={item.tenNhomKhach}>
                            {item.tenNhomKhach}
                        </Typography>
                        {isHover &&
                            item.id !== '' &&
                            rowHover.id === item.id &&
                            !abpCustom.isGrandPermission('Pages.NhomKhach.Update') && (
                                <OpenInNew
                                    onClick={() => handleClickTreeItem(true, item.id)}
                                    sx={{ position: 'absolute', right: 16 }}
                                />
                            )}
                    </AccordionSummary>
                </Accordion>
            ))}
        </>
    );
}
