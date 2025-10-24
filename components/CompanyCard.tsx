import React from 'react';
import { Company } from '../types';
import { LinkIcon, MapPinIcon, DollarSignIcon, CalendarIcon, UsersIcon } from './Icons';

interface CompanyCardProps {
  company: Company;
}

const statusColorMap: { [key: string]: string } = {
  'Established': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Under Development': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'About to Start': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Proposed Investment': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
};

const getStatusClasses = (status: string) => {
    return statusColorMap[status] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
}

const getValidUrl = (url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://${url}`;
};

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg shadow-sm p-5 transition-shadow hover:shadow-md">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{company.name}</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{company.description}</p>
        </div>
        <span className={`inline-block whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-full ${getStatusClasses(company.status)}`}>
          {company.status}
        </span>
      </div>
      <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 truncate">
          <MapPinIcon className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
          {company.googleMapsUrl && company.googleMapsUrl !== 'N/A' ? (
            <a
              href={company.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline truncate"
            >
              {company.location}
            </a>
          ) : (
            <span className="truncate">{company.location}</span>
          )}
        </div>
        {company.investment && company.investment !== 'N/A' && (
          <div className="flex items-center gap-2">
            <DollarSignIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>{company.investment}</span>
          </div>
        )}
        {company.website && company.website !== 'N/A' && (
          <div className="flex items-center gap-2 truncate">
            <LinkIcon className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
            <a href={getValidUrl(company.website)} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate">
              {company.website}
            </a>
          </div>
        )}
        {company.establishedYear && (
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>Est. {company.establishedYear}</span>
          </div>
        )}
        {company.employeeCount && company.employeeCount !== 'N/A' && (
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>{company.employeeCount} employees</span>
          </div>
        )}
      </div>
    </div>
  );
};