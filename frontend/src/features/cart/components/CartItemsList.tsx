import { Button, Stack, Typography } from "@mui/material";
import CartItem from "./CartItem.tsx";
import type { CartItem as CartItemType } from "../../../types";

interface Props {
    items: CartItemType[];
    onUpdateQuantity: (item: CartItemType, newQuantity: number) => void;
    onRemove: (item: CartItemType) => void;
    onNext: () => void;
}

const CartItemsList = ({ items, onUpdateQuantity, onRemove, onNext }: Props) => {
    return (
        <Stack spacing={2}>
            <Typography
                sx={{
                    fontWeight: "700",
                    fontSize: "28px",
                    marginBottom: "20px",
                    color: "#660033",
                }}
            >
                Детали заказа
            </Typography>

            {items.map((item) => (
                <CartItem
                    key={`${item.product}-${item.selectedColor}-${item.selectedSize}`}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemove}
                />
            ))}

            <Button
                variant="contained"
                sx={{
                    borderRadius: "14px",
                    fontSize: "16px",
                    fontWeight: "700",
                    padding: "10px 0",
                }}
                disabled={items.length === 0}
                onClick={onNext}
            >
                Далее
            </Button>
        </Stack>
    );
};

export default CartItemsList;