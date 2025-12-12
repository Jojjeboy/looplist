import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Folder } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableCategoryCard } from './SortableCategoryCard';

export const CategoryView: React.FC = () => {
    const { t } = useTranslation();
    const { categories, addCategory, deleteCategory, reorderCategories } = useApp();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; categoryId: string | null }>({
        isOpen: false,
        categoryId: null,
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        document.title = 'Anti';
    }, []);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            addCategory(newCategoryName.trim());
            setNewCategoryName('');
        }
    };

    const confirmDelete = () => {
        if (deleteModal.categoryId) {
            deleteCategory(deleteModal.categoryId);
            setDeleteModal({ isOpen: false, categoryId: null });
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = categories.findIndex((c) => c.id === active.id);
            const newIndex = categories.findIndex((c) => c.id === over?.id);
            const reordered = arrayMove(categories, oldIndex, newIndex);
            await reorderCategories(reordered);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('categories.title')}</h2>
            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder={t('categories.newPlaceholder')}
                    className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button
                    type="submit"
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-colors"
                >
                    <Plus />
                </button>
            </form>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid gap-3">
                        {categories.map((category) => (
                            <SortableCategoryCard
                                key={category.id}
                                category={category}
                                onDelete={(categoryId: string) => setDeleteModal({ isOpen: true, categoryId })}
                            />
                        ))}
                        {categories.length === 0 && (
                            <div className="text-center py-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                    <Folder size={32} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500">{t('categories.empty')}</p>
                                <p className="text-sm text-gray-400">{t('categories.emptyHint')}</p>
                            </div>
                        )}
                    </div>
                </SortableContext>
            </DndContext>

            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, categoryId: null })}
                onConfirm={confirmDelete}
                title={t('categories.deleteTitle')}
                message={t('categories.deleteMessage')}
                confirmText={t('categories.deleteConfirm')}
                isDestructive
            />
        </div>
    );
};
