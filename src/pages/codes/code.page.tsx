import { getLanguages, getQuestion, runCode, runCodeByCase } from '@apis/code';
import MyEditor from '../../business.components/myEditor';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { ICodeLanguage, IQuestion } from '@interfaces/code';
import { Button, Col, Row, Select } from 'antd';
import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styles from './index.module.less';

const { Option } = Select;

const CodePage = () => {
  let _editor = null as any;
  const [code, setCode] = useState<string>();
  const [currentLanguage, setCurrentLanguage] =
    useState<ICodeLanguage | null>();
  const [languages, setLnguages] = useState<ICodeLanguage[]>([]);
  const [codeResult, setCodeResult] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAll, setLoadingAll] = useState<boolean>(false);
  const [question, setQuestion] = useState<IQuestion>();
  useAsyncEffect(async () => {
    const languageData = await getLanguages();
    setCurrentLanguage(languageData[0]);
    setLnguages(languageData);

    const questionData = await getQuestion(
      'c648d4bd-7ec6-4452-8344-7eec0db93670'
    );
    setQuestion(questionData);
    setCode(questionData.code);
    window.onresize = () => {
      _editor?.layout();
    };
  }, []);

  function onChange(newValue: string) {
    setCode(newValue);
  }

  function editorDidMount(editor: any, monaco: any) {
    _editor = editor;
    editor.focus();
  }

  async function run() {
    setLoading(true);
    const data = await runCodeByCase({
      languageId: currentLanguage!.id,
      questionId: 'c648d4bd-7ec6-4452-8344-7eec0db93670',
      code,
      once: true,
    }).finally(() => {
      setLoading(false);
    });
    setCodeResult(data[0].logs);
  }

  async function runAllCase() {
    setLoadingAll(true);
    const data = await runCodeByCase({
      languageId: currentLanguage!.id,
      questionId: 'c648d4bd-7ec6-4452-8344-7eec0db93670',
      code,
    }).finally(() => {
      setLoadingAll(false);
    });

    let result = '';
    data.forEach((x, index) => {
      const isPass =
        JSON.stringify(x.output.replaceAll(' ', '')) ==
        JSON.stringify(x.codeOutput?.replaceAll(' ', ''));
      console.log(isPass, x.codeOutput, x.output);
      result += `测试${index + 1}：${x.comments}\n输入：${x.input}\n输出：${
        x.output
      }\n实际输出：${x.codeOutput}\n运行时长：${x.elapsedTime}\n${
        isPass ? '通过' : '未通过'
      }\n\n`;
    });
    setCodeResult(result);
  }

  return (
    <>
      {currentLanguage && question && (
        <div className={styles.codePage}>
          <Row>
            <Col span={10} className={styles.questionContent}>
              <Row>
                <Col span={24}>
                  <h2>{question.name}</h2>
                </Col>
                <Col
                  span={24}
                  dangerouslySetInnerHTML={{ __html: question!.desribe }}
                ></Col>
              </Row>
            </Col>
            <Col span={14}>
              <Row className={styles.codeHeader}>
                <Col>
                  <Select
                    style={{ width: 200 }}
                    defaultValue={currentLanguage.name}
                    onChange={(value) => {
                      setCurrentLanguage(
                        languages.find((x) => x.name === value)!
                      );
                    }}
                  >
                    {languages.length > 0 &&
                      languages.map((x) => (
                        <Option key={x.name} value={x.name}>
                          {x.name}
                        </Option>
                      ))}
                  </Select>
                </Col>
              </Row>

              <MonacoEditor
                height='50vh'
                language={currentLanguage.name}
                value={code}
                options={{
                  selectOnLineNumbers: true,
                  colorDecorators: true,
                  selectionHighlight: true,
                }}
                onChange={onChange}
                editorDidMount={editorDidMount}
              />

              <Row className={styles.codeAtcions}>
                <Col>
                  <Button onClick={runAllCase} loading={loadingAll}>
                    {loadingAll ? '执行中，请稍后...' : '执行所有测试用例'}
                  </Button>
                </Col>
                <Col>
                  <Button onClick={run} loading={loading} disabled={loadingAll}>
                    {loading ? '正在执行' : '执行'}
                  </Button>
                </Col>
              </Row>

              <Row className={styles.codeOutput}>
                <Col
                  dangerouslySetInnerHTML={{
                    __html: codeResult?.replace(/[\n]/g, '<br />'),
                  }}
                ></Col>
              </Row>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};
export default CodePage;
