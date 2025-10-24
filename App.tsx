import React, { useState, useCallback, useEffect } from 'react';
import { CompanyStatus, Company } from './types';
import { generateCompanyList } from './services/geminiService';
import { downloadAsCSV } from './utils/csvHelper';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Select } from './components/Select';
import { CompanyCard } from './components/CompanyCard';
import { CompassIcon, DownloadIcon, LoaderIcon, MapPinIcon, AlertTriangleIcon, SunIcon, MoonIcon, BrainIcon } from './components/Icons';
import { Toggle } from './components/Toggle';

const App: React.FC = () => {
  const [domain, setDomain] = useState<string>('Chip manufacturing');
  const [location, setLocation] = useState<string>('Hyderabad, Telangana');
  const [statuses, setStatuses] = useState<CompanyStatus[]>([CompanyStatus.PROPOSED_INVESTMENT]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreResults, setHasMoreResults] = useState<boolean>(true);
  const [isThinkingMode, setIsThinkingMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleStatusChange = (status: CompanyStatus) => {
    setStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        () => {
          setError('Unable to retrieve your location. Please enter it manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!domain || !location || statuses.length === 0) {
      setError('Please fill in all fields and select at least one status.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCompanies([]);
    setHasMoreResults(true); // Reset on new search
    try {
      const result = await generateCompanyList(domain, location, statuses, [], isThinkingMode);
      setCompanies(result);
       if (result.length === 0) {
        setHasMoreResults(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [domain, location, statuses, isThinkingMode]);
  
  const handleLoadMore = useCallback(async () => {
    if (isLoading || isLoadingMore) return;

    setIsLoadingMore(true);
    setError(null);
    try {
        const existingCompanyNames = companies.map(c => c.name);
        const newResults = await generateCompanyList(domain, location, statuses, existingCompanyNames, isThinkingMode);
        if (newResults.length > 0) {
            setCompanies(prev => [...prev, ...newResults]);
        } else {
            setHasMoreResults(false);
        }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while loading more results.');
      console.error(err);
    } finally {
        setIsLoadingMore(false);
    }
}, [domain, location, statuses, companies, isLoading, isLoadingMore, isThinkingMode]);


  const statusOptions = Object.values(CompanyStatus);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8 relative">
          <button
              onClick={toggleTheme}
              className="absolute top-0 right-0 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
          >
              {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6 text-yellow-400" />}
          </button>
          <div className="flex items-center justify-center gap-3 mb-2">
            <CompassIcon className="h-10 w-10 text-blue-600 dark:text-blue-500" />
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100">Corporate Compass AI</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-2">
            Enter an industry and location to discover companies and investment opportunities.
          </p>
        </header>

        <main className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="domain"
              label="Company Domain or Industry"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g., AI in Healthcare"
            />
            <div className="relative">
              <Input
                id="location"
                label="City or Coordinates"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g., San Francisco or 40.7128, -74.0060"
              />
               <button onClick={handleUseMyLocation} className="absolute right-2.5 bottom-2.5 p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Use my location">
                  <MapPinIcon className="h-5 w-5"/>
               </button>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {statusOptions.map(status => (
                <Select
                  key={status}
                  label={status}
                  checked={statuses.includes(status)}
                  onChange={() => handleStatusChange(status)}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 border-t dark:border-slate-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 self-start sm:self-center" title="Uses a more powerful AI model for complex queries. Slower and may take longer to generate.">
                  <label htmlFor="thinking-mode" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      <BrainIcon className="h-5 w-5" />
                      Deep Search
                  </label>
                  <Toggle id="thinking-mode" checked={isThinkingMode} onChange={setIsThinkingMode} />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Button onClick={handleGenerate} disabled={isLoading || isLoadingMore} className="w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Generating...
                    </>
                  ) : (
                    'Generate List'
                  )}
                </Button>
                {companies.length > 0 && (
                   <Button onClick={() => downloadAsCSV(companies, domain)} variant="secondary" className="w-full sm:w-auto">
                     <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
                     Download Excel (CSV)
                   </Button>
                )}
              </div>
          </div>
        </main>
        
        {error && (
            <div className="mt-6 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md flex items-center gap-3">
                <AlertTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400"/>
                <div>
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        )}


        <section className="mt-8">
           {isLoading && (
             <div className="text-center p-8">
               <div role="status" className="flex flex-col items-center justify-center">
                    <LoaderIcon className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="mt-4 text-slate-600 dark:text-slate-400">AI is scanning for opportunities...</p>
                    <span className="sr-only">Loading...</span>
                </div>
             </div>
           )}
          {companies.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Found {companies.length} Results</h2>
              {companies.map((company, index) => (
                <CompanyCard key={`${company.name}-${index}`} company={company} />
              ))}
            </div>
          )}
           {companies.length > 0 && !isLoading && hasMoreResults && (
            <div className="mt-6 text-center">
                <Button onClick={handleLoadMore} disabled={isLoadingMore} variant="secondary">
                    {isLoadingMore ? (
                        <>
                            <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                            Loading More...
                        </>
                    ) : (
                        'Load More Results'
                    )}
                </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default App;