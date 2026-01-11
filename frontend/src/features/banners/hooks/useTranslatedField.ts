import { useTranslation } from "react-i18next";
import type { TranslatedField } from "../../../types";

export const useTranslatedField = () => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language.slice(0, 2) as "ru" | "en" | "kg";

    const getTranslation = (
        field: TranslatedField | string | undefined
    ): string => {
        if (!field) return "";

        if (typeof field === "string") {
            return field;
        }

        return field[currentLang] || field.ru || "";
    };

    return { getTranslation, currentLang };
};