import { getLanguages, runCode } from '@apis/code';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { ICodeLanguage } from '@interfaces/code';
import { Button, Col, Row, Select } from 'antd';
import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styles from './index.module.less';

const { Option } = Select;

const CodeOnlinePage = () => {
  const [code, setCode] = useState<string>();
  const [currentLanguage, setCurrentLanguage] =
    useState<ICodeLanguage | null>();
  const [languages, setLanguages] = useState<ICodeLanguage[]>([]);
  const [codeResult, setCodeResult] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  useAsyncEffect(async () => {
    const languageData = await getLanguages();
    const firstLanguage = languageData[0];
    setCurrentLanguage(firstLanguage);
    setLanguages(languageData);
    setCode(firstLanguage.initialCode);
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
      code,
    }).finally(() => {
      setLoading(false);
    });
    setCodeResult(result.data || result.message);
  }

  return (
    <>
      {currentLanguage && (
        <div className={styles.codePage}>
          <Row className={styles.codeHeader}>
            <Col>
              <Select
                style={{ width: 200 }}
                defaultValue={currentLanguage.name}
                onChange={(value) => {
                  const language = languages.find((x) => x.name === value)!;
                  setCurrentLanguage(language);
                  setCode(language.initialCode);
                }}
              >
                {languages.length > 0 &&
                  languages.map((x) => (
                    <Option key={x.name} value={x.name}>
                      {x.name} - {x.version}
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
        </div>
      )}
    </>
  );
};
export default CodeOnlinePage;
