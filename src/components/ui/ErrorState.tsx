import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Couldn't load data",
  message,
  onRetry,
}) => {
  return (
    <div className="p-6 rounded-[22px] bg-red-50/50 border border-red-200/80 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
        <span className="material-symbols-outlined text-[20px]">error_outline</span>
      </div>
      <div>
        <h4 className="text-[14px] font-bold text-red-900">{title}</h4>
        <p className="text-[12px] text-red-700 mt-0.5 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-red-200 text-red-800 text-[12px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[15px]">refresh</span>
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export const EmptyState: React.FC<{ title: string; description: string; icon?: string }> = ({
  title,
  description,
  icon = 'inbox',
}) => {
  return (
    <div className="p-8 rounded-[22px] bg-slate-50/60 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-2">
      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </div>
      <h4 className="text-[13.5px] font-bold text-slate-800">{title}</h4>
      <p className="text-[11.5px] text-slate-500 max-w-xs leading-relaxed">{description}</p>
    </div>
  );
};
