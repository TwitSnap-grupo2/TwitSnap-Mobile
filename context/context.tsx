import React, { createContext, ReactNode, useState } from 'react';
import { User } from '@/types/User';

// Crear el UserContext
const UserContext = createContext<UserContextValue | null>(null);

export interface UserContextValue {
    user: User | null;
    saveUser: (user: User) => void;
}


const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const saveUser = (user: User) => {
        setUser(user);
    };

    return (
        <UserContext.Provider value={{ user, saveUser }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
