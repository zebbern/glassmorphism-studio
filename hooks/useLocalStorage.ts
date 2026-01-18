"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    setIsInitialized(true);
  }, [key]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  // Remove item from storage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Hook for managing multiple saved configurations
export function useSavedConfigurations<T extends { id: string }>(
  storageKey: string,
) {
  const [configs, setConfigs, clearConfigs] = useLocalStorage<T[]>(
    storageKey,
    [],
  );

  const addConfig = useCallback(
    (config: T) => {
      setConfigs((prev) => [...prev, config]);
    },
    [setConfigs],
  );

  const updateConfig = useCallback(
    (id: string, updates: Partial<T>) => {
      setConfigs((prev) =>
        prev.map((config) =>
          config.id === id ? { ...config, ...updates } : config,
        ),
      );
    },
    [setConfigs],
  );

  const removeConfig = useCallback(
    (id: string) => {
      setConfigs((prev) => prev.filter((config) => config.id !== id));
    },
    [setConfigs],
  );

  const getConfig = useCallback(
    (id: string) => {
      return configs.find((config) => config.id === id);
    },
    [configs],
  );

  return {
    configs,
    addConfig,
    updateConfig,
    removeConfig,
    getConfig,
    clearConfigs,
  };
}
