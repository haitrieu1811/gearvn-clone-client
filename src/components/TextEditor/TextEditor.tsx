import MarkdownIt from 'markdown-it';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

interface TextEditorProps {
  onChange?: ({ html, text }: { html: string; text: string }) => void;
  value?: string;
  name?: string;
  errorMessage?: string;
  placeholder?: string;
}

const TextEditor = ({ onChange, value, name, errorMessage, placeholder }: TextEditorProps) => {
  const handleEditorChange = ({ html, text }: { html: string; text: string }) => {
    onChange && onChange({ html, text });
  };

  return (
    <Fragment>
      <MdEditor
        style={{ height: '300px' }}
        name={name}
        renderHTML={(text) => mdParser.render(text)}
        value={value}
        onChange={handleEditorChange}
        placeholder={placeholder}
      />
      {errorMessage && <div className='text-sm text-red-500 mt-2'>{errorMessage}</div>}
    </Fragment>
  );
};

TextEditor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  name: PropTypes.string,
  errorMessage: PropTypes.string,
  placeholder: PropTypes.string
};

export default TextEditor;
