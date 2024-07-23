import * as React from "react";

interface Props {
  size?: number;
}

export default React.memo(function CopyIcon({ size = 16 }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={21} fill="none">
      <path
        fill="#B3B3B3"
        fillRule="evenodd"
        d="M4.313.75a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 .75.75v14a.75.75 0 0 1-.75.75H12.25a.75.75 0 0 1 0-1.5h3.563V1.5h-10V6a.75.75 0 0 1-1.5 0V.75Z"
        clipRule="evenodd"
      />
      <path
        fill="#B3B3B3"
        fillRule="evenodd"
        d="M0 6a.75.75 0 0 1 .75-.75h11.5A.75.75 0 0 1 13 6v14a.75.75 0 0 1-.75.75H.75A.75.75 0 0 1 0 20V6Zm1.5.75v12.5h10V6.75h-10Z"
        clipRule="evenodd"
      />
    </svg>
  );
});
