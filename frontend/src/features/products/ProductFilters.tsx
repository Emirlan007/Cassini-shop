import React, {useState, useEffect} from 'react';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import type {FilterState} from "../../types";
import ColorFilter from "./ColorFilter.tsx";
import SizeFilter from "./SizeFilter.tsx";
import MaterialFilter from "./MaterialFilter.tsx";
import PriceFilter from "./PriceFilter.tsx";
import AdditionalFilters from "./AdditionalFilters.tsx";
import MobileFiltersDrawer from "./MobileFiltersDrawer.tsx";

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
                                                         availableMaterials,
                                                         priceRange,
                                                         onFilterChange,
                                                         currentFilters,
                                                       }) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [localFilters, setLocalFilters] = useState<FilterState>({
    ...currentFilters,
    material: currentFilters.material || undefined
  });
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

  const handleMaterialToggle = (material: string) => {
    const newMaterial = localFilters.material === material ? undefined : material;

    const newFilters: FilterState = {
      ...localFilters,
      material: newMaterial
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAdditionalToggle = (
      key: "inStock" | "isNew" | "isPopular",
      checked: boolean
  ) => {
    const newFilters: FilterState = {
      ...localFilters,
      [key]: checked,
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
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Typography variant="h6" sx={{fontWeight: 600, color: '#660033'}}>
            Фильтры
          </Typography>
          <Button
              variant="text"
              onClick={handleResetFilters}
              sx={{
                color: 'text.secondary',
                '&:hover': {color: '#660033'},
              }}
          >
            Сбросить
          </Button>
        </Box>

        <ColorFilter colors={availableColors} value={localFilters.colors} onToggle={handleColorToggle}/>

        <SizeFilter sizes={availableSizes} value={localFilters.sizes} onToggle={handleSizeToggle}/>

        <MaterialFilter materials={availableMaterials} value={localFilters.material} onToggle={handleMaterialToggle}/>

        <PriceFilter
            value={localFilters.priceRange}
            min={priceRange.min}
            max={priceRange.max}
            onChange={(range) =>
                setLocalFilters(prev => ({
                  ...prev,
                  priceRange: range
                }))
            }
            onCommit={(range) =>
                onFilterChange({
                  ...localFilters,
                  priceRange: range
                })
            }
        />


        <AdditionalFilters
            value={{
              inStock: localFilters.inStock,
              isNew: localFilters.isNew,
              isPopular: localFilters.isPopular,
            }}
            onToggle={handleAdditionalToggle}
        />
      </>
  );

  if (isMobile) {
    return (
        <>
          <Box sx={{mb: 3}}>
            <Button
                variant="outlined"
                startIcon={<FilterListIcon/>}
                onClick={() => setMobileOpen(true)}
                fullWidth
                sx={{
                  borderColor: "#660033",
                  color: "#660033",
                  "&:hover": {
                    borderColor: "#550022",
                    backgroundColor: "rgba(102, 0, 51, 0.04)",
                  },
                }}
            >
              Фильтры
            </Button>
          </Box>

          <MobileFiltersDrawer
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
          >
            {renderFilterContent()}
          </MobileFiltersDrawer>
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