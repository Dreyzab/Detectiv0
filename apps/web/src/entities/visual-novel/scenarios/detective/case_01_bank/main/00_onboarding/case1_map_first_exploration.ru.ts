import type { VNContentPack } from '@/entities/visual-novel/model/types';
import contentEn from './case1_map_first_exploration.en';

const contentRu: VNContentPack = {
    ...contentEn,
    locale: 'ru'
};

export default contentRu;
