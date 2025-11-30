import {Box, Stack} from "@mui/material";

interface StepperProps {
    step: 1 | 2 | 3;
}

const Stepper = ({ step }: StepperProps) => {
    const steps = [1, 2, 3];
    return (
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mb={3}>
            {steps.map((s, idx) => (
                <Box key={s} display="flex" alignItems="center" style={{marginLeft: '0px'}}>
                    <Box
                        sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            bgcolor: s <= step ? "#660033" : "#F0544F",
                            color: "#fff",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "bold",
                        }}
                    >
                        {s}
                    </Box>
                    {idx < steps.length - 1 && (
                        <Box
                            sx={{
                                width: 50,
                                height: 4,
                                bgcolor: "#660033",
                            }}
                        />
                    )}
                </Box>
            ))}
        </Stack>
    );
};

export default Stepper;