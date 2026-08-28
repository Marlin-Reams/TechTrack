import { useState } from "react";

import PaystubList from "../components/PaystubList";
import PaystubUploader from "../components/PaystubUploader";

import "./PaystubPage.css";

export default function PaystubPage() {

    const [refreshKey, setRefreshKey] =
        useState(0);

    function handleUploadComplete() {

        setRefreshKey(previous => previous + 1);

    }

    return (

        <main className="paystub-page">

            <header className="paystub-page-header">
                <div>
                    <span>PAYROLL RECORDS</span>
                    <h1>Paystubs</h1>
                </div>
                <p className="paystub-page-intro">
                    Import weekly statements and watch your earnings estimate improve over time.
                </p>
            </header>

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
