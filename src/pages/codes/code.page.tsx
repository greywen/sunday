import { getLanguages, getQuestion, runCode } from '@apis/code';
import MyEditor from '../../business.components/myEditor';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { ICodeLanguage, IQuestion } from '@interfaces/code';
import { Button, Col, Row, Select } from 'antd';
import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styles from './index.module.less';

const { Option } = Select;

const CodePage = () => {
  const [code, setCode] = useState<string>();
  const [currentLanguage, setCurrentLanguage] =
    useState<ICodeLanguage | null>();
  const [languages, setLnguages] = useState<ICodeLanguage[]>([]);
  const [codeResult, setCodeResult] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
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
  }, []);

  function onChange(newValue: string) {
    setCode(newValue);
  }

  function editorDidMount(editor: any, monaco: any) {
    console.log(editor.getModel().getLineCount());
    editor.focus();
  }

  async function run() {
    setLoading(true);
    const result = await runCode({
      languageId: currentLanguage!.id,
      code
    }).finally(() => {
      setLoading(false);
    });
    setCodeResult(result[0].data || result.message);
  }

  return (
    <>
      {currentLanguage && question && (
        <div className={styles.codePage}>
          <Row>
            <Col span={14}>
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
            <Col span={10}>
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
                  <Button onClick={run} loading={loading}>
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
