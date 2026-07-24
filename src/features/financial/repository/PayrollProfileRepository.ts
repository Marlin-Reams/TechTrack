import { getUserSettings } from "../../settings/services/settingsService";

export interface PayrollProfileData {

    flatRatePay: number;

    weeklyGoalHours: number;
}

export async function getPayrollProfileData(): Promise<PayrollProfileData> {

    const settings = await getUserSettings();

    return {

        flatRatePay: settings.flatRatePay,

        weeklyGoalHours: settings.weeklyFlagHourGoal,
    };
}