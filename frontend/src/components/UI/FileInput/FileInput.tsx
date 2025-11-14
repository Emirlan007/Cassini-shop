import { type ChangeEvent, type FC, useRef, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';

interface Props {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    name: string;
    label: string;
}

const FileInput: FC<Props> = ({ onChange, name, label }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState('');

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName('');
        }

        onChange(e);
    };

    const activateInput = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <>
            <input type="file" style={{ display: 'none' }} name={name} ref={inputRef} onChange={onFileChange} />
            <Stack direction="row" spacing={2} alignItems={'center'}>
                <TextField
                    sx={{width: '100%', mr: 2}}
                    slotProps={{
                        input: { readOnly: true },
                    }}
                    label={label}
                    value={fileName}
                    onClick={activateInput}
                />
                <Button variant="contained" onClick={activateInput}>
                    Browse
                </Button>
            </Stack>
        </>
    );
};

export default FileInput;
