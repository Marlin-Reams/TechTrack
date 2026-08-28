import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db, getCurrentUserId } from "../../../firebase/repositoryHelpers";
import type { Reminder, ReminderDraft } from "../types/Reminder";
const reminderCollection=()=>collection(db,"users",getCurrentUserId(),"reminders");
const reminderDocument=(id:string)=>doc(db,"users",getCurrentUserId(),"reminders",id);
export function subscribeToReminders(onChange:(items:Reminder[])=>void,onError?:(error:Error)=>void){return onSnapshot(query(reminderCollection(),orderBy("createdAt","desc")),snapshot=>onChange(snapshot.docs.map(item=>({id:item.id,...item.data() as Omit<Reminder,"id">}))),error=>onError?.(error))}
export async function addReminder(draft:ReminderDraft){await addDoc(reminderCollection(),{...draft,completed:false,createdAt:new Date().toISOString(),completedAt:null})}
export async function updateReminder(id:string,changes:Partial<ReminderDraft>){await updateDoc(reminderDocument(id),changes)}
export async function setReminderCompleted(id:string,completed:boolean){await updateDoc(reminderDocument(id),{completed,completedAt:completed?new Date().toISOString():null})}
export async function deleteReminder(id:string){await deleteDoc(reminderDocument(id))}
