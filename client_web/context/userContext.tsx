"use client"
import { IUser } from "@/lib/models/User";
import React, { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

interface UserContextValue {
    user: IUser | undefined;
    getUser: (email: string) => void
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<IUser>()

    async function getUser() {
        try {

            const token = localStorage.getItem("token")

            const response = await axios.post(
                `/api/auth`,
                {},
                {
                    headers: {
                        "Authorization": token
                    }
                }
            )

            if (response.status !==200) {
                throw new Error("Response wasnt as expected")
            }

            setUser(response.data.user)

            return response.data.user
        } catch (err) {
            console.error(err)
        } finally {
            //cleanup
        }
    }

    useEffect(() => {
        const initalUser = async () => {
            await getUser()
        }
        initalUser()
    }, [])

    const values = {
        user,
        getUser
    }

    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside GameProvider");
  return ctx;
}
