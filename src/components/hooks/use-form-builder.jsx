import { useState } from "react";
import { v4 as uuidv4 } from "uuid";



export const useFormBuilder = () => {
    const [fields, setFields] = useState([]);

    const addField = (type) => {
        const newField = {
            id: uuidv4(),
            type,
            label: "New " + type,
            key: type + "_" + fields.length,
            ...(type === "select" || type === "radio" || type === "checkbox"
                ? { options: [] }
                : {}),
        };
        setFields((prev) => [...prev, newField]);
    };

    const updateField = (id, updatedField) => {
        setFields((prev) =>
            prev.map((field) => (field.id === id ? updatedField : field))
        );
    };

    const removeField = (id) => {
        setFields((prev) => prev.filter((field) => field.id !== id));
    };

    const reorderFields = (newFields) => {
        setFields([...newFields]);
    };

    return { fields, addField, updateField, removeField, reorderFields };
};
