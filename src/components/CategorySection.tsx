import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Category, List } from '../types';
import { useTranslation } from 'react-i18next';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableListCard } from './SortableListCard';

interface CategorySectionProps {
    category: Category;
    lists: List[];
    categories: Category[];
    onDelete: (categoryId: string) => void;
    onUpdateName: (categoryId: string, name: string) => Promise<void>;
    onAddList: (name: string, categoryId: string) => Promise<void>;
    onCopyList: (listId: string) => Promise<void>;
    onMoveList: (listId: string, newCategoryId: string) => Promise<void>;
    onDeleteList: (listId: string) => void;
    onClearCompleted: (listId: string) => void;
    onReorderLists: (lists: List[]) => Promise<void>;
    onBulkDeleteLists?: (listIds: string[]) => void;
    onBulkMoveLists?: (listIds: string[], newCategoryId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
    category,
    lists,
    categories,
    onDelete,
    onUpdateName,
    onAddList,
    onCopyList,
    onMoveList,
    onDeleteList,
    onClearCompleted,
    onReorderLists,
    onBulkDeleteLists,
    onBulkMoveLists,
}) => {
    const { t } = useTranslation();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(category.name);
    const [newListName, setNewListName] = useState('');
    const [isAddingList, setIsAddingList] = useState(false);
    const [movingListId, setMovingListId] = useState<string | null>(null);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const categoryLists = lists
        .filter((l) => l.categoryId === category.id && !l.archived)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const handleSaveTitle = async () => {
        if (editedTitle.trim() && editedTitle !== category.name) {
            await onUpdateName(category.id, editedTitle.trim());
        }
        setIsEditingTitle(false);
    };

    const handleAddList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newListName.trim()) {
            await onAddList(newListName.trim(), category.id);
            setNewListName('');
            setIsAddingList(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = categoryLists.findIndex((list) => list.id === active.id);
            const newIndex = categoryLists.findIndex((list) => list.id === over?.id);
            const reorderedLists = arrayMove(categoryLists, oldIndex, newIndex);
            await onReorderLists(reorderedLists);
        }
    };

    const handleMoveToCategory = async (listId: string, newCategoryId: string) => {
        await onMoveList(listId, newCategoryId);
        setMovingListId(null);
    };

    const handleBulkDelete = () => {
        if (onBulkDeleteLists && selectedLists.size > 0) {
            onBulkDeleteLists(Array.from(selectedLists));
            setSelectedLists(new Set());
            setIsSelectionMode(false);
        }
    };

    const handleBulkMove = async (newCategoryId: string) => {
        if (onBulkMoveLists && selectedLists.size > 0) {
            await onBulkMoveLists(Array.from(selectedLists), newCategoryId);
            setSelectedLists(new Set());
            setIsSelectionMode(false);
        }
    };

    const toggleListSelection = (listId: string) => {
        const newSelected = new Set(selectedLists);
        if (newSelected.has(listId)) {
            newSelected.delete(listId);
        } else {
            newSelected.add(listId);
        }
        setSelectedLists(newSelected);
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedLists(new Set());
    };

    return (
        <div
            className={`space-y-3 w-full min-w-0`}
        >
            {/* Category Header */}
            <div className="flex items-center gap-2 group mb-3">
                {isEditingTitle ? (
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveTitle();
                            if (e.key === 'Escape') {
                                setEditedTitle(category.name);
                                setIsEditingTitle(false);
                            }
                        }}
                        onBlur={handleSaveTitle}
                    />
                ) : (
                    <>
                        <h3
                            className="text-xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer flex-1 outline-none focus:text-blue-600 dark:focus:text-blue-400 truncate min-w-0"
                            onClick={() => setIsEditingTitle(true)}
                            tabIndex={0}
                            role="button"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setIsEditingTitle(true);
                                }
                            }}
                        >
                            {category.name}
                        </h3>
                        <button
                            onClick={() => onDelete(category.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label={t('categories.deleteTitle')}
                        >
                            <Trash2 size={20} />
                        </button>
                        <button
                            onClick={() => setIsAddingList(!isAddingList)}
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all"
                        >
                            {t('lists.addLink', '+ Lägg till lista')}
                        </button>
                        {categoryLists.length > 0 && (
                            <button
                                onClick={toggleSelectionMode}
                                className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-all"
                            >
                                {isSelectionMode ? t('common.cancel', 'Avbryt') : t('common.select', 'Välj')}
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Add List Form */}
            {isAddingList && (
                <form onSubmit={handleAddList} className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder={t('lists.newPlaceholder')}
                        autoFocus
                        className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-colors"
                    >
                        <Plus />
                    </button>
                </form>
            )}

            {/* Bulk Actions */}
            {isSelectionMode && (
                <div className="flex items-center gap-2 mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedLists.size} {t('lists.selected', 'valda')}
                    </span>
                    {selectedLists.size > 0 && (
                        <>
                            <button
                                onClick={handleBulkDelete}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                {t('common.delete', 'Radera')}
                            </button>
                            <select
                                onChange={(e) => handleBulkMove(e.target.value)}
                                className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
                                defaultValue=""
                            >
                                <option value="" disabled>{t('lists.moveTo', 'Flytta till...')}</option>
                                {categories.filter(c => c.id !== category.id).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </>
                    )}
                </div>
            )}

            {/* Lists */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={categoryLists.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2 w-full min-w-0">
                        {categoryLists.map((list) => (
                            <SortableListCard
                                key={list.id}
                                list={list}
                                onCopy={onCopyList}
                                onMove={(listId) => setMovingListId(movingListId === listId ? null : listId)}
                                onDelete={onDeleteList}
                                onClearCompleted={onClearCompleted}
                                isMoving={movingListId === list.id}
                                categories={categories}
                                currentCategoryId={category.id}
                                onMoveToCategory={handleMoveToCategory}
                                showHandle={categoryLists.length > 1 && !isSelectionMode}
                                isSelectionMode={isSelectionMode}
                                isSelected={selectedLists.has(list.id)}
                                onToggleSelect={toggleListSelection}
                            />
                        ))}
                        {categoryLists.length === 0 && (
                            <p className="text-center text-gray-500 text-sm py-4">{t('lists.empty')}</p>
                        )}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};
