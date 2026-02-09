import type { VNContentPack } from '@/entities/visual-novel/model/types';
import contentEn from './interlude_lotte.en';

const contentRu: VNContentPack = {
    ...contentEn,
    locale: 'ru'
};

export default contentRu;
