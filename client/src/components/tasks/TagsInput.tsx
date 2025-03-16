import React, { useState } from 'react';
import Button from '../ui/Button';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  onSuggestTags?: () => void;
  disabled?: boolean;
}

const TagsInput: React.FC<TagsInputProps> = ({ 
  tags, 
  onChange, 
  onSuggestTags,
  disabled = false 
}) => {
  const [tagInput, setTagInput] = useState('');

  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // Add tag to the list
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      onChange([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Remove tag from the list
  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor="tags" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Tags
        </label>
        {onSuggestTags && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onSuggestTags}
            disabled={disabled}
          >
            Suggest Tags
          </Button>
        )}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          id="tags"
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag"
          className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        <Button
          onClick={addTag}
          disabled={!tagInput.trim()}
        >
          Add
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 dark:hover:bg-blue-800 dark:hover:text-blue-200 focus:outline-none"
                aria-label={`Remove ${tag} tag`}
              >
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsInput; 