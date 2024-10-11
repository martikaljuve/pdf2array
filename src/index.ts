import { stripFooters } from './filters/footers';
import { applySlice } from './filters/slice';
import { stripSuperscripts } from './filters/superscript';

export * from './pdf2array';
export { stripFooters, stripSuperscripts, applySlice };
export { pdf2array as default } from './pdf2array';
