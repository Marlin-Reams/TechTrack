import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";

import { db } from "../../../firebase";
import auth from "../../../firebase/auth";

import type { PayrollProfile }
    from "../types/PayrollProfile";

const DEFAULT_PROFILE: PayrollProfile = {

    // Compensation

    flatRatePay: 38,

    weeklyGoalHours: 44,

    guaranteePercentage: 75,

    // Taxes

    federalTaxRate: 0,

    stateTaxRate: 0,

    socialSecurityRate: 0,

    medicareRate: 0,

    // Deductions

    insurancePerWeek: 0,

    retirementPerWeek: 0,

};

class PayrollProfileRepository {

    private getDocumentReference() {

        const user = auth.currentUser;

        if (!user) {

            throw new Error(
                "User is not authenticated.",
            );

        }

        return doc(
            db,
            "users",
            user.uid,
            "profile",
            "payroll",
        );

    }

    async getProfile(): Promise<PayrollProfile> {

        const document =
            await getDoc(
                this.getDocumentReference(),
            );

        if (!document.exists()) {

            return DEFAULT_PROFILE;

        }

        return {

            ...DEFAULT_PROFILE,
            ...(document.data() as Partial<PayrollProfile>),

        };

    }

    async saveProfile(
        profile: PayrollProfile,
    ): Promise<void> {

        await setDoc(
            this.getDocumentReference(),
            profile,
        );

    }

}

export default new PayrollProfileRepository();