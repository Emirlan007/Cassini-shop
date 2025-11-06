import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
} from "@mui/material";
import type { Product } from "../../types";

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    return (
        <Card
            sx={{
                width: 300,
                borderRadius: "16px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#FFFFFF",
                color: "#660033",
                transition: "transform 0.2s ease",
                "&:hover": {
                    transform: "scale(1.02)",
                },
                "@media (max-width: 400px)": {
                    width: "100%",
                },
            }}
        >
            {product.images && product.images.length > 0 ? (
                <CardMedia
                    component="img"
                    height="200"
                    image={product.images[0]}
                    alt={product.name}
                    sx={{ objectFit: "cover" }}
                />
            ) : (
                <Box
                    sx={{
                        height: 200,
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                    }}
                >
                    Нет изображения
                </Box>
            )}

            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {product.name}
                </Typography>

                {product.description && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        {product.description.length > 60
                            ? product.description.slice(0, 60) + "..."
                            : product.description}
                    </Typography>
                )}

                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
                    {product.price} ₸
                </Typography>

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#F0544F",
                        "&:hover": { backgroundColor: "#d9443f" },
                        textTransform: "none",
                        borderRadius: "8px",
                    }}
                >
                    Подробнее
                </Button>
            </CardContent>
        </Card>
    );
};

export default ProductCard;