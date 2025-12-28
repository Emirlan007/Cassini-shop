import {Box, Collapse, IconButton, TextField} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {useEffect, useRef, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import {useNavigate} from "react-router-dom";

const SearchInput = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [searchProduct, setSearchProduct] = useState("");
    const navigate = useNavigate();

    const openSearchInput = () => {
        setIsSearchOpen(true);
    };

    const closeSearchInput = () => {
        setIsSearchOpen(false);
        setSearchProduct("");
    };

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchProduct(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsSearchOpen(false);
            }
        };

        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearchOpen]);

    const debouncedSearch = useDebouncedCallback((value: string) => {
        if (value.length >= 2 || value.length === 0) {
            navigate(`/search?q=${encodeURIComponent(value)}`);
        }
    }, 500);

    return (
        <Box
            ref={searchRef}
            sx={{ display: "flex", alignItems: "center", width: "100%" }}
        >
            {isSearchOpen ? (
                <IconButton onClick={closeSearchInput}>
                    <CloseIcon sx={{ color: "#808080" }} />
                </IconButton>
            ) : (
                <IconButton onClick={openSearchInput}>
                    <SearchIcon sx={{ color: "#808080" }} />
                </IconButton>
            )}

            <Collapse
                orientation="horizontal"
                in={isSearchOpen}
                sx={{
                    overflow: "hidden",
                    display: "flex",
                    transition: "width 300ms ease, opacity 200ms ease",
                    width: isSearchOpen ? { xs: "100%", sm: "200px" } : "0px",
                    opacity: isSearchOpen ? 1 : 0,
                    ml: 1,
                }}
            >
                <TextField
                    autoFocus={isSearchOpen}
                    placeholder="Поиск товаров..."
                    size="small"
                    fullWidth
                    onChange={handleSearchInput}
                    value={searchProduct}
                    sx={{
                        "& fieldset": { border: "none" },
                        backgroundColor: "white",
                        borderRadius: "6px",
                        width: "180px",
                    }}
                />
            </Collapse>
        </Box>
    );
};

export default SearchInput;