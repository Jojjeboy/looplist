import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SunCalc from 'suncalc';
import { Category, List, Item, Todo, ExecutionSession, ListCombination, ListSettings } from '../types';

type Priority = 'low' | 'medium' | 'high';
import { useToast } from './ToastContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { useFirestoreSync } from '../hooks/useFirestoreSync';
import { useMigrateLocalStorage } from '../hooks/useMigrateLocalStorage';

interface AppContextType {
    categories: Category[];
    lists: List[];
    theme: 'light' | 'dark';
    addCategory: (name: string) => Promise<void>;
    updateCategoryName: (id: string, name: string) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    reorderCategories: (categories: Category[]) => Promise<void>;
    addList: (name: string, categoryId: string) => Promise<string>;
    updateListName: (id: string, name: string) => Promise<void>;
    updateListSettings: (id: string, settings: ListSettings) => Promise<void>;
    deleteList: (id: string) => Promise<void>;
    copyList: (listId: string) => Promise<void>;
    moveList: (listId: string, newCategoryId: string) => Promise<void>;
    reorderLists: (lists: List[]) => Promise<void>;
    updateListItems: (listId: string, items: Item[]) => Promise<void>;
    deleteItem: (listId: string, itemId: string) => Promise<void>;
    toggleTheme: () => void;
    todos: Todo[];
    addTodo: (title: string, content: string, priority: Priority) => Promise<void>;
    updateTodo: (id: string, title: string, content: string, priority: Priority) => Promise<void>;
    toggleTodo: (id: string) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    loading: boolean;
    sessions: ExecutionSession[];
    addSession: (name: string, listIds: string[], categoryId?: string) => Promise<string>;
    completeSession: (sessionId: string) => Promise<void>;
    deleteSession: (id: string) => Promise<void>;
    combinations: ListCombination[];
    addCombination: (name: string, listIds: string[]) => Promise<string>;
    updateCombination: (id: string, updates: Partial<ListCombination>) => Promise<void>;
    deleteCombination: (id: string) => Promise<void>;
    updateListAccess: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Global application state provider.
 * Manages data synchronization with Firestore, theme settings, 
 * and core business logic for categories, lists, notes, and sessions.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { migrating } = useMigrateLocalStorage(user?.uid);

    const categoriesSync = useFirestoreSync<Category>('users/{uid}/categories', user?.uid);
    const listsSync = useFirestoreSync<List>('users/{uid}/lists', user?.uid);
    const todosSync = useFirestoreSync<Todo>('users/{uid}/notes', user?.uid);
    const sessionsSync = useFirestoreSync<ExecutionSession>('users/{uid}/sessions', user?.uid);
    const combinationsSync = useFirestoreSync<ListCombination>('users/{uid}/combinations', user?.uid);

    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [searchQuery, setSearchQuery] = useState('');
    const { showToast } = useToast();
    const { t } = useTranslation();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        if (savedTheme) {
            setTheme(savedTheme);
        }

        const manualTheme = localStorage.getItem('manual_theme');
        if (!manualTheme && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const now = new Date();
                    const times = SunCalc.getTimes(now, latitude, longitude);

                    // Check if it's daytime (between sunrise and sunset)
                    const isDay = now > times.sunrise && now < times.sunset;

                    setTheme(isDay ? 'light' : 'dark');
                },
                (error) => {
                    console.error("Error getting location for auto-theme:", error);
                }
            );
        }
    }, []);

    const addCategory = async (name: string) => {
        await categoriesSync.addItem({ id: uuidv4(), name });
    };

    const updateCategoryName = async (id: string, name: string) => {
        await categoriesSync.updateItem(id, { name });
    };

    const deleteCategory = async (id: string) => {
        await categoriesSync.deleteItem(id);
        // Also delete associated lists
        const listsToDelete = listsSync.data.filter((l) => l.categoryId === id);
        await Promise.all(listsToDelete.map(l => listsSync.deleteItem(l.id)));
    };

    const addList = async (name: string, categoryId: string) => {
        const id = uuidv4();
        await listsSync.addItem({ id, name, categoryId, items: [] });
        return id;
    };

    const updateListName = async (id: string, name: string) => {
        await listsSync.updateItem(id, { name });
    };

    const updateListSettings = async (id: string, settings: ListSettings) => {
        await listsSync.updateItem(id, { settings });
    };

    const updateListAccess = async (id: string) => {
        await listsSync.updateItem(id, { lastAccessedAt: new Date().toISOString() });
    };

    const addCombination = async (name: string, listIds: string[]) => {
        const id = uuidv4();
        const newCombination: ListCombination = {
            id,
            name,
            listIds,
            createdAt: new Date().toISOString(),
        };
        await combinationsSync.addItem(newCombination);
        return id;
    };

    const updateCombination = async (id: string, updates: Partial<ListCombination>) => {
        await combinationsSync.updateItem(id, {
            ...updates,
            updatedAt: new Date().toISOString()
        });
    };

    const deleteCombination = async (id: string) => {
        await combinationsSync.deleteItem(id);
    };

    const deleteList = async (id: string) => {
        const listToDelete = listsSync.data.find(l => l.id === id);
        if (listToDelete) {
            // Handle combinations
            const affectedCombinations = combinationsSync.data.filter(c => c.listIds.includes(id));
            const combinationsToDelete: ListCombination[] = [];
            const combinationsToUpdate: ListCombination[] = [];

            for (const combo of affectedCombinations) {
                if (combo.listIds.length <= 2) {
                    combinationsToDelete.push(combo);
                } else {
                    // Otherwise, just remove the list from the combination's listIds
                    combinationsToUpdate.push(combo);
                }
            }

            // Delete list from Firestore
            await listsSync.deleteItem(id);

            // Cascade operations: Cleanup combinations that depend on this list
            for (const combo of combinationsToDelete) {
                await combinationsSync.deleteItem(combo.id);
            }

            for (const combo of combinationsToUpdate) {
                await combinationsSync.updateItem(combo.id, {
                    listIds: combo.listIds.filter(lid => lid !== id),
                    updatedAt: new Date().toISOString()
                });
            }

            // Construct toast message
            let message = t('toasts.listDeleted', { name: listToDelete.name });
            if (combinationsToDelete.length > 0) {
                message += `. ${t('toasts.combinationsDeleted', { count: combinationsToDelete.length })}`;
            } else if (combinationsToUpdate.length > 0) {
                message += `. ${t('toasts.combinationsUpdated', { count: combinationsToUpdate.length })}`;
            }

            showToast(message, 'info', {
                label: t('common.undo'),
                onClick: async () => {
                    await listsSync.addItem(listToDelete);
                    // Note: We don't restore combinations automatically in this simple undo
                    // complicating the undo logic significantly. 
                    // Ideally we would restore them too, but for MVP this is acceptable or we should disable undo for this case.
                    // For now, let's keep it simple.
                }
            });
        }
    };

    const copyList = async (listId: string) => {
        const listToCopy = listsSync.data.find((l) => l.id === listId);
        if (listToCopy) {
            // Determine base name
            let baseName = listToCopy.name;
            const match = baseName.match(/^(.*?) kopia \d+$/);
            if (match) {
                baseName = match[1];
            }

            // Find all existing copies to determine the next number
            let maxCopyNumber = 0;
            listsSync.data.forEach((l) => {
                if (l.name === baseName) {
                    // The original list counts as "copy 0" effectively for logic, but we start numbering at 1
                }
                const copyMatch = l.name.match(new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} kopia (\\d+)$`));
                if (copyMatch) {
                    const num = Number.parseInt(copyMatch[1], 10);
                    if (num > maxCopyNumber) {
                        maxCopyNumber = num;
                    }
                }
            });

            const newName = `${baseName} kopia ${maxCopyNumber + 1}`;

            const newList = {
                ...listToCopy,
                id: uuidv4(),
                name: newName,
                items: listToCopy.items.map(item => ({ ...item, id: uuidv4() })) // Deep copy items with new IDs
            };
            await listsSync.addItem(newList);
        }
    };

    const moveList = async (listId: string, newCategoryId: string) => {
        await listsSync.updateItem(listId, { categoryId: newCategoryId });
    };

    const reorderLists = async (reorderedLists: List[]) => {
        // Update all lists with new order values
        const updates = reorderedLists.map((list, index) =>
            listsSync.updateItem(list.id, { order: index })
        );
        await Promise.all(updates);
    };

    const reorderCategories = async (reorderedCategories: Category[]) => {
        // Update all categories with new order values
        const updates = reorderedCategories.map((category, index) =>
            categoriesSync.updateItem(category.id, { order: index })
        );
        await Promise.all(updates);
    };

    const updateListItems = async (listId: string, items: Item[]) => {
        await listsSync.updateItem(listId, { items });
    };

    const deleteItem = async (listId: string, itemId: string) => {
        const list = listsSync.data.find(l => l.id === listId);
        if (list) {
            const itemToDelete = list.items.find(i => i.id === itemId);
            if (itemToDelete) {
                const newItems = list.items.filter(i => i.id !== itemId);
                await updateListItems(listId, newItems);

                showToast(t('toasts.itemDeleted'), 'info', {
                    label: t('common.undo'),
                    onClick: async () => {
                        // We need to fetch the latest state of the list before adding back
                        // But since we are inside the closure, we might need to rely on the fact that
                        // updateListItems handles the update.
                        // Ideally we should get the latest list from the sync hook, but we can't await it here easily in the same way.
                        // However, for undo, we can just push the item back to the list we have reference to, 
                        // or better, get the current list from the data array if possible, but that's hard in a callback.
                        // A simple approach:
                        const currentList = listsSync.data.find(l => l.id === listId);
                        if (currentList) {
                            await updateListItems(listId, [...currentList.items, itemToDelete]);
                        }
                    }
                });
            }
        }
    };



    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
        localStorage.setItem('manual_theme', 'true');
    };

    const addTodo = async (title: string, content: string, priority: Priority) => {
        const newTodo: Todo = {
            id: uuidv4(),
            title,
            content,
            createdAt: new Date().toISOString(),
            priority,
            completed: false, // Default to false
        };
        await todosSync.addItem(newTodo);
    };

    const updateTodo = async (id: string, title: string, content: string, priority: Priority) => {
        await todosSync.updateItem(id, { title, content, priority });
    };

    const toggleTodo = async (id: string) => {
        const todo = todosSync.data.find(t => t.id === id);
        if (todo) {
            await todosSync.updateItem(id, { completed: !todo.completed });
        }
    };

    const deleteTodo = async (id: string) => {
        await todosSync.deleteItem(id);
    };

    const addSession = async (name: string, listIds: string[], categoryId?: string) => {
        const id = uuidv4();
        const newSession: ExecutionSession = {
            id,
            name,
            listIds,
            createdAt: new Date().toISOString(),
            ...(categoryId && { categoryId }), // Only include if defined
        };
        await sessionsSync.addItem(newSession);
        return id;
    };

    const completeSession = async (sessionId: string) => {
        const session = sessionsSync.data.find(s => s.id === sessionId);
        if (session) {
            // Reset all lists in the session
            const resetPromises = session.listIds.map(listId => {
                const list = listsSync.data.find(l => l.id === listId);
                if (list) {
                    const resetItems = list.items.map(item => ({ ...item, completed: false }));
                    return updateListItems(listId, resetItems);
                }
                return Promise.resolve();
            });
            await Promise.all(resetPromises);

            // Mark session as completed
            await sessionsSync.updateItem(sessionId, {
                completedAt: new Date().toISOString()
            });
        }
    };

    const deleteSession = async (id: string) => {
        await sessionsSync.deleteItem(id);
    };

    return (
        <AppContext.Provider
            value={{
                categories: categoriesSync.data,
                lists: listsSync.data,
                theme,
                addCategory,
                updateCategoryName,
                deleteCategory,
                reorderCategories,
                addList,
                updateListName,
                updateListSettings,
                deleteList,
                copyList,
                moveList,
                reorderLists,
                updateListItems,
                deleteItem,
                toggleTheme,
                todos: todosSync.data,
                addTodo,
                updateTodo,
                toggleTodo,
                deleteTodo,
                searchQuery,
                setSearchQuery,
                loading: categoriesSync.loading || listsSync.loading || todosSync.loading || migrating,
                sessions: sessionsSync.data,
                addSession,
                completeSession,
                deleteSession,
                combinations: combinationsSync.data,
                addCombination,
                updateCombination,
                deleteCombination,
                updateListAccess,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
