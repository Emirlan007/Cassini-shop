import { type ChangeEvent, type FC, useRef, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';

interface Props {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    name: string;
    label: string;
}

const FilesInput: FC<Props> = ({ onChange, name, label }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [fileNames, setFileNames] = useState<string[]>([]);

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            const namesArray = Array.from(files).map((file) => file.name);
            setFileNames(namesArray);
        } else {
            setFileNames([]);
        }

        onChange(e);
    };

    const activateInput = () => {
        inputRef.current?.click();
    };

    return (
        <>
            <input
                type="file"
                multiple
                style={{ display: 'none' }}
                name={name}
                ref={inputRef}
                id={name}
                onChange={onFileChange}
            />

            <Stack direction="row" spacing={2} alignItems={'center'}>
                <TextField
                    required
                    slotProps={{ input: { readOnly: true } }}
                    label={label}
                    // file names cherez comma
                    value={fileNames.join(', ')}
                    onClick={activateInput}
                />

                <Button color="success" variant="contained" onClick={activateInput}>
                    Browse
                </Button>
            </Stack>
        </>
    );
};

export default FilesInput;
