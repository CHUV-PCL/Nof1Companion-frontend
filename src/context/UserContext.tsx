import { createContext, ReactNode, useContext, useState } from 'react';
import { Physician } from '../entities/people';
import { USER_CTX_KEY } from '../utils/constants';

// User global Context and Provider for the application.

export type UserContextType = {
	access_token: string;
	user: Physician | null;
};

type UserContextProviderType = {
	userContext: UserContextType;
	setUserContext: (userCtx: UserContextType) => void;
	login: (userCtx: UserContextType) => void;
	logout: () => void;
};

export const userContextDefaultValue: UserContextType = {
	access_token: '',
	user: null,
};

const UserContext = createContext<UserContextProviderType>({
	userContext: userContextDefaultValue,
	setUserContext: () => {},
	login: () => {},
	logout: () => {},
});

export function useUserContext(): UserContextProviderType {
	return useContext(UserContext);
}

type UserContextProviderProps = {
	children: ReactNode;
};

/**
 * Provider for the current user of the application.
 * Providing information about the user and methods to manage it.
 */
export const UserContextProvider = ({ children }: UserContextProviderProps) => {
	const [userContext, setUserContext] = useState<UserContextType>(
		userContextDefaultValue,
	);

	const login = (userCtx: UserContextType) => {
		sessionStorage.setItem(
			USER_CTX_KEY,
			JSON.stringify({
				access_token: userCtx.access_token,
				userId: userCtx.user?._id,
			}),
		);
		setUserContext(userCtx);
	};

	const logout = () => {
		sessionStorage.removeItem(USER_CTX_KEY);
		setUserContext(userContextDefaultValue);
	};

	return (
		<UserContext.Provider value={{ userContext, setUserContext, login, logout }}>
			{children}
		</UserContext.Provider>
	);
};
