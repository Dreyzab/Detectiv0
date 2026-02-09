import type { VNContentPack } from '@/entities/visual-novel/model/types';
import contentEn from './quest_lotte_wires.en';

const contentRu: VNContentPack = {
    ...contentEn,
    locale: 'ru'
};

export default contentRu;
