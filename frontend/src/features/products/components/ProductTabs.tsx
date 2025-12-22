import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import theme from "../../../theme";
import a11yProps from "../../../components/UI/Tabs/AllyProps";
import { useTranslation } from "react-i18next";
import CustomTabPanel from "../../../components/UI/Tabs/CustomTabPanel";

interface Props {
  description?: string;
  sizeGuide?: string;
}

const ProductTabs: React.FC<Props> = ({ description, sizeGuide }) => {
  const [tabValue, setTabValue] = useState(0);

  const { t } = useTranslation();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          aria-label="basic tabs example"
          onChange={handleTabChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.secondary.main,
            },
            "& .Mui-selected": {
              color: `${theme.palette.secondary.main} !important`,
            },
          }}
        >
          <Tab label={t("productDetail")} {...a11yProps(0)} />
          <Tab label={t("sizingGuide")} {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        <Box>
          <Typography
            variant="body1"
            sx={{ color: "#525252", fontSize: "14px" }}
          >
            {description}
          </Typography>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        Information about sizing and fit guide has not been added yet
      </CustomTabPanel>
    </Box>
  );
};

export default ProductTabs;
