import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('file');
  const algorithmName = searchParams.get('algorithm');

  if (!fileName) {
    return NextResponse.json(
      { error: 'File parameter is required' },
      { status: 400 }
    );
  }

  // Security: Prevent directory traversal
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return NextResponse.json(
      { error: 'Invalid file name' },
      { status: 400 }
    );
  }

  // Determine the results directory path
  const resultsDir = process.env.RESULTS_DIR || '/Users/utkarshsharma/saas/results';
  const testRunDir = process.env.TEST_RUN_DIR || 'example-lsb/test-run';
  const filePath = path.join(resultsDir, testRunDir, fileName);

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Get file stats
    const stats = fs.statSync(filePath);

    // Read file content
    const fileContent = fs.readFileSync(filePath);

    // Determine content type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream';

    if (ext === '.csv') {
      contentType = 'text/csv';
    } else if (ext === '.md') {
      contentType = 'text/markdown';
    } else if (ext === '.json') {
      contentType = 'application/json';
    }

    // Generate filename with algorithm name if provided
    let downloadFilename = fileName;
    if (algorithmName) {
      const cleanName = algorithmName.replace(/\s+/g, '-').toLowerCase();
      const baseName = path.basename(fileName, path.extname(fileName));
      downloadFilename = `${baseName}-${cleanName}${ext}`;
    }

    // Create response with file content
    const response = new NextResponse(fileContent);

    // Set headers
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Length', stats.size.toString());
    response.headers.set('Content-Disposition', `attachment; filename="${downloadFilename}"`);

    return response;

  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}