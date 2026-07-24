import {
    getPayrollProfileData,
} from "../repository/PayrollProfileRepository";

import type { PayrollProfile } from "../types/PayrollProfile";

class PayrollProfileService {

    async getPayrollProfile(): Promise<PayrollProfile> {

        const data =
            await getPayrollProfileData();

        return {

            flatRatePay: data.flatRatePay,

            weeklyGoalHours: data.weeklyGoalHours,

            medicalDeduction: 0,

            dentalDeduction: 0,

            visionDeduction: 0,

            retirementDeduction: 0,

            loanRepayment: 0,

            federalWithholdingPercent: 0,

            stateWithholdingPercent: 0,

            socialSecurityPercent: 0,

            medicarePercent: 0,

            lastVerified: "",
        };
    }
}

export default new PayrollProfileService();