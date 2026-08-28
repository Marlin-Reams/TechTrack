import { useMemo,useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle,Bell,Check,Clock3,Pencil,Plus,StickyNote,Trash2 } from "lucide-react";
import { addReminder,deleteReminder,setReminderCompleted,updateReminder } from "../repository/reminderRepository";
import { useReminders } from "../hooks/useReminders";
import type { Reminder,ReminderDraft,ReminderPriority } from "../types/Reminder";
import "./RemindersPage.css";

const emptyDraft:ReminderDraft={title:"",details:"",dueAt:null,priority:"normal"};
const formatDue=(value:string)=>new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(value));

export default function RemindersPage(){
 const{reminders,due,loading,error}=useReminders();const[draft,setDraft]=useState<ReminderDraft>(emptyDraft);const[editingId,setEditingId]=useState<string>();const[showCompleted,setShowCompleted]=useState(false);const[saving,setSaving]=useState(false);
 const visible=useMemo(()=>reminders.filter(item=>showCompleted||!item.completed).sort((a,b)=>{if(a.completed!==b.completed)return a.completed?1:-1;if(a.priority!==b.priority)return a.priority==="important"?-1:1;if(a.dueAt&&b.dueAt)return new Date(a.dueAt).getTime()-new Date(b.dueAt).getTime();return a.dueAt?-1:b.dueAt?1:0}),[reminders,showCompleted]);
 const submit=async(event:FormEvent)=>{event.preventDefault();if(!draft.title.trim())return;setSaving(true);try{const clean={...draft,title:draft.title.trim(),details:draft.details.trim(),dueAt:draft.dueAt||null};if(editingId)await updateReminder(editingId,clean);else await addReminder(clean);setDraft(emptyDraft);setEditingId(undefined)}finally{setSaving(false)}};
 const edit=(item:Reminder)=>{setEditingId(item.id);setDraft({title:item.title,details:item.details,dueAt:item.dueAt,priority:item.priority});window.scrollTo({top:0,behavior:"smooth"})};
 return <section className="reminders-page">
  <header className="reminders-heading"><div><span className="eyebrow">PERSONAL WORKSPACE</span><h1>Notes & Reminders</h1><p>Keep track of follow-ups, tools you need, and people you need to contact.</p></div><div className="reminder-stats"><span><Bell size={18}/><b>{due.length}</b> due</span><span><StickyNote size={18}/><b>{reminders.filter(item=>!item.completed).length}</b> open</span></div></header>
  {due.length>0&&<div className="due-alert"><AlertCircle size={21}/><div><b>{due.length} reminder{due.length===1?" is":"s are"} due</b><span>Review the highlighted items below.</span></div></div>}
  <form className="reminder-composer" onSubmit={submit}><div className="composer-title"><Plus size={20}/><b>{editingId?"Edit item":"Add a note or reminder"}</b></div><div className="composer-grid">
   <label>Title<input value={draft.title} onChange={event=>setDraft({...draft,title:event.target.value})} placeholder="Example: Ask Jonathan about alignment machine" required/></label>
   <label>Remind me<input type="datetime-local" value={draft.dueAt?.slice(0,16)||""} onChange={event=>setDraft({...draft,dueAt:event.target.value?new Date(event.target.value).toISOString():null})}/></label>
   <label className="composer-details">Notes<textarea value={draft.details} onChange={event=>setDraft({...draft,details:event.target.value})} placeholder="Add details, a shopping list, phone number, or anything else..."/></label>
   <label>Priority<select value={draft.priority} onChange={event=>setDraft({...draft,priority:event.target.value as ReminderPriority})}><option value="normal">Normal</option><option value="important">Important</option></select></label>
  </div><div className="composer-actions">{editingId&&<button type="button" className="secondary" onClick={()=>{setEditingId(undefined);setDraft(emptyDraft)}}>Cancel</button>}<button disabled={saving}>{saving?"Saving...":editingId?"Save changes":"Add item"}</button></div></form>
  <div className="reminder-list-heading"><h2>My list</h2><label><input type="checkbox" checked={showCompleted} onChange={event=>setShowCompleted(event.target.checked)}/> Show completed</label></div>
  {error&&<p className="reminder-error">{error}</p>}{loading?<p>Loading your notes...</p>:visible.length===0?<div className="reminder-empty"><StickyNote size={32}/><b>No notes yet</b><span>Add your first note or reminder above.</span></div>:<div className="reminder-list">{visible.map(item=>{const isDue=!item.completed&&Boolean(item.dueAt)&&new Date(item.dueAt!).getTime()<=Date.now();return <article key={item.id} className={`reminder-card${item.completed?" completed":""}${isDue?" overdue":""}${item.priority==="important"?" important":""}`}><button className="complete-button" onClick={()=>setReminderCompleted(item.id,!item.completed)} aria-label={item.completed?"Mark incomplete":"Mark complete"}>{item.completed&&<Check size={18}/>}</button><div className="reminder-content"><div className="reminder-title-line"><h3>{item.title}</h3>{item.priority==="important"&&<span className="priority-pill">Important</span>}</div>{item.details&&<p>{item.details}</p>}{item.dueAt&&<span className={`due-date${isDue?" overdue":""}`}><Clock3 size={15}/>{isDue?"Due ":"Remind me "}{formatDue(item.dueAt)}</span>}</div><div className="reminder-actions"><button onClick={()=>edit(item)} aria-label="Edit"><Pencil size={17}/></button><button onClick={()=>deleteReminder(item.id)} aria-label="Delete"><Trash2 size={17}/></button></div></article>})}</div>}
 </section>
}
