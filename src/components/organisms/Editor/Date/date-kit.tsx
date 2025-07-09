'use client';

import { DatePlugin } from '@platejs/date/react';

import { DateElement } from '@/components/organisms/Editor/Date/date-node';

export const DateKit = [DatePlugin.withComponent(DateElement)];
