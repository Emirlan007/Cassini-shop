import {TableRow, TableCell, Button} from "@mui/material";
import type { Product } from "../../../../types";
import { useNavigate } from "react-router-dom";

interface Props {
  product: Product;
  removeProduct: (id: string) => void;
}

const AdminProductCard = ({ product , removeProduct}: Props) => {
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
      <Button
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/products/${product._id}/update`);
          }}
          color='secondary'
          variant='contained'
          sx={{
            mr: 2,
            backgroundColor: "#660033",
            "&:hover": { backgroundColor: "#F0544F" },
          }}
      >
        edit
      </Button>
      <Button
          onClick={(event) => {
            event.stopPropagation();
            removeProduct(product._id)
          }}
          color='secondary'
          variant='contained'
          sx={{
            backgroundColor: "#660033",
            "&:hover": { backgroundColor: "#F0544F" },
          }}
      >
        delete
      </Button>
    </TableRow>
  );
};

export default AdminProductCard;


