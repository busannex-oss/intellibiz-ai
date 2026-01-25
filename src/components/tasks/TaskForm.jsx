import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Calendar } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function TaskForm({ projectId, task, onSave, onCancel }) {
  const [formData, setFormData] = useState(task || {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
    assigned_to: '',
    tags: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    const taskData = {
      ...formData,
      project_id: projectId,
      tags: formData.tags || []
    };

    if (task?.id) {
      await base44.entities.Task.update(task.id, taskData);
    } else {
      await base44.entities.Task.create(taskData);
    }
    
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      <div>
        <Label>Task Title *</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="What needs to be done?"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Add details..."
          rows={3}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Status</Label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <Label>Priority</Label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Due Date</Label>
          <Input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({...formData, due_date: e.target.value})}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Assign To</Label>
          <Input
            type="email"
            value={formData.assigned_to}
            onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
            placeholder="email@example.com"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}