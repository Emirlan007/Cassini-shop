import {Box, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

interface StepperProps {
    step: 1 | 2 | 3;
}

const Stepper = ({ step }: StepperProps) => {
  const { t } = useTranslation();

  const steps = [
        { id: 1, label: "checkoutSteps.details"},
        { id: 2, label: "checkoutSteps.personalInfo" },
        { id: 3, label: "checkoutSteps.payment" },
    ];

    return (
        <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="flex-start"
            mb={3}
            sx={{ position: "relative" }}
        >
            {steps.map((s, idx) => (
              <Box
                key={s.id}
                sx={{
                  width: { xs: 90, sm: 120 },
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    height: 40,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      bgcolor: s.id <= step ? "#660033" : "#FFF",
                      border: s.id <= step ? "none" : "2px solid #E0E0E0",
                      color: s.id <= step ? "#fff" : "#808080",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      zIndex: 2,
                    }}
                  >
                    {s.id}
                  </Box>

                  {idx < steps.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "100%",
                        height: 3,
                        bgcolor: s.id < step ? "#660033" : "#E0E0E0",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                      }}
                    />
                  )}
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    lineHeight: 1.1,
                    color: s.id <= step ? "#660033" : "#808080",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    px: 0.5,
                  }}
                >
                  {t(s.label)}
                </Typography>
              </Box>
            ))}
        </Stack>
    );
};

export default Stepper;
