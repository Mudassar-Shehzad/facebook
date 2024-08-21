function TruncatedText({ text, limit, userName }) {
    const truncatedText = text.length > limit ? text.slice(0, limit) + '...' : text;
    
    return <p><strong>{userName}</strong> {truncatedText}</p>;
  }
  
  // Usage Example
export default TruncatedText