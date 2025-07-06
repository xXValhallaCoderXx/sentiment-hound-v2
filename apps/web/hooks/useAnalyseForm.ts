"use client";

import { useState, useCallback } from "react";
import { validateUrl } from "@/lib/validation/url.validation";

export interface AnalyseFormState {
  url: string;
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AnalyseFormActions {
  setUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearForm: () => void;
  resetError: () => void;
}

export interface UseAnalyseFormReturn {
  state: AnalyseFormState;
  actions: AnalyseFormActions;
}

const initialState: AnalyseFormState = {
  url: "",
  isValid: false,
  isLoading: false,
  error: null,
};

export const useAnalyseForm = (): UseAnalyseFormReturn => {
  const [state, setState] = useState<AnalyseFormState>(initialState);

  const setUrl = useCallback((url: string) => {
    // Use the comprehensive URL validation utility
    const validation = validateUrl(url);
    
    setState(prev => ({
      ...prev,
      url,
      isValid: validation.isValid,
      error: validation.isValid ? null : validation.error || null,
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false,
    }));
  }, []);

  const clearForm = useCallback(() => {
    setState(initialState);
  }, []);

  const resetError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const actions: AnalyseFormActions = {
    setUrl,
    setLoading,
    setError,
    clearForm,
    resetError,
  };

  return {
    state,
    actions,
  };
};
