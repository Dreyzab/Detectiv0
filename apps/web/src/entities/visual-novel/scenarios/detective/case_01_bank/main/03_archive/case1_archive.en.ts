import type { VNContentPack } from '../../../../../model/types';

export const CASE1_ARCHIVE_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'archive_entry': {
            text: 'The New Town Hall archive smells of dust, wax, and old politics. Rows of ledgers disappear into the dark.',
            choices: {
                'archive_request_access': 'Request full case access from the archive keeper.',
                'archive_revisit_casefile': 'Review your compiled archive dossier.',
                'archive_insufficient_leads': 'Try to search with incomplete leads.'
            }
        },
        'archive_insufficient': {
            text: '"Not enough for restricted files," Dr. Voss says, tapping your notes. "Bring me corroborated lead material from all three channels and I can open the sealed shelf."'
        },
        'archive_revisit_summary': {
            text: 'You re-check your notes. The archive packet still points at the rail warehouse, and the entry route remains actionable.'
        },
        'archive_keeper_intro': {
            text: 'Dr. Margarethe Voss unlocks a side cabinet. "Bankhaus Krebs. Condemned lots. Night permits. You will have one hour before this room closes."'
        },
        'archive_research_hub': {
            text: 'Three stacks await: municipal ledgers, stamp books, and old charter addenda.',
            choices: {
                'archive_check_registry': '[Encyclopedia] Cross-reference ownership ledgers and shell registries.',
                'archive_check_stamps': '[Perception] Inspect seal stamps and overwritten inspection marks.',
                'archive_check_customs': '[Tradition] Review historical civic clauses and emergency ordinances.',
                'archive_compile_dossier': 'Assemble the archive packet and close the research pass.'
            }
        },
        'archive_registry_success': {
            text: '[[encyclopedia|Encyclopedia Success]]: The ledgers align. A chain of shell accounts ties Krebs money to a condemned warehouse parcel near the rail yard.'
        },
        'archive_registry_fail': {
            text: '[[encyclopedia|Encyclopedia Failure]]: The handwriting styles blend together. You log partial matches but no clean ownership chain.'
        },
        'archive_stamps_success': {
            text: '[[perception|Perception Success]]: Under fresh ink, you spot an older control stamp. The warehouse watch rotates through a repeatable midnight gap.'
        },
        'archive_stamps_fail': {
            text: '[[perception|Perception Failure]]: The stamp layers are too damaged. You can only estimate patrol timing.'
        },
        'archive_customs_success': {
            text: '[[tradition|Tradition Success]]: A forgotten wartime ordinance still permits emergency access with a municipal counter-sign. A lawful route exists.'
        },
        'archive_customs_fail': {
            text: '[[tradition|Tradition Failure]]: The legal clauses conflict. You leave with ambiguity instead of a clean warrant path.'
        },
        'archive_dossier_resolution': {
            text: 'You collate every page into a single operational packet. The question now is confidence.',
            choices: {
                'archive_resolution_strong': 'Issue a high-confidence warrant packet.',
                'archive_resolution_partial': 'Proceed with a partial packet and accept uncertainty.'
            }
        },
        'archive_resolution_strong_outcome': {
            text: '"This is enough to move," Dr. Voss confirms. "Warehouse file, route timings, legal hook. If you strike tonight, strike decisively."'
        },
        'archive_resolution_partial_outcome': {
            text: '"It will hold, but barely," Dr. Voss warns. "You can proceed, though you may need an improvised approach once you reach the warehouse."'
        }
    }
};

export default CASE1_ARCHIVE_EN;
