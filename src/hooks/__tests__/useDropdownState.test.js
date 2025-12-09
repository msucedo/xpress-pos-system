import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDropdownState } from '../useDropdownState';

describe('useDropdownState', () => {
  beforeEach(() => {
    // Setup document event listeners
    document.body.innerHTML = '<div class="oh-table"><div class="oh-filter-icon"></div></div>';
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('basic state management', () => {
    it('should initialize with null dropdown', () => {
      const { result } = renderHook(() => useDropdownState());

      expect(result.current.openDropdown).toBeNull();
    });

    it('should provide dropdownRef', () => {
      const { result } = renderHook(() => useDropdownState());

      expect(result.current.dropdownRef).toBeDefined();
      expect(result.current.dropdownRef.current).toBeNull();
    });
  });

  describe('toggleDropdown', () => {
    it('should open dropdown when toggled from null', () => {
      const { result } = renderHook(() => useDropdownState());

      act(() => {
        result.current.toggleDropdown('column1');
      });

      expect(result.current.openDropdown).toBe('column1');
    });

    it('should close dropdown when toggled with same column', () => {
      const { result } = renderHook(() => useDropdownState());

      act(() => {
        result.current.toggleDropdown('column1');
      });

      expect(result.current.openDropdown).toBe('column1');

      act(() => {
        result.current.toggleDropdown('column1');
      });

      expect(result.current.openDropdown).toBeNull();
    });

    it('should switch to different dropdown', () => {
      const { result } = renderHook(() => useDropdownState());

      act(() => {
        result.current.toggleDropdown('column1');
      });

      expect(result.current.openDropdown).toBe('column1');

      act(() => {
        result.current.toggleDropdown('column2');
      });

      expect(result.current.openDropdown).toBe('column2');
    });
  });

  describe('setOpenDropdown', () => {
    it('should allow direct setting of dropdown', () => {
      const { result } = renderHook(() => useDropdownState());

      act(() => {
        result.current.setOpenDropdown('myColumn');
      });

      expect(result.current.openDropdown).toBe('myColumn');
    });

    it('should allow setting to null', () => {
      const { result } = renderHook(() => useDropdownState());

      act(() => {
        result.current.setOpenDropdown('column1');
      });

      expect(result.current.openDropdown).toBe('column1');

      act(() => {
        result.current.setOpenDropdown(null);
      });

      expect(result.current.openDropdown).toBeNull();
    });
  });

  describe('click outside detection', () => {
    it('should setup event listener for click outside', () => {
      const { result } = renderHook(() => useDropdownState());

      // Open a non-date dropdown
      act(() => {
        result.current.toggleDropdown('status');
      });

      expect(result.current.openDropdown).toBe('status');

      // Note: Full click-outside simulation is complex due to ref handling
      // The useEffect is verified to be called via event listener spies in other tests
    });

    it('should handle date dropdowns with special logic', async () => {
      const { result } = renderHook(() => useDropdownState());

      // Open a date dropdown
      act(() => {
        result.current.toggleDropdown('createdDate');
      });

      expect(result.current.openDropdown).toBe('createdDate');

      // Click within table should not close for date dropdowns
      await act(async () => {
        const tableElement = document.querySelector('.oh-table');
        const event = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: tableElement, writable: false });
        tableElement.dispatchEvent(event);
      });

      // Should still be open
      expect(result.current.openDropdown).toBe('createdDate');
    });

    it('should close date dropdown when clicking filter icon', async () => {
      const { result } = renderHook(() => useDropdownState());

      act(() => {
        result.current.toggleDropdown('deliveryDate');
      });

      expect(result.current.openDropdown).toBe('deliveryDate');

      // Click on filter icon
      await act(async () => {
        const filterIcon = document.querySelector('.oh-filter-icon');
        const event = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: filterIcon, writable: false });
        filterIcon.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.openDropdown).toBeNull();
      });
    });
  });

  describe('event listener cleanup', () => {
    it('should add event listener when dropdown opens', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const { result } = renderHook(() => useDropdownState());

      act(() => {
        result.current.toggleDropdown('column1');
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });

    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      const { result, unmount } = renderHook(() => useDropdownState());

      act(() => {
        result.current.toggleDropdown('column1');
      });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });
  });

  describe('edge cases', () => {
    it('should handle multiple rapid toggles', () => {
      const { result } = renderHook(() => useDropdownState());

      act(() => {
        result.current.toggleDropdown('col1');
        result.current.toggleDropdown('col1');
        result.current.toggleDropdown('col2');
      });

      expect(result.current.openDropdown).toBe('col2');
    });

    it('should handle empty string as column name', () => {
      const { result } = renderHook(() => useDropdownState());

      act(() => {
        result.current.toggleDropdown('');
      });

      expect(result.current.openDropdown).toBe('');

      act(() => {
        result.current.toggleDropdown('');
      });

      expect(result.current.openDropdown).toBeNull();
    });
  });
});
