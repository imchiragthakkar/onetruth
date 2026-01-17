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
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const calculateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
}

const getAgeGroup = (age) => {
    if (age < 13) return 'kids'
    if (age < 25) return 'youth'
    if (age < 60) return 'adults'
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

    signUp: async (email, password, dob) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Calculate age and group
            const age = calculateAge(dob)
            const ageGroup = getAgeGroup(age)

            await setDoc(doc(db, 'users', user.uid), {
                email,
                dob,
                age,
                ageGroup,
                createdAt: new Date()
            })

            // Update local state immediately
            set({ user: { ...user, dob, age, ageGroup } })
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
    },

    updateProfile: async (data) => {
        try {
            const { dob } = data
            const updates = { ...data }

            if (dob) {
                const age = calculateAge(dob)
                updates.age = age
                updates.ageGroup = getAgeGroup(age)
            }

            const user = auth.currentUser
            if (!user) throw new Error("No user logged in")

            await updateDoc(doc(db, 'users', user.uid), updates)

            // Update local state
            set(state => ({
                user: { ...state.user, ...updates }
            }))
        } catch (error) {
            throw error
        }
    }
}))
