import { useState } from "react";

export default function useOperationForm() {
    const [articleNumber, setArticleNumber] = useState("");
    const [description, setDescription] = useState("");
    const [workPerformed, setWorkPerformed] = useState("");
    const [laborType, setLaborType] = useState<"fixed" | "variable">("fixed");
    const [hours, setHours] = useState(0);

    function resetForm() {
        setArticleNumber("");
        setDescription("");
        setWorkPerformed("");
        setLaborType("fixed");
        setHours(0);
    }

    return {
        articleNumber,
        description,
        workPerformed,
        laborType,
        hours,

        setArticleNumber,
        setDescription,
        setWorkPerformed,
        setLaborType,
        setHours,

        resetForm,
    };
}