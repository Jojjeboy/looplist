import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryView } from './CategoryView';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import * as AppContext from '../context/AppContext';

// Mock i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock dnd-kit to avoid issues in test environment
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
    rectSortingStrategy: vi.fn(),
}));

// Mock child components to simplify testing CategoryView logic
vi.mock('./CategorySection', () => ({
    CategorySection: ({ category }: { category: { name: string } }) => <div data-testid="category-section">{category.name}</div>
}));

vi.mock('./ManageCategoriesModal', () => ({
    ManageCategoriesModal: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div data-testid="manage-categories-modal">Manage Categories Modal</div> : null
}));

vi.mock('./CombinationCard', () => ({
    CombinationCard: ({ combination }: { combination: { name: string } }) => <div data-testid="combination-card">{combination.name}</div>
}));

vi.mock('./SessionPicker', () => ({
    SessionPicker: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div data-testid="session-picker" /> : null
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Plus: () => <div data-testid="plus" />,
    Folder: () => <div data-testid="folder" />,
    PlayCircle: () => <div data-testid="play-circle" />,
    ChevronDown: () => <div data-testid="chevron-down" />,
    ChevronRight: () => <div data-testid="chevron-right" />
}));

const mockAddCategory = vi.fn();
const mockAddCombination = vi.fn();

describe('CategoryView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(AppContext, 'useApp').mockReturnValue({
            categories: [
                { id: 'cat1', name: 'Work', order: 0 },
                { id: 'cat2', name: 'Personal', order: 1 }
            ],
            lists: [{ id: 'l1', name: 'List 1', categoryId: 'cat1', items: [] }],
            combinations: [
                { id: 'combo1', name: 'Morning Routine', listIds: ['l1'], createdAt: '' }
            ],
            addCategory: mockAddCategory,
            addCombination: mockAddCombination,
            updateCombination: vi.fn(),
            deleteCombination: vi.fn(),
            deleteCategory: vi.fn(),
            reorderCategories: vi.fn(),
            addSession: vi.fn(),
            sessions: [],
            updateListItems: vi.fn(),
            completeSession: vi.fn(),
            deleteSession: vi.fn(),
            addList: vi.fn(), // addList returns Promise<string> but here mocked as void/any is fine or we can match signature
            deleteList: vi.fn(),
            copyList: vi.fn(),
            moveList: vi.fn(),
            updateCategoryName: vi.fn(),
            updateListName: vi.fn(),
            reorderLists: vi.fn(),
        } as unknown as ReturnType<typeof AppContext.useApp>);
    });

    const renderComponent = () => {
        render(
            <MemoryRouter>
                <CategoryView />
            </MemoryRouter>
        );
    };

    it('renders categories and combinations', () => {
        renderComponent();

        expect(screen.getByText('Work')).toBeDefined();
        expect(screen.getByText('Personal')).toBeDefined();

        // Open combinations accordion
        const accordion = screen.getByText('combinations.title');
        fireEvent.click(accordion);

        expect(screen.getByText('Morning Routine')).toBeDefined();
    });

    it('opens manage categories modal', () => {
        renderComponent();

        const manageButton = screen.getByText('categories.manage');
        expect(manageButton).toBeDefined();

        fireEvent.click(manageButton);

        expect(screen.getByTestId('manage-categories-modal')).toBeDefined();
    });
});
