import { useEffect,useMemo,useState } from "react";
import { subscribeToReminders } from "../repository/reminderRepository";
import type { Reminder } from "../types/Reminder";
export function useReminders(){const[reminders,setReminders]=useState<Reminder[]>([]);const[loading,setLoading]=useState(true);const[error,setError]=useState("");useEffect(()=>subscribeToReminders(items=>{setReminders(items);setLoading(false)},caught=>{setError(caught.message||"Could not load reminders.");setLoading(false)}),[]);const due=useMemo(()=>reminders.filter(item=>!item.completed&&item.dueAt&&new Date(item.dueAt).getTime()<=Date.now()),[reminders]);return{reminders,due,loading,error}}
