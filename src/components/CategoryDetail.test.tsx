import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CategoryDetail } from './CategoryDetail';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as AppContext from '../context/AppContext';

// Mock i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock dnd-kit
vi.mock('@dnd-kit/core', () => ({
    DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    closestCenter: vi.fn(),
    PointerSensor: vi.fn(),
    KeyboardSensor: vi.fn(),
    useSensor: vi.fn(),
    useSensors: vi.fn(),
}));

vi.mock('@dnd-kit/sortable', () => ({
    SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    sortableKeyboardCoordinates: vi.fn(),
    verticalListSortingStrategy: vi.fn(),
    arrayMove: vi.fn(),
}));

// Mock child components
vi.mock('./SortableListCard', () => ({
    SortableListCard: ({ list, onDelete }: { list: { id: string; name: string }; onDelete: (id: string) => void }) => (
        <div data-testid="list-card">
            {list.name}
            <button onClick={() => onDelete(list.id)}>Delete</button>
        </div>
    )
}));

vi.mock('./SessionPicker', () => ({
    SessionPicker: () => <div data-testid="session-picker" />
}));

vi.mock('./Modal', () => ({
    Modal: ({ isOpen, onConfirm, title }: { isOpen: boolean; onConfirm: () => void; title: string }) => isOpen ? (
        <div data-testid="modal">
            {title}
            <button onClick={onConfirm}>Confirm Delete</button>
        </div>
    ) : null
}));

vi.mock('lucide-react', () => ({
    Plus: () => <div />,
    ChevronLeft: () => <div />,
    LayoutTemplate: () => <div />,
    PlayCircle: () => <div />
}));

const mockAddList = vi.fn();
const mockDeleteList = vi.fn();
const mockUpdateCategoryName = vi.fn();

describe('CategoryDetail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(AppContext, 'useApp').mockReturnValue({
            categories: [{ id: 'cat1', name: 'Work', order: 0 }],
            lists: [
                { id: 'l1', name: 'List 1', categoryId: 'cat1', items: [], order: 0 },
                { id: 'l2', name: 'List 2', categoryId: 'cat1', items: [], order: 1 }
            ],
            addList: mockAddList,
            deleteList: mockDeleteList,
            updateCategoryName: mockUpdateCategoryName,
            // defaults
            combinations: [],
            addCategory: vi.fn(),
            deleteCategory: vi.fn(),
            reorderCategories: vi.fn(),
            addSession: vi.fn(),
            combinationsSync: {},
            addCombination: vi.fn(),
            updateCombination: vi.fn(),
            deleteCombination: vi.fn(),
            sessions: [],
            updateListItems: vi.fn(),
            completeSession: vi.fn(),
            deleteSession: vi.fn(),
            copyList: vi.fn(),
            moveList: vi.fn(),
            updateListName: vi.fn(),
            reorderLists: vi.fn(),
            loading: false,
        } as ReturnType<typeof AppContext.useApp>);
    });

    const renderComponent = () => {
        render(
            <MemoryRouter initialEntries={['/category/cat1']}>
                <Routes>
                    <Route path="/category/:categoryId" element={<CategoryDetail />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('renders category and lists', () => {
        renderComponent();
        expect(screen.getByText('Work')).toBeDefined();
        expect(screen.getByText('List 1')).toBeDefined();
        expect(screen.getByText('List 2')).toBeDefined();
    });

    it('adds a new list', async () => {
        renderComponent();
        const input = screen.getByPlaceholderText('lists.newPlaceholder');
        fireEvent.change(input, { target: { value: 'New List' } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        expect(mockAddList).toHaveBeenCalledWith('New List', 'cat1');
    });

    it('opens delete modal and deletes list', async () => {
        renderComponent();

        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(screen.getByTestId('modal')).toBeDefined();
            expect(screen.getByText('lists.deleteTitle')).toBeDefined();
        });

        fireEvent.click(screen.getByText('Confirm Delete'));

        expect(mockDeleteList).toHaveBeenCalledWith('l1');
    });
});
