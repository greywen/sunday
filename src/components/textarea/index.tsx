import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './index.module.less';

interface ITextArea {
  value?: string;
  disabled?: boolean;
  noBorder?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  className?: string;
  rows?: number;
  onChange?: (value?: string) => void;
  onBlur?: () => void;
}

const TextArea = ({
  disabled,
  value,
  placeholder,
  className,
  onChange,
  onBlur,
}: ITextArea) => {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange && onChange(e.target.value);
  }

  return (
    <TextareaAutosize
      disabled={disabled}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={[styles.textarea, className].join(' ')}
      value={value || ''}
    />
  );
};

export default TextArea;
