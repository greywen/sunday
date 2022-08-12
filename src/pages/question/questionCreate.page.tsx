import { getLanguages } from '@apis/language';
import {
  createQuestion,
  getQuestion,
  updateQuestion,
} from '@apis/questionBank';
import MyEditor from '../../business.components/myEditor';
import useAsyncEffect from '@hooks/useAsyncEffect';
import {
  ICodeLanguage,
  IQuestionCase,
  IQuestionCreate,
} from '@interfaces/code';
import { Button, Col, Input, message, Row, Select, Checkbox } from 'antd';
import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './index.module.less';
import { uuidv4 } from '@utils/utils';
import { QuestionLevels } from '@constants/constants';

const { Option } = Select;
let _editor = null as any;

const QuestionCreatePage = () => {
  let navigate = useNavigate();
  const [describe, setDescribe] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] =
    useState<ICodeLanguage | null>();
  const [languages, setLanguages] = useState<ICodeLanguage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<IQuestionCreate>({
    name: '',
    describe: null,
    level: 0,
    cases: [],
    entryCodes: [],
    enabled: false,
  });
  const { questionId } = useParams();

  useAsyncEffect(async () => {
    const languageData = await getLanguages();
    const firstLanguage = languageData[0];
    setCurrentLanguage(firstLanguage);
    setLanguages(languageData);
    await initQuestion(languageData);

    window.onresize = () => {
      _editor?.layout();
    };
  }, []);

  async function initQuestion(languageData: ICodeLanguage[]) {
    let _question = {
      ...question,
      entryCodes: languageData.map((x) => {
        return { languageId: x.id };
      }),
    };

    if (questionId) {
      _question = await getQuestion(questionId);
    }

    setQuestion({
      ..._question,
    });

    setTimeout(() => {
      setDescribe(_question.describe!);
    });
  }

  function onChangeLanguageCode(value: string, languageId: number) {
    const entrys = question.entryCodes.map((x) => {
      if (x.languageId === languageId) x.code = value;
      return x;
    });
    setQuestion({ ...question, entryCodes: entrys });
  }

  function onChangeLanguageCase(value: IQuestionCase) {
    const cases = question.cases?.map((x, _index) => {
      if (x.id === value.id) {
        return value;
      }
      return x;
    });
    setQuestion({ ...question, cases: [...cases!] });
  }

  function onAddLanguageCase() {
    question.cases?.push({
      id: uuidv4(),
      languageId: currentLanguage!.id,
    });
    setQuestion({ ...question });
  }

  function onRemoveCase(id: string) {
    const cases = question.cases?.filter((x) => x.id != id);
    setQuestion({ ...question, cases: cases });
  }

  function editorDidMount(editor: any, monaco: any) {
    _editor = editor;
    editor.focus();
  }

  function verifyQuestion() {
    if (!question.name) {
      message.error('题目名称不能为空');
      return true;
    }
    if (question.cases?.length === 0) {
      message.error('测试用例不能为空');
      return true;
    }
    if (describe === '<p><br></p>' || !describe) {
      message.error('题目描述不能为空');
      return true;
    }
    if (
      !question.entryCodes.some((x) => x.function) ||
      !question.entryCodes.some((x) => x.code)
    ) {
      message.error('入口代码/方法不能为空');
      return true;
    }
  }
  async function onSave() {
    if (verifyQuestion()) {
      return;
    }

    setLoading(true);

    const cases = question.cases?.filter((x) => {
      if (x.comments && x.input && x.output) return x;
    });
    const params = { ...question, cases: cases, describe: describe };

    let result = null;

    if (questionId) {
      result = await updateQuestion({ ...params, id: questionId });
    } else {
      result = await createQuestion(params);
    }

    if (result?.id) {
      if (questionId) {
        message.success('操作成功', () => {
          setLoading(false);
        });
      } else {
        message.success('操作成功，等待管理员审核！', () => {
          navigate('/question');
          setLoading(false);
        });
      }
    } else {
      message.error('操作失败，请稍后再试！', () => {
        setLoading(false);
      });
    }
  }

  return (
    <>
      {currentLanguage && (
        <div className={styles.questionDetailPage}>
          <Row>
            <Col span={10} className={styles.questionContent}>
              <Row>
                <div className={styles.questionCard}>
                  <Row>
                    <Col span={12}>
                      <Input
                        placeholder='题目名称 例如：最长回文子串'
                        value={question.name}
                        onChange={(event) => {
                          setQuestion({
                            ...question,
                            name: event.target.value,
                          });
                        }}
                      ></Input>
                    </Col>
                    <Col span={12}>
                      <Select
                        style={{ width: '100%' }}
                        defaultValue={question.level}
                        onChange={(value) => {
                          setQuestion({ ...question, level: value });
                        }}
                      >
                        {QuestionLevels.map((x, index) => (
                          <Option key={`level-${index}`} value={index}>
                            {x}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>
                  <Col span={24}>
                    <MyEditor
                      html={describe}
                      placeholder='题目描述 例如: 给你一个字符串 s ,找到 s 中最长的回文子串。'
                      onChange={(value) => setDescribe(value)}
                    />
                  </Col>
                </div>
                <Col
                  style={{ margin: '8px' }}
                  span={24}
                  dangerouslySetInnerHTML={{ __html: describe || '' }}
                ></Col>
              </Row>
            </Col>
            <Col span={14}>
              <div className={styles.questionCard}>
                <Row className={styles.questionHeader}>
                  <Col span={20}>
                    <Select
                      style={{ width: 200 }}
                      defaultValue={currentLanguage.name}
                      onChange={(name) => {
                        const _language = languages.find(
                          (x) => x.name === name
                        )!;
                        setCurrentLanguage(_language);
                        onChangeLanguageCode(
                          question.entryCodes.find(
                            (x) => x.languageId === _language.id
                          )?.code || '',
                          _language.id
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
                  <Col span={4} style={{ textAlign: 'right' }}>
                    <Checkbox
                      checked={question.enabled}
                      onChange={(event) => {
                        setQuestion({
                          ...question,
                          enabled: event.target.checked,
                        });
                      }}
                    >
                      是否展示
                    </Checkbox>
                    {questionId ? (
                      <Button loading={loading} onClick={onSave} type='primary'>
                        更新
                      </Button>
                    ) : (
                      <Button loading={loading} onClick={onSave} type='primary'>
                        保存
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>
              <div className={styles.questionCard}>
                <MonacoEditor
                  height='20vh'
                  language={currentLanguage.name}
                  value={
                    question.entryCodes.find(
                      (x) => x.languageId === currentLanguage.id
                    )?.code
                  }
                  options={{
                    selectOnLineNumbers: true,
                    colorDecorators: true,
                    selectionHighlight: true,
                    minimap: { enabled: false },
                  }}
                  onChange={(value) => {
                    onChangeLanguageCode(value, currentLanguage.id);
                  }}
                  editorDidMount={editorDidMount}
                />
                <Row>
                  <Col span={24}>
                    <Input
                      placeholder='入口方法 例如: longestPalindrome'
                      value={
                        question.entryCodes?.find(
                          (x) => x.languageId === currentLanguage.id
                        )?.function
                      }
                      onChange={(event) => {
                        const entrys = question.entryCodes.map((x) => {
                          if (x.languageId === currentLanguage.id)
                            x.function = event.target.value;
                          return x;
                        });
                        setQuestion({ ...question, entryCodes: entrys });
                      }}
                    />
                  </Col>
                </Row>
              </div>
              <div className={styles.questionCard}>
                <Row style={{ padding: '12px 0' }}>
                  <Col>
                    <Button onClick={onAddLanguageCase}>添加测试用例</Button>
                  </Col>
                </Row>

                {question.cases
                  ?.filter((x) => x.languageId === currentLanguage.id)
                  .map((item, index) => (
                    <Row style={{ padding: '4px 0' }} key={'case' + index}>
                      <Col
                        span={24}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Input
                          placeholder='测试用例描述'
                          value={item.comments}
                          onChange={(event) =>
                            onChangeLanguageCase({
                              ...item,
                              comments: event.target.value,
                            })
                          }
                        />
                        <Button danger onClick={() => onRemoveCase(item.id)}>
                          移除
                        </Button>
                      </Col>
                      <Col span={24}>
                        <Input
                          placeholder='输入'
                          value={item.input}
                          onChange={(event) =>
                            onChangeLanguageCase({
                              ...item,
                              input: event.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col span={24}>
                        <Input
                          placeholder='输出'
                          value={item.output}
                          onChange={(event) =>
                            onChangeLanguageCase({
                              ...item,
                              output: event.target.value,
                            })
                          }
                        />
                      </Col>
                    </Row>
                  ))}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};
export default QuestionCreatePage;
