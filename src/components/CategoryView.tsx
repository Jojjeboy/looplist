import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { SessionPicker } from './SessionPicker';

import { CombinationCard } from './CombinationCard';
import { CombinationEditor } from './CombinationEditor';
import { ListCombination } from '../types';
import { CategorySection } from './CategorySection';

export const CategoryView: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { categories, lists, addCategory, deleteCategory, updateCategoryName, addList, deleteList, copyList, moveList, updateListItems, reorderLists, addSession, combinations, addCombination, updateCombination, deleteCombination } = useApp();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [sessionPickerOpen, setSessionPickerOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; categoryId: string | null }>({
        isOpen: false,
        categoryId: null,
    });
    const [editorState, setEditorState] = useState<{ isOpen: boolean; combination?: ListCombination }>({
        isOpen: false,
    });
    const [deleteCombinationModal, setDeleteCombinationModal] = useState<{ isOpen: boolean; combinationId: string | null }>({
        isOpen: false,
        combinationId: null,
    });

    const sortedCategories = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const [showAddCategory, setShowAddCategory] = useState(false);

    useEffect(() => {
        document.title = 'Anti';
    }, []);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            addCategory(newCategoryName.trim());
            setNewCategoryName('');
            setShowAddCategory(false);
        }
    };

    const confirmDelete = () => {
        if (deleteModal.categoryId) {
            deleteCategory(deleteModal.categoryId);
            setDeleteModal({ isOpen: false, categoryId: null });
        }
    };

    const handleCreateSession = async (name: string, listIds: string[]) => {
        const sessionId = await addSession(name, listIds);
        navigate(`/session/${sessionId}`);
    };

    const handleSaveCombination = async (name: string, listIds: string[]) => {
        if (editorState.combination) {
            await updateCombination(editorState.combination.id, { name, listIds });
        } else {
            await addCombination(name, listIds);
        }
    };

    const handleStartFromCombination = async (listIds: string[]) => {
        // Find combination name for the session or use a default
        const combination = combinations.find(c => JSON.stringify(c.listIds) === JSON.stringify(listIds)); // Simple lookup, might be ambiguous but works for name
        const name = combination ? combination.name : t('sessions.newSession', 'Ny Session');

        const sessionId = await addSession(name, listIds);
        navigate(`/session/${sessionId}`);
    };

    const confirmDeleteCombination = async () => {
        if (deleteCombinationModal.combinationId) {
            await deleteCombination(deleteCombinationModal.combinationId);
            setDeleteCombinationModal({ isOpen: false, combinationId: null });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('categories.title')}</h2>
                <button
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className={`p-2 rounded-lg transition-colors ${showAddCategory ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'}`}
                    title={t('categories.newPlaceholder')}
                >
                    <Plus size={24} className={`transition-transform duration-300 ${showAddCategory ? 'rotate-45' : ''}`} />
                </button>
            </div>

            <div className={`grid transition-all duration-300 ease-in-out ${showAddCategory ? 'grid-rows-[1fr] opacity-100 mb-6' : 'grid-rows-[0fr] opacity-0 mb-0'}`}>
                <div className="overflow-hidden">
                    <form onSubmit={handleAdd} className="flex gap-2 p-1">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder={t('categories.newPlaceholder')}
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
                </div>
            </div>

            {/* Categories Section */}
            <div className="grid gap-6">
                {sortedCategories.map((category) => (
                    <CategorySection
                        key={category.id}
                        category={category}
                        lists={lists}
                        categories={categories}
                        onDelete={(categoryId: string) => setDeleteModal({ isOpen: true, categoryId })}
                        onUpdateName={updateCategoryName}
                        onAddList={async (name, categoryId) => { await addList(name, categoryId); }}
                        onCopyList={copyList}
                        onMoveList={moveList}
                        onDeleteList={deleteList}
                        onClearCompleted={(listId) => {
                            const list = lists.find(l => l.id === listId);
                            if (list) {
                                const activeItems = list.items.filter(i => !i.completed);
                                updateListItems(listId, activeItems);
                            }
                        }}
                        onReorderLists={reorderLists}
                    />
                ))}
                {sortedCategories.length === 0 && (
                    <div className="text-center py-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <Folder size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500">{t('categories.empty')}</p>
                        <p className="text-sm text-gray-400">{t('categories.emptyHint')}</p>
                    </div>
                )}
            </div>

            {/* Saved Combinations Section */}
            <div>
                <div className="flex items-center justify-between mb-3 mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {t('combinations.title', 'Sparade Mallar')}
                    </h3>
                    <button
                        onClick={() => setEditorState({ isOpen: true })}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {t('combinations.createRaw', '+ Skapa ny mall')}
                    </button>
                </div>

                {combinations.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 text-sm">
                            {t('combinations.empty', 'Du har inga sparade mallar än.')}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {combinations.map(combo => (
                            <CombinationCard
                                key={combo.id}
                                combination={combo}
                                lists={lists}
                                onStart={handleStartFromCombination}
                                onEdit={(id) => setEditorState({ isOpen: true, combination: combinations.find(c => c.id === id) })}
                                onDelete={(id) => setDeleteCombinationModal({ isOpen: true, combinationId: id })}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, categoryId: null })}
                onConfirm={confirmDelete}
                title={t('categories.deleteTitle')}
                message={t('categories.deleteMessage')}
                confirmText={t('categories.deleteConfirm')}
                isDestructive
            />

            <Modal
                isOpen={deleteCombinationModal.isOpen}
                onClose={() => setDeleteCombinationModal({ isOpen: false, combinationId: null })}
                onConfirm={confirmDeleteCombination}
                title={t('combinations.deleteTitle', 'Radera mall')}
                message={t('combinations.deleteMessage', 'Är du säker på att du vill radera denna mall? Listorna kommer inte att raderas.')}
                confirmText={t('common.delete', 'Radera')}
                isDestructive
            />

            <SessionPicker
                isOpen={sessionPickerOpen}
                onClose={() => setSessionPickerOpen(false)}
                onCreateSession={handleCreateSession}
                lists={lists}
                categories={categories}
                onSaveCombination={async (name, listIds) => { await addCombination(name, listIds); }}
            />

            <CombinationEditor
                isOpen={editorState.isOpen}
                onClose={() => setEditorState({ isOpen: false })}
                onSave={handleSaveCombination}
                lists={lists}
                categories={categories}
                combination={editorState.combination}
            />
        </div>
    );
};
