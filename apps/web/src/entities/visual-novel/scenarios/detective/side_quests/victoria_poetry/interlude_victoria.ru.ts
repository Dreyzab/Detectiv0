import type { VNContentPack } from '@/entities/visual-novel/model/types';
import contentEn from './interlude_victoria.en';

const contentRu: VNContentPack = {
    ...contentEn,
    locale: 'ru'
};

export default contentRu;
