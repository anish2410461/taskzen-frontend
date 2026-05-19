import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";
import { AnimatePresence, motion } from "framer-motion";
import { ListTodo, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import StatsCard from "../components/StatsCard";
import ProductivityChart from "../components/ProductivityChart";
import TaskCard from "../components/TaskCard";
import type { Todo } from "../types/Todo";
import type { DashboardStats } from "../types/DashboardStats";
import { getTodos, getStats, toggleTodo, deleteTodo, addTodo } from "../services/api";

const TaskSkeleton = () => (
  <div className="bg-card border border-border shadow-card rounded-2xl p-4 flex items-center justify-between animate-pulse">
    <div className="flex items-center gap-4 w-full">
      <div className="w-5 h-5 rounded bg-muted/20 shrink-0"></div>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        <div className="h-4 bg-muted/20 rounded w-full"></div>
        <div className="h-3 bg-muted/20 rounded w-1/2"></div>
      </div>
    </div>
    <div className="hidden md:flex items-center gap-3">
      <div className="h-6 w-16 bg-muted/20 rounded-md"></div>
      <div className="h-6 w-16 bg-muted/20 rounded-md"></div>
      <div className="w-8 h-8 rounded-lg bg-muted/20"></div>
    </div>
  </div>
);

const EmptyState = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-card border border-border shadow-card rounded-3xl p-16 flex flex-col items-center justify-center text-center"
  >
    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
      <ListTodo size={40} />
    </div>
    <h2 className="text-xl font-bold text-text mb-2">No tasks found</h2>
    <p className="text-muted mb-0 max-w-sm">You're all caught up! Add a new task to keep track of what you need to do next.</p>
  </motion.div>
);

const Dashboard = () => {
  const { name, email, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("MEDIUM");
  const [newDueDate, setNewDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("DASHBOARD");
  const notifiedTasksRef = useRef<Set<string>>(new Set(
    (() => {
      try {
        return JSON.parse(localStorage.getItem("taskzen_notified_overdue") || "[]");
      } catch (e) {
        return [];
      }
    })()
  ));
  const notifiedDueSoonTasksRef = useRef<Set<string>>(new Set(
    (() => {
      try {
        return JSON.parse(localStorage.getItem("taskzen_notified_duesoon") || "[]");
      } catch (e) {
        return [];
      }
    })()
  ));

  const showNotification = (title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/logo.png",
      });
    }
  };

  useEffect(() => {
    todos.forEach((todo) => {
      if (!todo.completed) {
        // Check dynamic status for DUE_SOON state
        if (todo.status === "DUE_SOON" && !notifiedDueSoonTasksRef.current.has(todo.id)) {
          showNotification("⏰ Task Due Soon", `${todo.task} is due in less than 1 hour`);
          notifiedDueSoonTasksRef.current.add(todo.id);
          localStorage.setItem("taskzen_notified_duesoon", JSON.stringify(Array.from(notifiedDueSoonTasksRef.current)));
        }

        // Check local time for general OVERDUE state
        if (todo.dueDate) {
          const dateParts = todo.dueDate.split("-");
          let dueDate: Date;
          if (dateParts.length === 3) {
            dueDate = new Date(
              parseInt(dateParts[0]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[2]),
              23, 59, 59
            );
          } else {
            dueDate = new Date(todo.dueDate);
          }

          const now = new Date();
          console.log("Checking task:", todo.task, "| Due Date:", dueDate, "| Current Time:", now);

          if (dueDate < now && !notifiedTasksRef.current.has(todo.id)) {
            console.log("TRIGGERING NOTIFICATION FOR OVERDUE TASK:", todo.task);
            showNotification("⚠️ Task Pending", `${todo.task} is overdue 🚨`);
            notifiedTasksRef.current.add(todo.id);
            localStorage.setItem("taskzen_notified_overdue", JSON.stringify(Array.from(notifiedTasksRef.current)));
          }
        }
      }
    });
  }, [todos]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [todoData, statsData] = await Promise.all([getTodos(), getStats()]);
      setTodos(todoData);
      setStats(statsData);
    } catch (err) {
      setError((err as Error).message || "Unable to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (!todo.task.toLowerCase().includes(search.toLowerCase())) return false;
    
    if (filter === "COMPLETED") return todo.completed;
    if (filter === "PENDING") return !todo.completed;
    if (filter === "IMPORTANT") return todo.priority === "HIGH";
    
    return true;
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTodo(id);
      await loadDashboard();
      toast.success("Task updated");
    } catch (err) {
      setError((err as Error).message || "Unable to toggle todo");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      await loadDashboard();
      toast.success("Task deleted");
    } catch (err) {
      setError((err as Error).message || "Unable to delete todo");
    }
  };

  const handleAdd = async () => {
    if (!newTask.trim()) {
      setError("Task is required");
      return;
    }

    try {
      const dateOnly = newDueDate ? newDueDate.split("T")[0] : "";
      await addTodo({
        task: newTask,
        priority: newPriority,
        dueDate: dateOnly,
        dueDateTime: newDueDate || undefined,
        completed: false,
      });
      setNewTask("");
      setNewPriority("MEDIUM");
      setNewDueDate("");
      await loadDashboard();
      toast.success("Task added");
    } catch (err) {
      setError((err as Error).message || "Unable to add todo");
    }
  };

  return (
    <div className="bg-[var(--background)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_35%)] min-h-screen">
      <Sidebar activeFilter={filter} setFilter={setFilter} />
      <BottomNav activeFilter={filter} setFilter={setFilter} />

      <div className="md:ml-64 p-4 md:p-10 pb-24 md:pb-10">
        <MobileNavbar />
        <Navbar search={search} setSearch={setSearch} />

        {error ? (
          <div className="mb-6 rounded-3xl border border-red-500 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        ) : null}

        {filter === "DASHBOARD" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-10">
              <StatsCard
                title="Total Tasks"
                value={loading ? "..." : stats ? stats.totalTasks : 0}
                subtitle="All tasks in your workspace 📂"
              />

              <StatsCard
                title="Upcoming Tasks"
                value={loading ? "..." : stats ? stats.upcomingTasks : 0}
                subtitle="Planned calendar schedule 📅"
              />

              <StatsCard
                title="Overdue Tasks"
                value={loading ? "..." : stats ? stats.overdueTasks : 0}
                subtitle="Requires immediate action ⚠️"
              />

              <StatsCard
                title="Completion Rate"
                value={loading ? "..." : stats ? `${stats.completionRate.toFixed(0)}%` : "0%"}
                subtitle="Total project momentum 🚀"
              />
            </div>

            <div className="mb-10">
              <ProductivityChart
                completed={stats?.completedTasks || 0}
                pending={stats?.pendingTasks || 0}
              />
            </div>

            <div className="mb-10 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
              <div className="bg-card border border-border shadow-card rounded-3xl p-4 md:p-6 mb-8 md:mb-0">
                <h2 className="text-text text-xl md:text-2xl font-semibold mb-4">Add new task</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted block mb-2">Task</label>
                    <input
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-input px-4 py-3 text-text outline-none"
                      placeholder="Enter new task"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm text-muted block mb-2">Priority</label>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-input px-4 py-3 text-text outline-none"
                      >
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-muted block mb-2">Due date & time</label>
                      <input
                        type="datetime-local"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-input px-4 py-3 text-text outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className="mt-2 rounded-2xl bg-gradient-to-r from-primary to-primaryHover px-6 py-3 text-white shadow-card hover:from-primaryHover hover:to-primary transition-all duration-300"
                  >
                    Add Task
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border shadow-card rounded-3xl p-4 md:p-6">
                <h2 className="text-text text-xl md:text-2xl font-semibold mb-4">Live summary</h2>
                <p className="text-muted mb-4">
                  {stats ? `You have completed ${stats.completedTasks} out of ${stats.totalTasks} tasks (${stats.completionRate.toFixed(0)}%). Keep it up!` : "Loading stats..."}
                </p>
                
                <h3 className="text-sm font-semibold text-text mb-3 uppercase tracking-wider">Recent Tasks</h3>
                <div className="space-y-3">
                  {todos.slice(0, 4).map(todo => (
                    <div key={todo.id} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                      <div className="flex flex-col overflow-hidden">
                        <span className={`text-sm truncate ${todo.completed ? 'line-through text-muted' : 'text-text'}`}>
                          {todo.task}
                        </span>
                        {todo.dueDate && (
                          <span className="text-xs text-muted mt-1">{todo.dueDate}</span>
                        )}
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-medium ml-2 shrink-0 ${
                        todo.priority === 'HIGH' ? 'bg-red-500/10 text-red-500' : 
                        todo.priority === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' : 
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {todo.priority}
                      </span>
                    </div>
                  ))}
                  {todos.length === 0 && <span className="text-sm text-muted">No tasks yet.</span>}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {filter === "SETTINGS" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-card border border-border shadow-card rounded-3xl p-6 md:p-10 max-w-4xl mx-auto mb-10 text-text"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
              <Settings className="text-primary" size={28} /> App Settings
            </h2>
            <p className="text-muted mb-8">Customize your TaskZen notifications, branding, and user account parameters.</p>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Account Settings Profile */}
              <div className="bg-card/50 border border-border/80 rounded-2xl p-6 flex flex-col justify-between min-h-[250px]">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">👤 Profile Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted block mb-1 uppercase tracking-wider font-semibold">User Name</label>
                      <div className="bg-input border border-border rounded-xl px-4 py-3 font-medium">{name || "TaskZen User"}</div>
                    </div>
                    <div>
                      <label className="text-xs text-muted block mb-1 uppercase tracking-wider font-semibold">Email Address</label>
                      <div className="bg-input border border-border rounded-xl px-4 py-3 text-muted/80">{email || "taskzen4@gmail.com"}</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    toast.success("Logged out successfully");
                    window.location.href = "/login";
                  }}
                  className="w-full rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-semibold hover:bg-red-500/20 transition-all duration-300 text-sm mt-6 py-3.5 shadow-sm flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Log Out Securely
                </button>
              </div>

              {/* Notification Center Settings */}
              <div className="bg-card/50 border border-border/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">🔔 Browser Notifications</h3>
                  <div className="flex items-center justify-between bg-input border border-border rounded-xl p-4">
                    <div>
                      <span className="text-sm font-medium block">Permission Status</span>
                      <span className="text-xs text-muted">Currently {Notification.permission} in Chrome</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      Notification.permission === "granted" ? "bg-green-500/10 text-green-500" : 
                      Notification.permission === "denied" ? "bg-red-500/10 text-red-500" : 
                      "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {Notification.permission}
                    </span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    if (!("Notification" in window)) {
                      toast.error("This browser does not support desktop notifications.");
                      return;
                    }
                    if (Notification.permission === "granted") {
                      new Notification("🔔 TaskZen Notifications Active!", {
                        body: "You are all set to receive automatic overdue task alerts!",
                        icon: "/logo.png"
                      });
                      toast.success("Desktop notifications are active and verified!");
                    } else {
                      Notification.requestPermission().then((permission) => {
                        if (permission === "granted") {
                          new Notification("🎉 Notifications Enabled!", {
                            body: "Welcome to TaskZen smart overdue task reminders!",
                            icon: "/logo.png"
                          });
                          toast.success("Notifications enabled successfully!");
                        } else {
                          toast.error("Notification permission denied. Please allow them in your browser settings.");
                        }
                      });
                    }
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-primaryHover py-3 text-white font-medium hover:opacity-95 transition-all text-sm mt-4 shadow-sm"
                >
                  {Notification.permission === "granted" ? "Send Test Alert Notification" : "Grant Notification Permission"}
                </button>
              </div>
            </div>

            {/* Email automation status */}
            <div className="mt-8 bg-card/50 border border-border/80 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">📧 Automated Email Reports</h3>
              <p className="text-sm text-muted">
                TaskZen automatically connects to your Spring Boot backend to schedule automated email reminders every 60 seconds. Emails are delivered via a secured SMTP tunnel using taskzen4@gmail.com app credentials.
              </p>
              <div className="flex items-center gap-2 text-xs text-green-500 font-semibold bg-green-500/10 rounded-xl px-3 py-2.5 w-fit">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span> Live & Connected to SMTP
              </div>
            </div>
          </motion.div>
        )}

        {filter !== "SETTINGS" && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <div
                  className="space-y-4 min-h-[200px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <TaskSkeleton key={i} />)
                  ) : filteredTodos.length > 0 ? (
                    <AnimatePresence>
                      {filteredTodos.map((todo, index) => (
                        <Draggable 
                          key={todo.id} 
                          draggableId={todo.id} 
                          index={index}
                          isDragDisabled={(filter !== "ALL" && filter !== "DASHBOARD") || search.length > 0}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                todo={todo}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <EmptyState />
                  )}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
