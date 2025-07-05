import { BaseMentionPlugin } from '@platejs/mention';

import { MentionElementStatic } from '@/components/organisms/Editor/elements/mention-node-static';

export const BaseMentionKit = [
  BaseMentionPlugin.withComponent(MentionElementStatic),
];
