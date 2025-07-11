import { BaseTocPlugin } from '@platejs/toc';

import { TocElementStatic } from '@/components/organisms/Editor/TableOfContent/toc-node-static';

export const BaseTocKit = [BaseTocPlugin.withComponent(TocElementStatic)];
