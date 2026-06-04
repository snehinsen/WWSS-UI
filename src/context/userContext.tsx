import {
    Context,
    createContext,
    ReactElement,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { User } from "../backend/types";
import { getUser } from "../backend/api";

interface UserContextType {
    user: User | null;
    loading: boolean;
}

const UserContext: Context<UserContextType> = createContext<UserContextType>({
    loading: false,
    user: null
});

interface Props {
    children: ReactNode;
}

export function UserContextProvider({ children }: Props): ReactElement {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const data: User = await getUser();
            setUser(data);
        } catch (error: any) {
            if (error?.response?.status === 401) {
                setUser(null);
            } else {
                console.error("Failed to fetch user:", error);
            }
        }
    }, []);

    useEffect(() => {
        fetchUser()
            .finally(() => setLoading(false));
    }, [fetchUser]);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext(): UserContextType {
    const context: UserContextType | undefined = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within UserContextProvider");
    }

    return context;
};