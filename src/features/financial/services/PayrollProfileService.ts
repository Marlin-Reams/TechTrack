import PayrollProfileRepository
    from "../repository/PayrollProfileRepository";

import type { PayrollProfile }
    from "../types/PayrollProfile";

class PayrollProfileService {

    async getPayrollProfile(): Promise<PayrollProfile> {

        return PayrollProfileRepository.getProfile();

    }

    async savePayrollProfile(
        profile: PayrollProfile,
    ): Promise<void> {

        await PayrollProfileRepository.saveProfile(
            profile,
        );

    }

}

export default new PayrollProfileService();