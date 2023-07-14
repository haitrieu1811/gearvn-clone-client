import MarkdownIt from 'markdown-it';
import { Fragment } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

interface MarkdownEditorProps {
  placeholder?: string;
  className?: string;
  onChange?: (html: string) => void;
  name?: string;
  errorMesssage?: string;
  value?: string;
  _ref?: any;
}

const MarkdownEditor = ({
  placeholder,
  className,
  name,
  onChange,
  value,
  _ref,
  errorMesssage
}: MarkdownEditorProps) => {
  const handleEditorChange = ({ html }: { html: string; text: string }) => {
    onChange && onChange(html);
  };

  return (
    <Fragment>
      <MdEditor
        ref={_ref}
        name={name}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        placeholder={placeholder}
        className={className}
        value={value}
      />
      {errorMesssage && <p className='text-sm text-red-500 mt-2 font-medium'>{errorMesssage}</p>}
    </Fragment>
  );
};

export default MarkdownEditor;
