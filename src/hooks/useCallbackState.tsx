import { useEffect, useState } from "react";

export default function useCallbackState<T>(value?: T) {
  const [data, setData] = useState<T>();

  useEffect(() => {}, [data]);

  return [
    data,
    function (value: T) {
      setData(value);
    },
  ];
}
