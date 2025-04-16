
const Skeleton = () => {
  return (
   <div className="space-y-6 px-2 md:px-0">
      {/* Star Rating and Title Skeleton */}
      <div>
        <div className="flex gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="h-8 w-64 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Image Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="h-[300px] bg-gray-200 rounded-lg animate-pulse"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1.5s'
            }}
          ></div>
        ))}
      </div>

      {/* Facilities Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="h-12 bg-gray-200 rounded-md animate-pulse"
            style={{
              animationDelay: `${i * 0.05}s`,
              animationDuration: '1.5s'
            }}
          ></div>
        ))}
      </div>

      {/* Description and Form Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div 
              key={i} 
              className={`h-4 bg-gray-200 rounded-full animate-pulse ${i % 2 === 0 ? 'w-11/12' : 'w-full'}`}
              style={{
                animationDelay: `${i * 0.05}s`,
                animationDuration: '1.5s'
              }}
            ></div>
          ))}
        </div>
        <div className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  )
}

export default Skeleton