import React, { ReactNode } from "react";
import { useEffect } from "react";
import "./index.less";

const WaterfallFlow: React.FC<{ children?: ReactNode | undefined }> = ({
  children,
}) => {
  useEffect(() => {
    let timer = setInterval(() => {});
  }, []);

  return (
    <div className="waterfall">
      <div className="one">{children}</div>
      <div className="two">{children}</div>
    </div>
  );
};

const WaterfallFlowItem: React.FC<{ children?: ReactNode | undefined }> = ({
  children,
}) => {
  return <div className="waterfall-item">{children}</div>;
};

export { WaterfallFlow, WaterfallFlowItem };
