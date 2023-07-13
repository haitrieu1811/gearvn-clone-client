import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

interface MarkdownEditorProps {
  placeholder?: string;
  value?: string;
  className?: string;
  onChange?: (html: string) => void;
}

const MarkdownEditor = ({ placeholder, value, className, onChange }: MarkdownEditorProps) => {
  const handleEditorChange = ({ html }: { html: string; text: string }) => {
    onChange && onChange(html);
  };

  return (
    <MdEditor
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
      placeholder={placeholder}
      value={value}
      className={className}
    />
  );
};

export default MarkdownEditor;
