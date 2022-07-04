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
  noBorder = true,
  className,
  onChange,
  onBlur,
}: ITextArea) => {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange && onChange(e.target.value);
  }

  return (
    <TextareaAutosize
      style={{ border: noBorder ? 'none' : '1px solid' }}
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
