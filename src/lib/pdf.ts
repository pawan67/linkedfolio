import pdfParse from "pdf-parse";
/**
 * Extracts text from a PDF buffer using pdf-parse.
 * @param pdfBuffer Buffer or ArrayBuffer containing PDF data
 * @returns Promise<string> Extracted text
 */
export async function extractTextFromPDF(
  pdfBuffer: Buffer | ArrayBuffer
): Promise<string> {
  let buffer: Buffer;
  if (pdfBuffer instanceof Buffer) {
    buffer = pdfBuffer;
  } else if (pdfBuffer instanceof ArrayBuffer) {
    buffer = Buffer.from(pdfBuffer);
  } else {
    throw new Error("Invalid pdfBuffer type");
  }
  const data = await pdfParse(buffer);
  return data.text;
}
