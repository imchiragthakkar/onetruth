import { create } from 'zustand'
// import { auth } from '../lib/firebase'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const getAgeGroup = (age) => {
    const a = parseInt(age)
    if (a < 13) return 'kids'
    if (a < 25) return 'youth'
    if (a < 60) return 'adults'
    return 'elders'
}

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,

    initialize: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch profile
                try {
                    const docRef = doc(db, 'users', firebaseUser.uid)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        set({ user: { ...firebaseUser, ...docSnap.data() }, loading: false })
                    } else {
                        set({ user: firebaseUser, loading: false })
                    }
                } catch (e) {
                    console.error("Error fetching user profile:", e)
                    set({ user: firebaseUser, loading: false })
                }
            } else {
                set({ user: null, loading: false })
            }
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

    signUp: async (email, password, age) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Create user profile
            const ageGroup = getAgeGroup(age)
            await setDoc(doc(db, 'users', user.uid), {
                email,
                age,
                ageGroup,
                createdAt: new Date()
            })

            // Update local state immediately
            set({ user: { ...user, age, ageGroup } })
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
