import React from 'react';
import Spinner from '../Spinner';
import { SuccessIcon, ErrorIcon } from '../Icons';
import type { ApiResponse } from '../../types';

interface SettingsLayoutProps {
  title: string;
  description: string;
  isSaving: boolean;
  onSave: () => void;
  apiResponse: ApiResponse | null;
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ title, description, isSaving, onSave, apiResponse, children }) => {
  return (
    <div className="p-6 md:p-8 animate-fade-in-up">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h2 className="text-3xl font-bold text-white mb-1">{title}</h2>
            <p className="text-zinc-400 max-w-2xl">{description}</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
             {apiResponse && (
                <div className={`flex items-center gap-2 text-sm transition-opacity ${
                    apiResponse.success 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                    {apiResponse.success ? <SuccessIcon /> : <ErrorIcon />}
                    <span>{apiResponse.message}</span>
                </div>
            )}
            <button
                onClick={onSave}
                disabled={isSaving}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-md flex items-center justify-center transition-all duration-200 disabled:bg-zinc-600 disabled:cursor-not-allowed"
            >
                {isSaving && <Spinner size="sm" />}
                <span className={isSaving ? 'ml-2' : ''}>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
        </div>
      </div>
      
      <div className="space-y-6 max-w-2xl">
        {children}
      </div>
    </div>
  );
};
export default SettingsLayout;