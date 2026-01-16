import { create } from 'zustand'
import { auth } from '../lib/firebase'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth'

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,

    initialize: () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            set({ user, loading: false })
        })
        return unsubscribe
    },

    signIn: async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            throw error
        }
    },

    signUp: async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch (error) {
            throw error
        }
    },

    signInWithGoogle: async () => {
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
        } catch (error) {
            throw error
        }
    },

    signOut: async () => {
        try {
            await firebaseSignOut(auth)
            set({ user: null })
        } catch (error) {
            console.error(error)
        }
    }
}))
