export type ReminderPriority = "normal" | "important";
export interface Reminder { id:string; title:string; details:string; dueAt:string|null; priority:ReminderPriority; completed:boolean; createdAt:string; completedAt:string|null }
export type ReminderDraft = Pick<Reminder,"title"|"details"|"dueAt"|"priority">;
