import type { VNContentPack } from '@/entities/visual-novel/model/types';
import contentEn from './case1_qr_scan_bank.en';

const contentRu: VNContentPack = {
    ...contentEn,
    locale: 'ru'
};

export default contentRu;
