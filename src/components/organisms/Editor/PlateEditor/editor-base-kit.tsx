import { BaseAlignKit } from '../BasicStyles/Align/align-base-kit';
import { BaseBasicBlocksKit } from '../BasicNodes/basic-blocks-base-kit';
import { BaseBasicMarksKit } from '../BasicMarks/basic-marks-base-kit';
import { BaseCalloutKit } from '../Callout/callout-base-kit';
import { BaseCodeBlockKit } from '../CodeBlock/code-block-base-kit';
import { BaseColumnKit } from '../Layout/column-base-kit';
import { BaseCommentKit } from '../Comment/comment-base-kit';
import { BaseDateKit } from '../Date/date-base-kit';
import { BaseFontKit } from '../BasicStyles/Font/font-base-kit';
import { BaseLineHeightKit } from '../BasicStyles/LineHeight/line-height-base-kit';
import { BaseLinkKit } from '../Link/link-base-kit';
import { BaseListKit } from '../List/list-base-kit';
import { MarkdownKit } from '../Markdown/markdown-kit';
import { BaseMathKit } from '../Equation/math-base-kit';
import { BaseMediaKit } from '../Media/media-base-kit';
import { BaseMentionKit } from '../Mention/mention-base-kit';
import { BaseSuggestionKit } from '../Suggestion/suggestion-base-kit';
import { BaseTableKit } from '../Table/table-base-kit';
import { BaseTocKit } from '../TableOfContent/toc-base-kit';
import { BaseToggleKit } from '../Toggle/toggle-base-kit';

export const BaseEditorKit = [
  ...BaseBasicBlocksKit,
  ...BaseCodeBlockKit,
  ...BaseTableKit,
  ...BaseToggleKit,
  ...BaseTocKit,
  ...BaseMediaKit,
  ...BaseCalloutKit,
  ...BaseColumnKit,
  ...BaseMathKit,
  ...BaseDateKit,
  ...BaseLinkKit,
  ...BaseMentionKit,
  ...BaseBasicMarksKit,
  ...BaseFontKit,
  ...BaseListKit,
  ...BaseAlignKit,
  ...BaseLineHeightKit,
  ...BaseCommentKit,
  ...BaseSuggestionKit,
  ...MarkdownKit,
];
