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
      <h2 className="text-4xl font-black red-gradient-text mb-1">{title}</h2>
      <p className="text-slate-400 mb-8">{description}</p>
      
      <div className="space-y-6 max-w-2xl">
        {children}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto min-h-[40px]">
          {apiResponse && (
            <div className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-opacity ${
                apiResponse.success 
                ? 'bg-green-900/50 text-green-300' 
                : 'bg-red-900/50 text-red-300'
            }`}>
                {apiResponse.success ? <SuccessIcon /> : <ErrorIcon />}
                <span>{apiResponse.message}</span>
            </div>
          )}
        </div>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full sm:w-auto ml-auto red-gradient-bg text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 disabled:bg-none disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
        >
          {isSaving && <Spinner size="sm" />}
          <span className={isSaving ? 'ml-2' : ''}>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
};
export default SettingsLayout;