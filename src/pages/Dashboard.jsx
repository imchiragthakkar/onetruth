import React, { useEffect, useState } from 'react'
import { Plus, Trash2, CheckCircle, ListTodo } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { useTaskStore } from '../store/useTaskStore'
import { useAuthStore } from '../store/useAuthStore'
import { Navigate } from 'react-router-dom'

export default function Dashboard() {
    const { tasks, addTask, deleteTask, fetchTasks } = useTaskStore()
    const { user, loading } = useAuthStore()
    const [newTask, setNewTask] = useState('')

    useEffect(() => {
        fetchTasks()
    }, [])

    const handleAdd = (e) => {
        e.preventDefault()
        if (!newTask.trim()) return
        addTask(newTask)
        setNewTask('')
    }

    if (!loading && !user) {
        return <Navigate to="/auth" />
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="bg-sun-100 p-3 rounded-full text-sun-600">
                        <ListTodo size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-800">My Practices</h1>
                        <p className="text-gray-500">Karma Yoga - Dedicated Action</p>
                    </div>
                </div>

                <Card className="mb-8 p-4">
                    <form onSubmit={handleAdd} className="flex gap-2">
                        <Input
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a new practice or task..."
                            className="flex-1"
                        />
                        <Button type="submit">
                            <Plus size={20} className="mr-2" /> Add
                        </Button>
                    </form>
                </Card>

                <div className="space-y-3">
                    {tasks.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                            <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No tasks yet. Start small.</p>
                        </div>
                    ) : (
                        tasks.map(task => (
                            <div
                                key={task.id}
                                className="group flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 hover:border-sun-200 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-6 h-6 rounded-full border-2 border-sun-300 cursor-pointer hover:bg-sun-400 transition-colors"></div>
                                    <span className="text-lg text-gray-700 font-medium">{task.title || task.text}</span>
                                </div>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full hover:bg-red-50"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    )
}
