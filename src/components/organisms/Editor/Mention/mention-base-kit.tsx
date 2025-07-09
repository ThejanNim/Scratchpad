import { BaseMentionPlugin } from '@platejs/mention';

import { MentionElementStatic } from '@/components/organisms/Editor/Mention/mention-node-static';

export const BaseMentionKit = [
  BaseMentionPlugin.withComponent(MentionElementStatic),
];
