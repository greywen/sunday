import { getProjects } from '@apis/jasads';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { IProjectModel } from '@interfaces/jasads';
import { Row } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.less';

const JasadsPage = () => {
  const [projects, setProjects] = useState<IProjectModel[]>([]);
  const navigate = useNavigate();
  useAsyncEffect(async () => {
    const _project = await getProjects();
    setProjects(_project);
    navigate('/jasads/details/' + _project[0].id);
  }, []);

  return (
    <Row className='jasads-page'>
      <Row className='jasads-card'></Row>
    </Row>
  );
};

export default JasadsPage;
