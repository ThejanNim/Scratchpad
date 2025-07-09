import { BaseSuggestionPlugin } from '@platejs/suggestion';

import { SuggestionLeafStatic } from '@/components/organisms/Editor/Suggestion/suggestion-node-static';

export const BaseSuggestionKit = [
  BaseSuggestionPlugin.withComponent(SuggestionLeafStatic),
];
