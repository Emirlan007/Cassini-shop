import { TableRow, TableCell } from "@mui/material";
import type { Product } from "../../../../types";
import { useNavigate } from "react-router-dom";

interface Props {
  product: Product;
}

const AdminProductCard = ({ product }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <TableRow
      hover
      sx={{ cursor: "pointer" }}
      onClick={handleClick}
      data-testid={`admin-product-row-${product._id}`}
    >
      <TableCell>{product._id}</TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.category?.title}</TableCell>
      <TableCell>{product.price} ₸</TableCell>
      <TableCell>
        {product.discount ? `${product.discount}%` : "-"}
      </TableCell>
    </TableRow>
  );
};

export default AdminProductCard;


