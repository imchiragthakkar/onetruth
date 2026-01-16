import { create } from 'zustand'
import { db, auth } from '../lib/firebase'
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDocs,
    orderBy,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore'

export const useTaskStore = create((set, get) => ({
    tasks: [],
    loading: false,

    fetchTasks: async () => {
        set({ loading: true })
        if (!auth.currentUser) {
            set({ tasks: [], loading: false })
            return
        }

        try {
            const q = query(
                collection(db, "tasks"),
                where("user_id", "==", auth.currentUser.uid),
            )

            // Note: Compound queries (where + orderBy) require an index in Firestore.
            // For now, we'll sort in memory to avoid the index creation step blocking the user immediately.
            const querySnapshot = await getDocs(q)
            const tasks = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => {
                // Sort by created_at desc (newest first)
                // Handle timestamps that might be null (optimistic) or server timestamps
                const timeA = a.created_at?.toDate?.() || new Date(a.created_at)
                const timeB = b.created_at?.toDate?.() || new Date(b.created_at)
                return timeB - timeA
            })

            set({ tasks, loading: false })
        } catch (error) {
            console.error("Error fetching tasks:", error)
            set({ loading: false })
        }
    },

    addTask: async (title, category = 'General') => {
        if (!auth.currentUser) return

        const newTask = {
            user_id: auth.currentUser.uid,
            title,
            category,
            is_completed: false,
            created_at: serverTimestamp() // Let Firestore set the time
        }

        // Optimistic UI update (using current time for temp display)
        const tempId = Date.now().toString()
        const optimisticTask = { ...newTask, id: tempId, created_at: new Date() }

        set(state => ({ tasks: [optimisticTask, ...state.tasks] }))

        try {
            const docRef = await addDoc(collection(db, "tasks"), newTask)
            // Update the temporary task with the real ID from Firestore
            set(state => ({
                tasks: state.tasks.map(t => t.id === tempId ? { ...t, id: docRef.id } : t)
            }))
        } catch (error) {
            console.error("Error adding task:", error)
            // Revert on error
            set(state => ({ tasks: state.tasks.filter(t => t.id !== tempId) }))
        }
    },

    toggleTask: async (id, is_completed) => {
        set(state => ({
            tasks: state.tasks.map(t => t.id === id ? { ...t, is_completed } : t)
        }))

        try {
            const taskRef = doc(db, "tasks", id)
            await updateDoc(taskRef, { is_completed })
        } catch (error) {
            console.error("Error toggling task:", error)
            // Revert
            set(state => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, is_completed: !is_completed } : t)
            }))
        }
    },

    deleteTask: async (id) => {
        const previousTasks = get().tasks
        set(state => ({
            tasks: state.tasks.filter(t => t.id !== id)
        }))

        try {
            await deleteDoc(doc(db, "tasks", id))
        } catch (error) {
            console.error("Error deleting task:", error)
            set({ tasks: previousTasks })
        }
    }
}))
