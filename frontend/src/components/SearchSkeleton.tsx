

const SearchSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5 px-2 md:px-0 animate-pulse">
      <div className="rounded-lg border border-slate-300 p-5 h-fit lg:sticky lg:top-10">
        <div className="hidden md:block h-6 w-1/3 bg-gray-200 rounded mb-5"></div>
        <div className="space-y-5">
          <div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          
          <div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          
          <div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          
          <div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>
        
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-slate-300 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-64 h-48 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-16 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 rounded mt-4"></div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  export default SearchSkeleton;