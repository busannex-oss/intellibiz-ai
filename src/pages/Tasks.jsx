import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import TaskBoard from '@/components/tasks/TaskBoard';
import TaskForm from '@/components/tasks/TaskForm';

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.BusinessProject.list()
  });

  // Fetch all tasks
  const { data: allTasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list()
  });

  const { mutate: deleteTask } = useMutation({
    mutationFn: (taskId) => base44.entities.Task.delete(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const prev = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old = []) => old.filter(t => t.id !== taskId));
      return { prev };
    },
    onError: (_err, _id, ctx) => queryClient.setQueryData(['tasks'], ctx.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  });

  const { mutate: updateTaskStatus } = useMutation({
    mutationFn: ({ taskId, status }) => base44.entities.Task.update(taskId, { status }),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const prev = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old = []) =>
        old.map(t => t.id === taskId ? { ...t, status } : t)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => queryClient.setQueryData(['tasks'], ctx.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  });

  const handleFormSave = () => {
    setShowForm(false);
    setEditingTask(null);
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  const filteredTasks = allTasks
    .filter(t => !selectedProject || t.project_id === selectedProject)
    .filter(t => filterStatus === 'all' || t.status === filterStatus)
    .filter(t => !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const getTaskStats = () => {
    const stats = {
      total: filteredTasks.length,
      todo: filteredTasks.filter(t => t.status === 'todo').length,
      inProgress: filteredTasks.filter(t => t.status === 'in_progress').length,
      done: filteredTasks.filter(t => t.status === 'done').length,
      overdue: filteredTasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length
    };
    return stats;
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tasks</h1>
          <p className="text-slate-600">Manage and track all project tasks in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <Card className="p-4 bg-white">
            <div className="text-sm text-slate-500 mb-1">Total Tasks</div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          </Card>
          <Card className="p-4 bg-white">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Circle className="w-3 h-3" />
              To Do
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.todo}</div>
          </Card>
          <Card className="p-4 bg-white">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Clock className="w-3 h-3" />
              In Progress
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </Card>
          <Card className="p-4 bg-white">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <CheckCircle2 className="w-3 h-3" />
              Done
            </div>
            <div className="text-2xl font-bold text-emerald-600">{stats.done}</div>
          </Card>
          <Card className="p-4 bg-white">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <AlertCircle className="w-3 h-3" />
              Overdue
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Project</label>
              <select
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(e.target.value || null)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">All Projects</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.business_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Search</label>
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setView('all')}
            variant={view === 'all' ? 'default' : 'outline'}
            className={view === 'all' ? 'bg-violet-600' : ''}
          >
            List View
          </Button>
          <Button
            onClick={() => setView('board')}
            variant={view === 'board' ? 'default' : 'outline'}
            className={view === 'board' ? 'bg-violet-600' : ''}
          >
            Board View
          </Button>
        </div>

        {/* Task Form */}
        {showForm && (
          <div className="mb-6">
            <TaskForm
              projectId={selectedProject}
              task={editingTask}
              onSave={handleFormSave}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}

        {/* Content */}
        {view === 'board' ? (
          <TaskBoard
            tasks={filteredTasks}
            onEdit={(task) => {
              setEditingTask(task);
              setShowForm(true);
            }}
            onDelete={deleteTask}
            onStatusChange={(taskId, status) => updateTaskStatus({ taskId, status })}
            onNewTask={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          />
        ) : (
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-slate-500">No tasks found</p>
              </div>
            ) : (
              filteredTasks.map(task => {
                const project = projects.find(p => p.id === task.project_id);
                return (
                  <div key={task.id} className="bg-white rounded-lg p-4 border border-slate-200 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={task.status === 'done' ? 'line-through text-slate-500 font-medium' : 'font-medium text-slate-800'}>
                        {task.title}
                      </h3>
                      <div className="flex gap-3 mt-2 text-xs text-slate-500">
                        <span className="text-slate-400">•</span>
                        <span>{project?.business_name}</span>
                        {task.due_date && (
                          <>
                            <span className="text-slate-400">•</span>
                            <span>Due {format(new Date(task.due_date), 'MMM d')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus({ taskId: task.id, status: e.target.value })}
                        className="px-2 py-1 text-xs border border-slate-300 rounded text-slate-700"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTask(task);
                          setShowForm(true);
                        }}
                        className="text-xs"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}