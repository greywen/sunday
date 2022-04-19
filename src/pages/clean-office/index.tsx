import { getCleanOfficeName } from "@apis/clean-office";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { ICleanOffice } from "@interfaces/clean-office";
import React, { useState } from "react";

const CleanOffice = () => {
  const [cleanInfo, setCleanInfo] = useState<ICleanOffice>();
  useAsyncEffect(async () => {
    const data = await getCleanOfficeName();
    setCleanInfo(data);
  }, []);
  return (
    <>
      <h1>{cleanInfo?.current}</h1>
      <h4>{cleanInfo?.next}</h4>
    </>
  );
};

export default CleanOffice;
