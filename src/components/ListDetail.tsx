import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Item, ListSettings, List } from '../types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Plus, ChevronLeft, Settings, RotateCcw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from './Modal';

import { useTranslation } from 'react-i18next';

/**
 * Detailed view for a single list.
 * Supports adding items, toggling states (normal/three-stage), 
 * sorting, and reordering items via drag and drop.
 */
export const ListDetail: React.FC = () => {
    const { t } = useTranslation();
    const { listId } = useParams<{ listId: string }>();
    const { lists, updateListItems, deleteItem, updateListName, updateListSettings, updateListAccess } = useApp();
    const [newItemText, setNewItemText] = useState('');
    const [uncheckModalOpen, setUncheckModalOpen] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);

    const list: List | undefined = lists.find((l) => l.id === listId);

    React.useEffect(() => {
        if (list) {
            document.title = `Anti - ${list.name}`;
            setEditedTitle(list.name);
            updateListAccess(list.id);
        }
    }, [list?.id, list?.name]); // careful with dependencies to avoid loops, list object changes on updateListAccess if we aren't careful?
    // Actually, updateListAccess updates the list in context, so 'list' will change.
    // We only want to trigger this on MOUNT or when we switch to a different listId.
    // So we should depend on listId.

    useEffect(() => {
        if (listId) {
            updateListAccess(listId);
        }
    }, [listId]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [sortBy, setSortBy] = useState<'manual' | 'alphabetical' | 'completed'>('manual');
    const threeStageMode = list?.settings?.threeStageMode ?? false;

    // Load sort setting from list or default to manual
    useEffect(() => {
        if (list?.settings?.defaultSort) {
            setSortBy(list.settings.defaultSort);
        }
    }, [list?.settings?.defaultSort]);

    // Memoized sort of items based on current settings
    const sortedItems = React.useMemo(() => {
        if (!list) return [];
        const items = [...list.items];
        if (sortBy === 'alphabetical') {
            items.sort((a, b) => a.text.localeCompare(b.text));
        } else if (sortBy === 'completed') {
            items.sort((a, b) => {
                // Sort order: Prepared -> Unchecked -> Completed
                // Assign weights: Prepared = 0, Unchecked = 1, Completed = 2
                const getWeight = (item: Item) => {
                    if (item.completed) return 2;
                    if (threeStageMode && item.state === 'prepared') return 0;
                    return 1;
                };
                const weightA = getWeight(a);
                const weightB = getWeight(b);
                if (weightA !== weightB) return weightA - weightB;
                // Secondary sort: Alphabetical
                return a.text.localeCompare(b.text);
            });
        }
        return items;
    }, [list, sortBy, threeStageMode]);

    if (!list) return <div className="text-center py-10">{t('lists.notFound')}</div>;

    /**
     * Adds a new item to the current list.
     */
    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemText.trim()) {
            const newItem = { id: uuidv4(), text: newItemText.trim(), completed: false };
            await updateListItems(list.id, [...list.items, newItem]);
            setNewItemText('');
        }
    };

    /**
     * Handles item reordering via drag and drop.
     */
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = list.items.findIndex((item) => item.id === active.id);
            const newIndex = list.items.findIndex((item) => item.id === over?.id);
            await updateListItems(list.id, arrayMove(list.items, oldIndex, newIndex));
        }
    };

    /**
     * Cycles an item through its possible states.
     * In normal mode: unresolved <-> completed
     * In three-stage mode: unresolved -> prepared -> completed -> unresolved
     */
    const handleToggle = async (itemId: string) => {
        const newItems = list.items.map(item => {
            if (item.id !== itemId) return item;

            // Logic for state cycling
            let newState: 'unresolved' | 'prepared' | 'completed';
            let newCompleted: boolean;

            if (threeStageMode) {
                // Cycle: unresolved -> prepared -> completed -> unresolved
                if (item.completed) {
                    // Was completed, go to unresolved
                    newState = 'unresolved';
                    newCompleted = false;
                } else if (item.state === 'prepared') {
                    // Was prepared, go to completed
                    newState = 'completed';
                    newCompleted = true;
                } else {
                    // Was unresolved, go to prepared
                    newState = 'prepared';
                    newCompleted = false;
                }
            } else {
                // Normal toggle
                newCompleted = !item.completed;
                newState = newCompleted ? 'completed' : 'unresolved';
            }

            return { ...item, completed: newCompleted, state: newState };
        });
        await updateListItems(list.id, newItems);

        // Check if all items are now completed
        const allCompleted = newItems.every(item => item.completed);
        if (allCompleted && newItems.length > 0) {
            setUncheckModalOpen(true);
        }
    };

    const handleDelete = async (itemId: string) => {
        await deleteItem(list.id, itemId);
    };

    const handleEdit = async (itemId: string, text: string) => {
        const newItems = list.items.map(item =>
            item.id === itemId ? { ...item, text } : item
        );
        await updateListItems(list.id, newItems);
    };

    const confirmUncheckAll = async () => {
        const newItems = list.items.map(item => ({ ...item, completed: false }));
        await updateListItems(list.id, newItems);
        setUncheckModalOpen(false);
    };

    const handleSaveTitle = async () => {
        if (editedTitle.trim()) {
            await updateListName(list.id, editedTitle.trim());
            setIsEditingTitle(false);
        }
    };

    const updateSettings = async (newSettings: Partial<typeof list.settings>) => {
        if (!list) return;
        const currentSettings = list.settings || { threeStageMode: false, defaultSort: 'manual' };
        const updated: ListSettings = { ...currentSettings, ...newSettings } as ListSettings;
        await updateListSettings(list.id, updated);
    };



    return (
        <div className="space-y-6">
            {/* ... (header code) ... */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0" title={t('common.back', 'Back')}>
                        <ChevronLeft />
                    </Link>
                    {isEditingTitle ? (
                        <div className="flex items-center gap-2 flex-1 mr-4 min-w-0">
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="text-xl font-semibold bg-transparent border-b-2 border-blue-500 focus:outline-none w-full min-w-0"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveTitle();
                                    if (e.key === 'Escape') {
                                        setEditedTitle(list.name);
                                        setIsEditingTitle(false);
                                    }
                                }}
                                onBlur={handleSaveTitle}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group min-w-0 flex-1">
                            <h2 className="text-xl font-semibold truncate">{list.name}</h2>
                            <button
                                onClick={() => setIsEditingTitle(true)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-500 transition-all flex-shrink-0"
                                title={t('lists.editTitle')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleAddItem} className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder={t('lists.addItemPlaceholder')}
                        className="w-full p-3 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-colors"
                >
                    <Plus />
                </button>
                <button
                    onClick={() => setSettingsOpen(true)}
                    className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                >
                    <Settings size={20} />
                </button>
            </form>

            {
                sortBy === 'manual' ? (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={sortedItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                                {sortedItems.map((item) => (
                                    <SortableItem
                                        key={item.id}
                                        item={item}
                                        onToggle={handleToggle}
                                        onDelete={handleDelete}
                                        onEdit={handleEdit}
                                        threeStageMode={threeStageMode}
                                    />
                                ))}
                                {sortedItems.length === 0 && (
                                    <p className="text-center text-gray-500 mt-8">{t('lists.emptyList')}</p>
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="space-y-2">
                        {sortedItems.map((item) => (
                            <SortableItem
                                key={item.id}
                                item={item}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                                disabled={true} // We need to update SortableItem to accept a disabled prop or just hide the drag handle
                                threeStageMode={threeStageMode}
                            />
                        ))}
                        {sortedItems.length === 0 && (
                            <p className="text-center text-gray-500 mt-8">{t('lists.emptyList')}</p>
                        )}
                    </div>
                )
            }

            <Modal
                isOpen={uncheckModalOpen}
                onClose={() => setUncheckModalOpen(false)}
                onConfirm={confirmUncheckAll}
                title={t('lists.resetTitle')}
                message={t('lists.resetMessage')}
                confirmText={t('lists.reset')}
            />
            <Modal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                title={t('lists.settings.title')}
                message="" // Custom content
                confirmText={t('common.done')} // Or just close
                onConfirm={() => setSettingsOpen(false)}
            >
                <div className="space-y-6 pt-2">
                    {/* Three Stage Mode Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{t('lists.settings.threeStage.title')}</span>
                            <span className="text-sm text-gray-500">{t('lists.settings.threeStage.description')}</span>
                        </div>
                        <button
                            onClick={() => updateSettings({ threeStageMode: !threeStageMode })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${threeStageMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${threeStageMode ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>

                    {/* Sorting Options */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('lists.settings.sort')}
                        </label>
                        <div className="space-y-2">
                            {(['manual', 'alphabetical', 'completed'] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => {
                                        setSortBy(mode);
                                        updateSettings({ defaultSort: mode });
                                    }}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border ${sortBy === mode
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="capitalize">{t(`lists.sort.${mode}`)}</span>
                                    {sortBy === mode && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reset List Action */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                            onClick={() => {
                                setSettingsOpen(false);
                                setUncheckModalOpen(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 p-3 text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <RotateCcw size={18} />
                            {t('lists.reset')}
                        </button>
                    </div>
                </div>
            </Modal>
        </div >
    );
};
