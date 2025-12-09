import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  describe('basic functionality', () => {
    it('should initialize with page 1', () => {
      const data = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const { result } = renderHook(() => usePagination(data, 25));

      expect(result.current.currentPage).toBe(1);
    });

    it('should calculate total pages correctly', () => {
      const data = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const { result } = renderHook(() => usePagination(data, 25));

      expect(result.current.totalPages).toBe(2); // 50 items / 25 per page
    });

    it('should return correct paginated data for first page', () => {
      const data = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const { result } = renderHook(() => usePagination(data, 10));

      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData[0].id).toBe(0);
      expect(result.current.paginatedData[9].id).toBe(9);
    });

    it('should handle empty data array', () => {
      const data = [];
      const { result } = renderHook(() => usePagination(data, 25));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.paginatedData).toHaveLength(0);
    });

    it('should use default itemsPerPage of 25', () => {
      const data = Array.from({ length: 30 }, (_, i) => ({ id: i }));
      const { result } = renderHook(() => usePagination(data));

      expect(result.current.paginatedData).toHaveLength(25);
      expect(result.current.totalPages).toBe(2);
    });
  });

  describe('navigation', () => {
    it('should go to next page', () => {
      const data = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const { result } = renderHook(() => usePagination(data, 10));

      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.paginatedData[0].id).toBe(10);
      expect(result.current.paginatedData[9].id).toBe(19);
    });

    it('should go to previous page', () => {
      const data = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const { result } = renderHook(() => usePagination(data, 10));

      act(() => {
        result.current.goToNextPage();
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(3);

      act(() => {
        result.current.goToPreviousPage();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it('should not go to next page when on last page', () => {
      const data = Array.from({ length: 20 }, (_, i) => ({ id: i }));
      const { result } = renderHook(() => usePagination(data, 10));

      act(() => {
        result.current.goToNextPage(); // Go to page 2 (last page)
      });

      expect(result.current.currentPage).toBe(2);

      act(() => {
        result.current.goToNextPage(); // Try to go beyond last page
      });

      expect(result.current.currentPage).toBe(2); // Still on page 2
    });

    it('should not go to previous page when on first page', () => {
      const data = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const { result } = renderHook(() => usePagination(data, 10));

      expect(result.current.currentPage).toBe(1);

      act(() => {
        result.current.goToPreviousPage(); // Try to go before page 1
      });

      expect(result.current.currentPage).toBe(1); // Still on page 1
    });

    it('should go to specific page', () => {
      const data = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const { result } = renderHook(() => usePagination(data, 10));

      act(() => {
        result.current.goToPage(4);
      });

      expect(result.current.currentPage).toBe(4);
      expect(result.current.paginatedData[0].id).toBe(30); // Page 4 starts at index 30
    });

    it('should not go to page beyond total pages', () => {
      const data = Array.from({ length: 30 }, (_, i) => ({ id: i }));
      const { result } = renderHook(() => usePagination(data, 10));

      expect(result.current.totalPages).toBe(3);

      act(() => {
        result.current.goToPage(10); // Try to go to page 10 (doesn't exist)
      });

      expect(result.current.currentPage).toBe(1); // Stays on page 1
    });

    it('should not go to page less than 1', () => {
      const data = Array.from({ length: 30 }, (_, i) => ({ id: i }));
      const { result } = renderHook(() => usePagination(data, 10));

      act(() => {
        result.current.goToPage(0); // Invalid page
      });

      expect(result.current.currentPage).toBe(1); // Stays on page 1
    });
  });

  describe('data changes', () => {
    it('should reset to page 1 when data length changes', () => {
      const initialData = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const { result, rerender } = renderHook(
        ({ data }) => usePagination(data, 10),
        { initialProps: { data: initialData } }
      );

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPage).toBe(3);

      // Change data
      const newData = Array.from({ length: 30 }, (_, i) => ({ id: i }));
      rerender({ data: newData });

      expect(result.current.currentPage).toBe(1); // Reset to page 1
    });

    it('should handle last page with fewer items', () => {
      const data = Array.from({ length: 47 }, (_, i) => ({ id: i }));
      const { result } = renderHook(() => usePagination(data, 10));

      // Go to last page
      act(() => {
        result.current.goToPage(5);
      });

      expect(result.current.currentPage).toBe(5);
      expect(result.current.paginatedData).toHaveLength(7); // Only 7 items on last page
    });
  });
});
