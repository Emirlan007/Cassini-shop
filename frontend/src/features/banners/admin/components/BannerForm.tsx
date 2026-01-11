import {
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    useState,
    type ChangeEvent,
    type FormEvent,
    useEffect,
    useCallback,
} from "react";
import type { Banner, BannerInput } from "../../../../types";
import FileInput from "../../../../components/UI/FileInput/FileInput.tsx";
import { API_URL } from "../../../../constants.ts";

interface Props {
    onSubmit: (data: BannerInput) => void;
    loading: boolean;
    existingBanner?: Banner | null;
    isEdit?: boolean;
}

interface TranslateFieldProps {
    field: "title" | "description";
    lang: "ru" | "en" | "kg";
    label: string;
    multiline?: boolean;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onTranslate?: () => void;
    translating?: boolean;
    hasRussianText?: boolean;
}

const TranslateField = ({
                            field,
                            lang,
                            label,
                            multiline = false,
                            value,
                            onChange,
                            onTranslate,
                            translating = false,
                            hasRussianText = false,
                        }: TranslateFieldProps) => {
    const isEnglish = lang === "en";

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <TextField
                fullWidth={!isEnglish}
                label={label}
                value={value}
                onChange={onChange}
                required={field === "title" && lang === "ru"}
                multiline={multiline}
                minRows={multiline ? 3 : undefined}
                sx={{ flexGrow: isEnglish ? 1 : undefined }}
            />
            {isEnglish && onTranslate && (
                <Button
                    variant="contained"
                    onClick={onTranslate}
                    disabled={!hasRussianText || translating}
                    sx={{ minWidth: 48, height: multiline ? 56 : 56 }}
                >
                    {translating ? <CircularProgress size={20} /> : "Перевести"}
                </Button>
            )}
        </Stack>
    );
};

const BannerForm = ({
                        onSubmit,
                        loading,
                        existingBanner,
                        isEdit = false,
                    }: Props) => {
    const [state, setState] = useState<BannerInput>({
        title: { ru: "", en: "", kg: "" },
        description: { ru: "", en: "", kg: "" },
        link: "",
        image: null,
    });

    const [translating, setTranslating] = useState(false);

    useEffect(() => {
        if (existingBanner) {
            setState({
                title: existingBanner.title || { ru: "", en: "", kg: "" },
                description: existingBanner.description || { ru: "", en: "", kg: "" },
                link: existingBanner.link || "",
                image: null,
            });
        }
    }, [existingBanner]);

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const translatedChangeHandler = useCallback(
        (field: "title" | "description", lang: "ru" | "en" | "kg") =>
            (e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setState((prev) => ({
                    ...prev,
                    [field]: {
                        ...prev[field],
                        [lang]: value,
                    },
                }));
            },
        []
    );

    const imageHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setState((prev) => ({ ...prev, image: file }));
    };

    const translateFieldToEn = async (field: "title" | "description") => {
        const text = state[field].ru.trim();
        if (!text) return;

        try {
            setTranslating(true);

            const res = await fetch(`${API_URL}translation/translate/en`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!res.ok) {
                throw new Error("Translate EN failed");
            }

            const data: { translation: string } = await res.json();

            setState((prev) => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    en: data.translation,
                },
            }));
        } finally {
            setTranslating(false);
        }
    };

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(state);
    };

    return (
        <Stack
            spacing={2}
            component="form"
            onSubmit={submitHandler}
            sx={{ maxWidth: 650, mx: "auto", mt: 4 }}
        >
            <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
                {isEdit ? "Редактировать баннер" : "Создать баннер"}
            </Typography>

            <Typography fontWeight={600}>Название</Typography>
            <TranslateField
                field="title"
                lang="ru"
                label="Название (RU)"
                value={state.title.ru}
                onChange={translatedChangeHandler("title", "ru")}
            />
            <TranslateField
                field="title"
                lang="en"
                label="Название (EN)"
                value={state.title.en}
                onChange={translatedChangeHandler("title", "en")}
                onTranslate={() => translateFieldToEn("title")}
                translating={translating}
                hasRussianText={!!state.title.ru}
            />
            <TranslateField
                field="title"
                lang="kg"
                label="Название (KG)"
                value={state.title.kg}
                onChange={translatedChangeHandler("title", "kg")}
            />

            <Typography fontWeight={600}>Описание</Typography>
            <TranslateField
                field="description"
                lang="ru"
                label="Описание (RU)"
                multiline
                value={state.description.ru}
                onChange={translatedChangeHandler("description", "ru")}
            />
            <TranslateField
                field="description"
                lang="en"
                label="Описание (EN)"
                multiline
                value={state.description.en}
                onChange={translatedChangeHandler("description", "en")}
                onTranslate={() => translateFieldToEn("description")}
                translating={translating}
                hasRussianText={!!state.description.ru}
            />
            <TranslateField
                field="description"
                lang="kg"
                label="Описание (KG)"
                multiline
                value={state.description.kg}
                onChange={translatedChangeHandler("description", "kg")}
            />

            <TextField
                name="link"
                label="Ссылка"
                value={state.link}
                onChange={changeHandler}
            />

            <Box>
                <FileInput
                    label="Изображение"
                    name="image"
                    onChange={imageHandler}
                />
                {state.image && (
                    <Typography sx={{ fontSize: 13, mt: 1 }}>
                        {state.image.name}
                    </Typography>
                )}
                {isEdit && existingBanner?.image && !state.image && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Текущее изображение:
                        </Typography>
                        <img
                            src={`${API_URL}${existingBanner.image.replace(
                                "public/",
                                ""
                            )}`}
                            alt="Current banner"
                            style={{ maxWidth: "100%", maxHeight: "200px" }}
                        />
                    </Box>
                )}
            </Box>

            <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ bgcolor: "#660033" }}
            >
                {loading
                    ? isEdit
                        ? "Обновление..."
                        : "Создание..."
                    : isEdit
                        ? "Обновить"
                        : "Создать"}
            </Button>
        </Stack>
    );
};

export default BannerForm;