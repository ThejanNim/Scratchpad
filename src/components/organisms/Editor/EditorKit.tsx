'use client';

import { type Value, TrailingBlockPlugin } from 'platejs';
import { type TPlateEditor, useEditorRef } from 'platejs/react';

import { AIKit } from './AI/ai-kit';
import { AutoformatKit } from './AutoFormat/autoformat-kit';
import { BasicBlocksKit } from './BasicNodes/basic-blocks-kit';
import { BasicMarksKit } from './BasicMarks/basic-marks-kit';
import { BlockMenuKit } from './BlockSelection/block-menu-kit';
import { BlockPlaceholderKit } from './BlockPlaceholder/block-placeholder-kit';
import { CalloutKit } from './Callout/callout-kit';
import { CodeBlockKit } from './CodeBlock/code-block-kit';
import { ColumnKit } from './Layout/column-kit';
import { CommentKit } from './Comment/comment-kit';
import { DateKit } from './Date/date-kit';
import { DiscussionKit } from './Discussion/discussion-kit';
import { DndKit } from './DragAndDrop/dnd-kit';
import { DocxKit } from './Docx/docx-kit';
import { EmojiKit } from './Emoji/emoji-kit';
import { ExitBreakKit } from './ExitBreak/exit-break-kit';
import { FloatingToolbarKit } from './Toolbar/FloatingToolbar/floating-toolbar-kit';
import { FontKit } from './BasicStyles/Font/font-kit';
import { LineHeightKit } from './BasicStyles/LineHeight/line-height-kit';
import { LinkKit } from './Link/link-kit';
import { ListKit } from './List/list-kit';
import { MarkdownKit } from './Markdown/markdown-kit';
import { MathKit } from './Equation/math-kit';
import { MediaKit } from './Media/media-kit';
import { MentionKit } from './Mention/mention-kit';
import { SlashKit } from './SlashCommand/slash-kit';
import { TableKit } from './Table/table-kit';
import { TocKit } from './TableOfContent/toc-kit';
import { ToggleKit } from './Toggle/toggle-kit';
import { ActionKit } from './Action/action-kit';
import { AlignKit } from './BasicStyles/Align/align-kit';
import { CursorOverlayKit } from './BlockSelection/cursor-overlay-kit';
import { SuggestionKit } from './Suggestion/suggestion-kit';

export const EditorKit = [
  // Scratch
  ...ActionKit,

  ...AIKit,
  ...BlockMenuKit,

  // Elements
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...ToggleKit,
  ...TocKit,
  ...MediaKit,
  ...CalloutKit,
  ...ColumnKit,
  ...MathKit,
  ...DateKit,
  ...LinkKit,
  ...MentionKit,

  // Marks
  ...BasicMarksKit,
  ...FontKit,

  // Block Style
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,

  // Collaboration
  ...DiscussionKit,
  ...CommentKit,
  ...SuggestionKit,

  // Editing
  ...SlashKit,
  ...AutoformatKit,
  ...CursorOverlayKit,
  ...DndKit,
  ...EmojiKit,
  ...ExitBreakKit,
  TrailingBlockPlugin,

  // Parsers
  ...DocxKit,
  ...MarkdownKit,

  // UI
  ...BlockPlaceholderKit,
  // ...FixedToolbarKit,
  ...FloatingToolbarKit,
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
