import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import pdf2array from '../src/index';
// import { configureUnPDF } from "unpdf";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

// configureUnPDF({
//     pdfjs: () => import("pdfjs-dist"),
// });

describe('pdf2array', () => {
	it('should read a pdf file into an array', async () => {
		const data = fs.readFileSync(path.resolve(__dirname, './file-sample_150kB.pdf'));
		expect(data).not.toBeNull();

		const array = await pdf2array(new Uint8Array(data));
		expect(array).not.toBeNull();
		expect(array.length).toEqual(97);
		expect(array[43]).toEqual(['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum']);
	});

	it('should strip footers', async () => {
		const data = fs.readFileSync(path.resolve(__dirname, './with_footer.pdf'));
		expect(data).not.toBeNull();

		// With footers first
		const withFooters = await pdf2array(new Uint8Array(data), {
			stripFooters: false,
		});

		expect(withFooters).not.toBeNull();
		expect(withFooters[withFooters.length - 1]).toEqual([
			'Page 4',
			'Lorem ipsum',
			'Tuesday, December 6, 2022',
		]);

		// Now without footers
		const withoutFooters = await pdf2array(new Uint8Array(data), {
			stripFooters: true,
		});

		expect(withoutFooters).not.toBeNull();
		expect(withoutFooters[withoutFooters.length - 1]).toEqual(['amet id sapien.']);
	});

	it('should strip superscript', async () => {
		const data = fs.readFileSync(path.resolve(__dirname, './with_footnote.pdf'));
		expect(data).not.toBeNull();

		// With superscript first
		const withSuperscript = await pdf2array(new Uint8Array(data), {
			stripSuperscript: false,
		});

		expect(withSuperscript).not.toBeNull();
		expect(withSuperscript[0]).toEqual(['1', '2']);

		// Without superscript
		const withoutSuperscript = await pdf2array(new Uint8Array(data), {
			stripSuperscript: true,
		});

		expect(withoutSuperscript).not.toBeNull();
		expect(withoutSuperscript[0]).toEqual(['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum']);
	});
});
