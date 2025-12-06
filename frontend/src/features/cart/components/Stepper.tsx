import {Box, Stack, Typography} from "@mui/material";

interface StepperProps {
    step: 1 | 2 | 3;
}

const Stepper = ({ step }: StepperProps) => {
    const steps = [
        { id: 1, label: "Details" },
        { id: 2, label: "Personal Info" },
        { id: 3, label: "Payment" },
    ];

    return (
        <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            mb={3}
        >
            {steps.map((s, idx) => (
                <Box
                    key={s.id}
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                    style={{margin: '0px 20px'}}
                    sx={{ mx: 1 }}
                >
                    <Box
                        sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            border: s.id <= step ? "none" : "2px solid #E0E0E0",
                            bgcolor: s.id <= step ? "#660033" : "#FFF",
                            color: s.id <= step ? "#fff" : "#808080",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "bold",
                            mb: 1,
                        }}
                    >
                        {s.id}
                    </Box>
                    {idx < steps.length - 1 && (
                        <Box
                            sx={{
                                width: 50,
                                height: 3,
                                bgcolor: "#E0E0E0",
                                position: 'relative',
                                bottom: '22px',
                                left: '50px'
                            }}
                        />
                    )}
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: "12px",
                            fontWeight: '500',
                            lineHeight: '16px',
                            textAlign: "center",
                            color: s.id <= step ? "#660033" : "#808080",
                    }}
                    >
                        {s.label}
                    </Typography>
                </Box>
            ))}
        </Stack>
    );
};

export default Stepper;
