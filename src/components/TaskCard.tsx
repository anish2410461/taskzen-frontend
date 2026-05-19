import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({
  todo,
  onToggle,
  onDelete,
}: Props) => {
  const [showMenu, setShowMenu] = useState(false);

  const priorityClasses =
    todo.priority === 'HIGH'
      ? 'bg-red-500/15 text-red-400'
      : todo.priority === 'MEDIUM'
      ? 'bg-orange-500/15 text-orange-400'
      : 'bg-blue-500/15 text-blue-400';

  const status = todo.completed ? 'COMPLETED' : (todo.status || 'UPCOMING');
  const statusClasses =
    status === 'COMPLETED'
      ? 'bg-green-500/15 text-green-400'
      : status === 'OVERDUE'
      ? 'bg-red-500/15 text-red-400'
      : status === 'DUE_SOON'
      ? 'bg-orange-500/15 text-orange-400 animate-pulse'
      : 'bg-blue-500/15 text-blue-400';

  const borderClasses = todo.completed
    ? 'border-green-500/30 dark:border-green-500/20 hover:border-green-500/50'
    : status === 'OVERDUE'
    ? 'border-red-500/40 dark:border-red-500/30 hover:border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.08)]'
    : status === 'DUE_SOON'
    ? 'border-orange-500/40 dark:border-orange-500/30 hover:border-orange-500/60 shadow-[0_0_12px_rgba(249,115,22,0.08)]'
    : 'border-blue-500/30 dark:border-blue-500/20 hover:border-blue-500/50';

  const getCountdown = () => {
    if (!todo.dueDateTime || todo.completed) return null;
    const due = new Date(todo.dueDateTime);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    if (diff <= 0) return 'Overdue';
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return `${hours}h ${minutes}m left`;
  };
  const countdownText = getCountdown();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={`group bg-card border ${borderClasses} shadow-card hover:shadow-glow rounded-2xl p-4 flex items-center justify-between transition-all cursor-grab`}
    >
      {/* LEFT: Checkbox and Task Info */}
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 rounded border border-border bg-card text-primary cursor-pointer accent-primary"
        />
        <div className="flex flex-col">
          <h1 className={`text-text text-base font-medium ${todo.completed ? 'line-through text-muted' : ''}`}>
            {todo.task}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
            <span className="text-muted text-xs font-medium">
              {todo.dueDateTime 
                ? `Due ${new Date(todo.dueDateTime).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}` 
                : todo.dueDate 
                ? `Due ${todo.dueDate}` 
                : 'No due date'}
            </span>
            {countdownText && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                countdownText === 'Overdue' 
                  ? 'bg-red-500/10 text-red-500' 
                  : status === 'DUE_SOON'
                  ? 'bg-orange-500/10 text-orange-500 animate-pulse'
                  : 'bg-blue-500/10 text-blue-500'
              }`}>
                ⏰ {countdownText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Badges and Actions */}
      <div className="flex items-center gap-3">
        <span className={`${priorityClasses} text-[10px] font-bold px-2 py-1 rounded-md tracking-wider uppercase`}>
          {todo.priority}
        </span>
        <span className={`${statusClasses} text-[10px] font-bold px-2 py-1 rounded-md tracking-wider uppercase`}>
          {status}
        </span>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-muted hover:text-text hover:bg-hover rounded-lg transition-colors"
          >
            <MoreVertical size={18} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-32 bg-card border border-border shadow-card rounded-xl overflow-hidden z-10"
              >
                <button
                  onClick={() => {
                    onDelete(todo.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
