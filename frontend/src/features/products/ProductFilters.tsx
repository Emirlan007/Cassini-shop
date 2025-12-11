import React, {useState, useEffect, type SyntheticEvent} from 'react';
import {
    Box,
    Typography,
    Button,
    Chip,
    Slider,
    Checkbox,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    IconButton,
    Drawer,
    useMediaQuery,
    useTheme,
    Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import type {FilterState} from "../../types";

interface ProductFiltersProps {
    availableColors: string[];
    availableSizes: string[];
    availableMaterials: string[];
    priceRange: { min: number; max: number };
    onFilterChange: (filters: FilterState) => void;
    currentFilters: FilterState;
    categoryId: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
        availableColors,
        availableSizes,
        priceRange,
        onFilterChange,
        currentFilters,
    }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setLocalFilters(currentFilters);
    }, [currentFilters]);

    useEffect(() => {
        if (currentFilters.priceRange[0] === 0 && currentFilters.priceRange[1] === 0) {
            const newFilters = {
                ...currentFilters,
                priceRange: [priceRange.min, priceRange.max] as [number, number]
            };
            setLocalFilters(newFilters);
        }
    }, [priceRange, currentFilters]);

    const handleColorToggle = (color: string) => {
        const newColors = localFilters.colors.includes(color)
            ? localFilters.colors.filter(c => c !== color)
            : [...localFilters.colors, color];

        const newFilters: FilterState = {
            ...localFilters,
            colors: newColors
        };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSizeToggle = (size: string) => {
        const newSizes = localFilters.sizes.includes(size)
            ? localFilters.sizes.filter(s => s !== size)
            : [...localFilters.sizes, size];

        const newFilters: FilterState = {
            ...localFilters,
            sizes: newSizes
        };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePriceChange = (_: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue) && newValue.length === 2) {
            setLocalFilters({
                ...localFilters,
                priceRange: [newValue[0], newValue[1]] as [number, number]
            });
        }
    };

    const handlePriceChangeCommitted = (
        _: Event | SyntheticEvent,
        newValue: number | number[]
    ) => {
        if (Array.isArray(newValue) && newValue.length === 2) {
            const newFilters: FilterState = {
                ...localFilters,
                priceRange: [newValue[0], newValue[1]] as [number, number]
            };
            onFilterChange(newFilters);
        }
    };

    const handleCheckboxChange = (key: 'inStock' | 'isNew' | 'isPopular') => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newFilters: FilterState = {
            ...localFilters,
            [key]: event.target.checked
        };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleResetFilters = () => {
        const resetFilters: FilterState = {
            colors: [],
            sizes: [],
            priceRange: [priceRange.min, priceRange.max],
            inStock: undefined,
            isNew: undefined,
            isPopular: undefined,
            material: undefined,
        };

        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    const renderFilterContent = () => (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#660033' }}>
                    Фильтры
                </Typography>
                <Button
                    variant="text"
                    onClick={handleResetFilters}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': { color: '#660033' },
                    }}
                >
                    Сбросить
                </Button>
            </Box>

            <Accordion defaultExpanded sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Цвет</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {availableColors.map(color => (
                            <Chip
                                key={color}
                                label={color}
                                onClick={() => handleColorToggle(color)}
                                variant={localFilters.colors.includes(color) ? "filled" : "outlined"}
                                sx={{
                                    backgroundColor: localFilters.colors.includes(color) ? '#660033' : 'transparent',
                                    color: localFilters.colors.includes(color) ? 'white' : 'inherit',
                                    borderColor: '#660033',
                                    '&:hover': {
                                        backgroundColor: localFilters.colors.includes(color) ? '#550022' : 'rgba(102, 0, 51, 0.08)',
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Размер</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {availableSizes.map(size => (
                            <Chip
                                key={size}
                                label={size}
                                onClick={() => handleSizeToggle(size)}
                                variant={localFilters.sizes.includes(size) ? "filled" : "outlined"}
                                sx={{
                                    backgroundColor: localFilters.sizes.includes(size) ? '#660033' : 'transparent',
                                    color: localFilters.sizes.includes(size) ? 'white' : 'inherit',
                                    borderColor: '#660033',
                                    '&:hover': {
                                        backgroundColor: localFilters.sizes.includes(size) ? '#550022' : 'rgba(102, 0, 51, 0.08)',
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded sx={{
                boxShadow: 'none',
                border: '1px solid #e0e0e0',
                mb: 2,
                '&:before': { display: 'none' }
            }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Цена</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Slider
                        value={localFilters.priceRange}
                        onChange={handlePriceChange}
                        onChangeCommitted={handlePriceChangeCommitted}
                        valueLabelDisplay="auto"
                        min={priceRange.min}
                        max={priceRange.max}
                        sx={{
                            color: '#660033',
                            '& .MuiSlider-thumb': {
                                '&:hover, &.Mui-focusVisible': {
                                    boxShadow: '0px 0px 0px 8px rgba(102, 0, 51, 0.16)',
                                },
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {localFilters.priceRange[0]} ⃀
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {localFilters.priceRange[1]} ⃀
                        </Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded={false} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Дополнительно</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!localFilters.inStock}
                                    onChange={handleCheckboxChange('inStock')}
                                    sx={{
                                        color: '#660033',
                                        '&.Mui-checked': { color: '#660033' },
                                    }}
                                />
                            }
                            label="В наличии"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!localFilters.isNew}
                                    onChange={handleCheckboxChange('isNew')}
                                    sx={{
                                        color: '#660033',
                                        '&.Mui-checked': { color: '#660033' },
                                    }}
                                />
                            }
                            label="Новинки"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!localFilters.isPopular}
                                    onChange={handleCheckboxChange('isPopular')}
                                    sx={{
                                        color: '#660033',
                                        '&.Mui-checked': { color: '#660033' },
                                    }}
                                />
                            }
                            label="Популярные"
                        />
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </>
    );

    if (isMobile) {
        return (
            <>
                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={() => setMobileOpen(true)}
                        fullWidth
                        sx={{
                            borderColor: '#660033',
                            color: '#660033',
                            '&:hover': { borderColor: '#550022', backgroundColor: 'rgba(102, 0, 51, 0.04)' },
                        }}
                    >
                        Фильтры
                    </Button>
                </Box>

                <Drawer
                    anchor="right"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    PaperProps={{ sx: { width: { xs: '100%', sm: 350 } } }}
                >
                    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#660033' }}>
                                Фильтры
                            </Typography>
                            <IconButton onClick={() => setMobileOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                            {renderFilterContent()}
                        </Box>

                        <Box sx={{ pt: 3, borderTop: '1px solid #e0e0e0' }}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => setMobileOpen(false)}
                                sx={{
                                    backgroundColor: '#660033',
                                    '&:hover': { backgroundColor: '#550022' },
                                }}
                            >
                                Применить
                            </Button>
                        </Box>
                    </Box>
                </Drawer>
            </>
        );
    }

    return (
        <Box sx={{
            position: 'sticky',
            top: 20,
            alignSelf: 'flex-start',
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            backgroundColor: 'white',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
        }}>
            {renderFilterContent()}
        </Box>
    );
};

export default ProductFilters;