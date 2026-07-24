import { useState } from "react";

import PaystubList from "../components/PaystubList";
import PaystubUploader from "../components/PaystubUploader";

export default function PaystubPage() {

    const [refreshKey, setRefreshKey] =
        useState(0);

    function handleUploadComplete() {

        setRefreshKey(previous => previous + 1);

    }

    return (

        <main className="paystub-page">

            <h1>Paystubs</h1>

            <PaystubUploader
                onUploadComplete={handleUploadComplete}
            />

            <hr />

            <PaystubList
                refreshKey={refreshKey}
            />

        </main>

    );
}