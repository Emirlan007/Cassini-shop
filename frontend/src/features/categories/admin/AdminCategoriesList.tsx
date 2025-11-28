import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCategories } from "../categorySlice";
import { fetchCategories } from "../categoryThunk";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminCategoriesList = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  console.log(categories);
  const fetchCategoriesCallBack = useCallback(() => {
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    void fetchCategoriesCallBack();
  }, []);
  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Nested List Items
        </ListSubheader>
      }
    >
      {categories.map((category) => (
        <ListItemButton key={category._id}>
          <ListItemIcon>
            <CheckroomIcon />
          </ListItemIcon>
          <ListItemText primary={category.title} />
          <ListItemIcon>
            <EditDocumentIcon />
          </ListItemIcon>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
        </ListItemButton>
      ))}

      {/*Here We can make Nested list*/}
      {/* <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItemButton>
        </List>
      </Collapse> */}
    </List>
  );
};

export default AdminCategoriesList;
