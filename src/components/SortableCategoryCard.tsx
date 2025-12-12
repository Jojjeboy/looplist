import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { Trash2, Folder, GripVertical } from 'lucide-react';
import { Category } from '../types';
import { useTranslation } from 'react-i18next';

interface SortableCategoryCardProps {
    category: Category;
    onDelete: (categoryId: string) => void;
}

export const SortableCategoryCard: React.FC<SortableCategoryCardProps> = ({ category, onDelete }) => {
    const { t } = useTranslation();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all ${isDragging ? 'z-50 opacity-50' : 'animate-in fade-in slide-in-from-bottom-4 duration-300'}`}
        >
            <Link
                to={`/category/${category.id}`}
                className="flex items-center gap-3 flex-1 text-lg font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors min-w-0"
            >
                <Folder className="text-blue-500 flex-shrink-0" />
                <span className="truncate">{category.name}</span>
            </Link>
            <button
                onClick={() => onDelete(category.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0"
                aria-label={t('categories.deleteTitle')}
            >
                <Trash2 size={20} />
            </button>
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 touch-none flex-shrink-0"
            >
                <GripVertical size={24} strokeWidth={2.5} />
            </div>
        </div>
    );
};
