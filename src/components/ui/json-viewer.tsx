'use client';

interface JSONViewerProps {
  data: any;
  title?: string;
}

export function JSONViewer({ data, title }: JSONViewerProps) {
  const formatJSON = (obj: any, indent: number = 0): string => {
    const spaces = '  '.repeat(indent);

    if (obj === null) return 'null';
    if (typeof obj === 'boolean') return obj.toString();
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') return `"${obj}"`;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      const items = obj.map((item) => spaces + '  ' + formatJSON(item, indent + 1));
      return '[\n' + items.join(',\n') + '\n' + spaces + ']';
    }

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      const items = keys.map(
        (key) => spaces + '  ' + `"${key}": ` + formatJSON(obj[key], indent + 1)
      );
      return '{\n' + items.join(',\n') + '\n' + spaces + '}';
    }

    return String(obj);
  };

  const jsonString = formatJSON(data);

  return (
    <div className='font-mono text-sm'>
      {title && <div className='mb-2 text-cyan-400 font-semibold'>{title}</div>}
      <pre className='whitespace-pre-wrap break-words'>
        {jsonString.split('\n').map((line, index) => {
          if (line.includes('"')) {
            // Highlight keys (quoted strings before colons)
            const parts = line.split(/(:\s*)/);
            return (
              <div key={index} className='text-white'>
                {parts.map((part, partIndex) => {
                  if (part.match(/^"[^"]*":\s*$/)) {
                    return (
                      <span key={partIndex} className='text-pink-400'>
                        {part}
                      </span>
                    );
                  }
                  if (part.match(/^"[^"]*"$/)) {
                    return (
                      <span key={partIndex} className='text-green-400'>
                        {part}
                      </span>
                    );
                  }
                  if (part.match(/^(null|true|false|\d+)$/)) {
                    return (
                      <span key={partIndex} className='text-cyan-400'>
                        {part}
                      </span>
                    );
                  }
                  if (part.match(/^[{}[\],]$/)) {
                    return (
                      <span key={partIndex} className='text-white'>
                        {part}
                      </span>
                    );
                  }
                  return (
                    <span key={partIndex} className='text-white'>
                      {part}
                    </span>
                  );
                })}
              </div>
            );
          }
          return (
            <div key={index} className='text-white'>
              {line}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
