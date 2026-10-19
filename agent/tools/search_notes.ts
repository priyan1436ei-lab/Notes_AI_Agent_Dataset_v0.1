import {defineTool} from 'eve/tools';
import {z} from 'zod';
import {search} from '../../lib/retrieve.mjs';
export default defineTool({
 description:'Search local engineering notes by concept. Always use this before explaining a topic. Returns source IDs and review status; synthetic unreviewed notes are drafts.',
 inputSchema:z.object({query:z.string().min(1).max(4000),department:z.enum(['COMMON','IT','CSE','ECE','EEE','MECH','AI','CSBS','CIVIL']).optional(),semester:z.number().int().min(1).max(8).optional(),regulation:z.string().optional(),university:z.string().optional(),reviewedOnly:z.boolean().optional()}),
 execute({query,...filters}){return search(query,filters,5);}
});
