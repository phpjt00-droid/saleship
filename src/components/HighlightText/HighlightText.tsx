export default function HighlightText({ text, query }) {
  if (!query || !text) return <>{text}</>;
  
  // Escape special characters in the query for safe regex
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <span key={index} className="text-orange-600 bg-orange-100 dark:bg-orange-900/30 font-extrabold px-0.5 rounded-sm">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}
