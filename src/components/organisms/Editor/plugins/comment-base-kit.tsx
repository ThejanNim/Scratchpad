import { BaseCommentPlugin } from '@platejs/comment';

import { CommentLeafStatic } from '@/components/organisms/Editor/elements/comment-node-static';

export const BaseCommentKit = [
  BaseCommentPlugin.withComponent(CommentLeafStatic),
];
