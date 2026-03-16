import type React from 'react';
import type { JSX } from 'react';
const DynamicTag: React.FC<{
  tag: keyof JSX.IntrinsicElements;
  content: string;
  className?: string;
  [key: string]: any; // Добавляем тип для остальных пропсов
}> = ({ tag: Tag, content, className, ...rest }) => (
  <Tag className={className} dangerouslySetInnerHTML={{ __html: content }} {...rest} />
);

export default DynamicTag;