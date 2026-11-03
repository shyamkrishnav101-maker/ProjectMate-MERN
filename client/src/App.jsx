import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, ListTodo, MessageSquare, CalendarDays, Users, Headphones, Settings, Search, Bell, Plus, Grid2X2, List, Code2, Leaf, MapPin, GraduationCap, ShieldCheck, Gamepad2, Layers, Activity, LogOut, X, Sparkles, ChevronDown, Menu, UserRound, CheckCircle2 } from "lucide-react";
import { api, getToken } from "./api";

const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);
function App(){
 const [user,setUser]=useState(null),[loading,setLoading]=useState(!!getToken());
 useEffect(()=>{ if(getToken()) api("/auth/me").then(d=>setUser(d.user)).catch(()=>localStorage.removeItem("pm_token")).finally(()=>setLoading(false)); },[]);
 const auth=useMemo(()=>({user,setUser,logout:()=>{localStorage.removeItem("pm_token");setUser(null)}}),[user]);
 if(loading) return <div className="loading">Loading ProjectMate…</div>;
 return <AuthCtx.Provider value={auth}><Routes><Route path="/login" element={user?<Navigate to="/projects"/>:<AuthPage mode="login"/>}/><Route path="/register" element={user?<Navigate to="/projects"/>:<AuthPage mode="register"/>}/><Route path="/*" element={user?<Shell/>:<Navigate to="/login"/>}/></Routes></AuthCtx.Provider>;
}
function AuthPage({mode}) {
 const {setUser}=useAuth(),nav=useNavigate(),[form,setForm]=useState({name:"",email:"",password:""}),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function submit(e){e.preventDefault();setBusy(true);setError("");try{const d=await api(`/auth/${mode}`,{method:"POST",body:JSON.stringify(form)});localStorage.setItem("pm_token",d.token);setUser(d.user);nav("/projects")}catch(err){setError(err.message)}finally{setBusy(false)}}
 return <div className="auth-bg"><form className="auth-card" onSubmit={submit}><Brand/><h1>{mode==="login"?"Welcome back":"Create your account"}</h1><p>Find your people. Build something great.</p>{mode==="register"&&<input required placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>}<input required type="email" placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input required minLength="8" type="password" placeholder="Password (8+ characters)" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>{error&&<div className="error">{error}</div>}<button className="primary full" disabled={busy}>{busy?"Please wait…":mode==="login"?"Sign in":"Create account"}</button><p className="auth-switch">{mode==="login"?"New to ProjectMate?":"Already have an account?"} <a href={mode==="login"?"/register":"/login"}>{mode==="login"?"Create account":"Sign in"}</a></p></form></div>;
}
function Brand(){return <div className="brand"><span className="brand-icon"><Users size={18}/></span><b>ProjectMate</b></div>}
const navItems=[["Dashboard",LayoutDashboard,"/dashboard"],["Projects",FolderKanban,"/projects"],["My Tasks",ListTodo,"/tasks"],["Team Messages",MessageSquare,"/messages"],["Project Calendar",CalendarDays,"/calendar"],["Find Teammates",Users,"/teammates"]];
function Shell() {
  const { user, logout } = useAuth();
  const [mobile, setMobile] = useState(false);

  return (
    <div className="scene">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      <div className="app-shell">

        <aside className={`sidebar ${mobile ? "show" : ""}`}>
          <div className="side-top">
            <Brand />
            <button
              className="icon-btn mobile-close"
              onClick={() => setMobile(false)}
            >
              <X />
            </button>
          </div>

          <small className="side-label">PAGES</small>

          <nav>
            {navItems.map(([label, Icon, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                onClick={() => setMobile(false)}
              >
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="side-sep" />

          <small className="side-label">SKILL CATEGORIES</small>

          {[
            ["Web Development", Code2],
            ["AI / ML", Sparkles],
            ["Cyber Security", ShieldCheck]
          ].map(([name, Icon]) => (
            <div className="skill-row" key={name}>
              <Icon size={17} />
              <span>{name}</span>
            </div>
          ))}

          <div className="side-bottom">
            <div className="side-links">
              <a><Headphones size={17} />Support</a>
              <a><Settings size={17} />Settings</a>
            </div>

            <div className="upgrade">
              <p>
                Upgrade to Pro for advanced matching and team tools.
              </p>
              <button className="upgrade-btn">
                <Sparkles size={14} /> Upgrade Plan
              </button>
            </div>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <button
              className="icon-btn mobile-menu"
              onClick={() => setMobile(true)}
            >
              <Menu />
            </button>

            <strong>ProjectMate</strong>

            <div className="top-actions">
              <div className="global-search">
                <Search size={15} />
                <input placeholder="Search projects, skills, or people…" />
              </div>

              <button className="icon-btn notification">
                <Bell size={18} />
              </button>

              <div className="user-pill">
                <span className="avatar big">
                  {(user?.name || "S").slice(0, 1).toUpperCase()}
                </span>

                <span>{user?.name || "Student"}</span>
                <ChevronDown size={14} />

                <button
                  className="logout"
                  onClick={logout}
                  title="Sign out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route
              path="/tasks"
              element={
                <SimplePage
                  title="My Tasks"
                  desc="Keep your project work organized."
                />
              }
            />
            <Route
              path="/messages"
              element={
                <SimplePage
                  title="Team Messages"
                  desc="Team conversations will appear here when messaging is enabled for your workspace."
                />
              }
            />
            <Route
              path="/calendar"
              element={
                <SimplePage
                  title="Project Calendar"
                  desc="Keep track of project deadlines and milestones."
                />
              }
            />
            <Route path="/teammates" element={<Teammates />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
function Dashboard(){
 const [data,setData]=useState(null),[projects,setProjects]=useState([]),[error,setError]=useState("");
 useEffect(()=>{
  api("/users/dashboard").then(setData).catch(err=>console.error("Dashboard data error:",err));
  api("/projects").then(d=>setProjects(d.projects||[])).catch(err=>{console.error("Dashboard projects error:",err);setError(err.message)});
 },[]);
 return <div className="content">
  <div className="page-heading"><div><span className="eyebrow">WORKSPACE OVERVIEW</span><h1>Welcome back 👋</h1><p>Your next great collaboration starts here.</p></div></div>
  <div className="stats-grid">
   <Stat icon={FolderKanban} label="Projects available" value={data?.stats?.projects??"—"}/>
   <Stat icon={Users} label="Teams joined" value={data?.stats?.joined??"—"}/>
   <Stat icon={CheckCircle2} label="Projects created" value={data?.stats?.owned??"—"}/>
  </div>
  <div className="section-title"><div><h2>Explore opportunities</h2><p>Projects looking for curious builders.</p></div><a href="/projects">View all projects →</a></div>
  {error&&<p className="notice">Unable to load projects: {error}</p>}
  <ProjectGrid projects={projects.slice(0,3)}/>
 </div>;
}
function Stat({icon:Icon,label,value}){return <div className="stat-card"><span className="stat-icon"><Icon size={19}/></span><div><b>{value}</b><small>{label}</small></div></div>}
function Projects(){const [projects,setProjects]=useState([]),[query,setQuery]=useState(""),[category,setCategory]=useState("All"),[sort,setSort]=useState("Newest"),[modal,setModal]=useState(false),[error,setError]=useState("");async function load(){try{const d=await api(`/projects?search=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);setProjects(d.projects);setError("")}catch(e){setError(e.message);setProjects([])}}useEffect(()=>{load()},[category]);useEffect(()=>{const t=setTimeout(load,250);return()=>clearTimeout(t)},[query]);const visible=projects.slice().sort((a,b)=>sort==="Newest"?new Date(b.createdAt||0)-new Date(a.createdAt||0):a.title.localeCompare(b.title));return <div className="content"><div className="projects-head"><div><span className="eyebrow">DISCOVER & COLLABORATE</span><h1>Projects</h1><p>Find a project that matches your skills and ambition.</p></div><button className="primary" onClick={()=>setModal(true)}><Plus size={17}/> Create Project</button></div><div className="toolbar"><div className="filters"><label>Category <select value={category} onChange={e=>setCategory(e.target.value)}>{["All","FSD","AI/ML","NLP","Cybersecurity","GenAI","IoT","Web"].map(x=><option>{x}</option>)}</select></label><label>Sort by <select value={sort} onChange={e=>setSort(e.target.value)}><option>Newest</option><option>Name</option></select></label></div><div className="toolbar-right"><div className="searchbox"><Search size={15}/><input placeholder="Search projects…" value={query} onChange={e=>setQuery(e.target.value)}/></div><span className="view-toggle"><Grid2X2 size={16}/><List size={16}/></span></div></div>{error&&<p className="notice">Unable to load projects: {error}</p>}<ProjectGrid projects={visible} onEmpty={()=>{}}/><CreateModal open={modal} close={()=>setModal(false)} onCreated={load}/></div>}
function ProjectGrid({projects=[]}){
 if(!projects.length) return <div className="empty-panel"><FolderKanban size={30}/><h3>No projects available yet</h3><p>Be the first to publish a project and find teammates for your idea.</p></div>;
 return <div className="project-grid">{projects.map((p,i)=>{
  const Icon=[Code2,Leaf,MapPin,GraduationCap,ShieldCheck,Gamepad2,Leaf,Activity,Layers][i%9];
  const members=p.members||[];
  return <article className="project-card" key={p._id}>
   <div className="project-top"><span className={`project-symbol tone-${i%6}`}><Icon size={20}/></span><span className="category">{p.category||"Project"}</span></div>
   <h3>{p.title}</h3><p className="project-desc">{p.description}</p>
   <div className="project-meta">
    <div><small>Team</small><b>{members.length}/{p.teamSize||4}</b></div>
    <div><small>Members</small><b>{members.length}</b></div>
    <div><small>Deadline</small><b>{p.deadline?new Date(p.deadline).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}):"Flexible"}</b></div>
   </div>
   <div className="member-row"><div className="avatars">{members.slice(0,4).map((m,j)=><span className={`avatar av-${j}`} key={m._id||j}>{(m.name||"S").slice(0,1)}</span>)}</div>
    {members.length>4&&<span className="more">+{members.length-4}</span>}
    <span className="skill-preview">{(p.skills||[]).slice(0,2).join(" · ")}</span>
   </div>
  </article>;
 })}</div>;
}
function CreateModal({open,close,onCreated}){const [form,setForm]=useState({title:"",description:"",category:"FSD",skills:"",teamSize:4,deadline:""}),[error,setError]=useState(""),[busy,setBusy]=useState(false);if(!open)return null;async function submit(e){e.preventDefault();setBusy(true);setError("");try{await api("/projects",{method:"POST",body:JSON.stringify({...form,skills:form.skills.split(",").map(s=>s.trim()).filter(Boolean)})});close();setForm({title:"",description:"",category:"FSD",skills:"",teamSize:4,deadline:""});onCreated()}catch(e){setError(e.message)}finally{setBusy(false)}}return <div className="modal-backdrop" onClick={close}><form className="modal" onClick={e=>e.stopPropagation()} onSubmit={submit}><div className="modal-head"><div><span className="eyebrow">NEW OPPORTUNITY</span><h2>Create a project</h2></div><button type="button" className="icon-btn" onClick={close}><X/></button></div><input required maxLength="100" placeholder="Project title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><textarea required maxLength="2000" placeholder="Describe your project…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><div className="form-row"><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{["FSD","AI/ML","NLP","Cybersecurity","GenAI","IoT","Web"].map(x=><option>{x}</option>)}</select><input type="number" min="1" max="20" value={form.teamSize} onChange={e=>setForm({...form,teamSize:e.target.value})}/></div><input placeholder="Skills (comma separated)" value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})}/><label className="date-label">Deadline <input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})}/></label>{error&&<div className="error">{error}</div>}<button className="primary full" disabled={busy}>{busy?"Publishing…":"Publish project"}</button></form></div>}
function Teammates(){const [people,setPeople]=useState([]),[err,setErr]=useState("");useEffect(()=>{api("/users/discover").then(d=>setPeople(d.users)).catch(e=>setErr(e.message))},[]);return <div className="content"><div className="projects-head"><div><span className="eyebrow">BUILD YOUR CREW</span><h1>Find teammates</h1><p>Discover students with complementary skills.</p></div></div>{err&&<p className="notice">{err}</p>}<div className="people-grid">{people.map(p=><div className="person-card" key={p._id}><span className="avatar person-avatar">{p.name.slice(0,1)}</span><h3>{p.name}</h3><p>{p.branch||"Student"} · {p.college||"College"}</p><div className="match">{p.matchScore}% skill overlap</div><div className="skill-tags">{p.skills?.slice(0,5).map(s=><span>{s}</span>)}</div></div>)}</div></div>}
function Profile(){const {user,setUser}=useAuth(),[skills,setSkills]=useState((user.skills||[]).join(", ")),[msg,setMsg]=useState("");async function save(e){e.preventDefault();try{const d=await api("/users/profile",{method:"PATCH",body:JSON.stringify({skills:skills.split(",").map(s=>s.trim()).filter(Boolean)})});setUser(d.user);setMsg("Profile updated successfully")}catch(e){setMsg(e.message)}}return <div className="content narrow"><span className="eyebrow">YOUR ACCOUNT</span><h1>Profile</h1><form className="profile-form" onSubmit={save}><label>Name<input value={user.name} disabled/></label><label>Email<input value={user.email} disabled/></label><label>Skills<input value={skills} onChange={e=>setSkills(e.target.value)} placeholder="React, Python, MongoDB"/></label><button className="primary">Save skills</button>{msg&&<p className="notice">{msg}</p>}</form></div>}
function SimplePage({title,desc}){return <div className="content"><span className="eyebrow">PROJECTMATE WORKSPACE</span><h1>{title}</h1><p>{desc}</p><div className="empty-panel"><Sparkles size={28}/><h3>Coming next in your workspace</h3><p>This section has its own navigation and visual styling. Connect the related workflow as your project grows.</p></div></div>}
export default App;
