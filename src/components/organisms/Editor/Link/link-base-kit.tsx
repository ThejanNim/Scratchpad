import { BaseLinkPlugin } from '@platejs/link';

import { LinkElementStatic } from '@/components/organisms/Editor/Link/link-node-static';

export const BaseLinkKit = [BaseLinkPlugin.withComponent(LinkElementStatic)];
