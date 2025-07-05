import { BaseTocPlugin } from '@platejs/toc';

import { TocElementStatic } from '@/components/organisms/Editor/elements/toc-node-static';

export const BaseTocKit = [BaseTocPlugin.withComponent(TocElementStatic)];
