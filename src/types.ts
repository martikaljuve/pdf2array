import type { TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';

export type { TextItem, TextContent };

export type TextItemWithPosition = TextItem & {
	x: number;
	y: number;
};

export interface Row {
	page: number;
	rowNumber: number;
	y: number;
	xs: number[];
	items: TextItemWithPosition[];
}

export interface PDFPageProxyLike {
	getTextContent(): Promise<TextContent>;
}

export interface PDFDocumentProxyLike {
	get numPages(): number;
	getPage(pageNumber: number): Promise<PDFPageProxyLike>;
}
