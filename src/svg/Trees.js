import React from 'react';

const Trees = (props) => {
  return (
    <svg viewBox="0 0 2893 1929" {...props}>
      <path d="M2890.6 1534.2zM2889.1 1535.5c.5-.4 1-.8 1.4-1.2l-1.6-.3.2 1.5z" />
      <path d="M2782 871.6v1.8h.1l-.1-1.8zM1764.3 706.6v-.1zM1917.3 437.1l-1.4-.1.2 1.1-1.1-.1-.1 1.6c.8-.9 1.9-1.7 2.4-2.5zM1762.9 705.1l.2-1.2-1.6.3c.8.9 1.7 1.8 2.7 2.4l-.3-1.6-1 .1zM2683.4 1686h-1.5 1.5z" />
    </svg>
  );
}
const MemoTrees = React.memo(Trees);
export default MemoTrees;