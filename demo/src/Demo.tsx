import './Demo.css';

import { pdf2array, Pdf2ArrayOptions } from 'pdf2array';
import { ChangeEvent, useEffect, useState } from 'react';
import { produce } from 'immer';
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, version } from 'pdfjs-dist';

// Set up the worker for pdfs
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;

export function Demo() {
	const [file, setFile] = useState<File | undefined>();
	const [options, setOptions] = useState<Pdf2ArrayOptions>({});
	const [data, setData] = useState<string[][] | undefined>();
	const [error, setError] = useState<string | undefined>();
	const [doc, setDoc] = useState<PDFDocumentProxy | undefined>();

	// Set the file state when the selected file is changed by the user
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		setFile(event.currentTarget.files?.item(0) ?? undefined);
	};

	const handleSetPage = (event: ChangeEvent<HTMLInputElement>) => {
		setOptions(
			produce((draft) => {
				const value = +event.target.value;
				draft.pages = isNaN(value) || value <= 0 ? undefined : [value];
			}),
		);
	};

	const handleStripFooters = (event: ChangeEvent<HTMLInputElement>) => {
		setOptions(
			produce((draft) => {
				draft.stripFooters = event.target?.checked;
			}),
		);
	};

	const handleStripSuperscript = (event: ChangeEvent<HTMLInputElement>) => {
		setOptions(
			produce((draft) => {
				draft.stripSuperscript = event.target?.checked;
			}),
		);
	};

	const handleSetSlice = (event: ChangeEvent<HTMLInputElement>) => {
		setOptions(
			produce((draft) => {
				draft.slice = event.target?.checked;
			}),
		);
	};

	function handleSetYTolerance(event: ChangeEvent<HTMLInputElement>) {
		setOptions(
			produce((draft) => {
				const value = event.target?.valueAsNumber;
				draft.yTolerance = isNaN(value) ? undefined : value;
			}),
		);
	}

	useEffect(() => {
		(async () => {
			if (!file) {
				return;
			}

			const buffer = await file.arrayBuffer();
			const doc = await getDocument(buffer).promise;
			setDoc(doc);
		})();
	}, [file]);

	useEffect(() => {
		let mounted = true;

		(async () => {
			if (!doc) {
				return;
			}

			try {
				const data = await pdf2array(doc, options);

				if (mounted) {
					setData(data);
				}
			} catch (e: any) {
				console.error(e);
				if (mounted) {
					setError(e.message);
				}
			}
		})();

		return () => {
			mounted = false;
		};
	}, [doc, options, setData, setError]);

	return (
		<div className="demo">
			<h1>pdf2array demo</h1>

			<div>
				Load a PDF file below to convert it into an array using{' '}
				<a href={import.meta.env.VITE_REPOSITORY_URL}>pdf2array</a>.
			</div>

			<form>
				<div className="options">
					<div>
						<input
							type="file"
							accept=".pdf, application/pdf"
							onChange={handleFileChange}
						/>
					</div>
					<div>
						<label>
							Page{' '}
							<input
								id="page-input"
								type="number"
								value={(options.pages ? options.pages[0] : '') ?? ''}
								onChange={handleSetPage}
							/>
						</label>
					</div>
					<div>
						<label>
							<input
								id="strip-footers-checkbox"
								type="checkbox"
								checked={!!options.stripFooters}
								onChange={handleStripFooters}
							/>{' '}
							Strip Footers
						</label>
					</div>
					<div>
						<label>
							<input
								id="strip-superscript-checkbox"
								type="checkbox"
								checked={!!options.stripSuperscript}
								onChange={handleStripSuperscript}
							/>{' '}
							Strip Superscript
						</label>
					</div>
					<div>
						<label>
							<input
								id="slice-checkbox"
								type="checkbox"
								checked={!!options.slice}
								onChange={handleSetSlice}
							/>{' '}
							SLICE
						</label>
					</div>
					<div>
						<label>
							yTolerance{' '}
							<input
								id="y-tolerance"
								type="number"
								value={options.yTolerance ?? ''}
								onChange={handleSetYTolerance}
							/>
						</label>
					</div>
				</div>
			</form>

			{(() => {
				if (!!error) {
					return <div className="error">An error occurred: {error}</div>;
				}
			})()}

			{(() => {
				if (!!data) {
					const rows = data.map((row, r) => {
						return (
							<tr key={r}>
								{row.map((item, c) => {
									return <td key={c}>{item}</td>;
								})}
							</tr>
						);
					});

					return (
						<div>
							<table>
								<tbody>{rows}</tbody>
							</table>
						</div>
					);
				}
			})()}
		</div>
	);
}
